---
title: "El mejor editor de Markdown en 2026: once editores comparados por lo que le hacen a tus archivos"
description: Comparamos once editores de Markdown en 2026 -VS Code, Obsidian, Typora, iA Writer, Zettlr, Notion y Vim- según dónde guardan tu texto y qué exportan al final.
date: 2026-09-07
tag: Workflow
keywords: mejor editor markdown 2026, mejor editor markdown gratis, editor markdown con vista previa en vivo, editor markdown que exporta a html, obsidian o typora, exportar notion a markdown, editor markdown para windows, mejor editor markdown para mac
---

La mayoría de las comparativas de editores de Markdown comparan la escritura en sí: cuál tiene la tipografía más bonita, cuál atenúa el párrafo en el que no estás trabajando, cuál esconde los asteriscos. Eso es lo que notas el primer día, y lo que menos importa a partir del sexto mes.

Lo que importa después es más aburrido. ¿Dónde guarda el editor tu texto: en archivos que ves en un gestor de archivos, o en un servicio al que tienes que pedirle una copia? ¿Qué sintaxis añade que ninguna otra herramienta entiende? ¿Y qué sale cuando alguien dice «¿me lo puedes mandar como página web?», que es la pregunta que deja al descubierto cada atajo que tomó el editor mientras tú disfrutabas de la fuente.

Aquí comparamos once editores en esos términos. Algunos son editores de texto con soporte para Markdown, algunos son aplicaciones de escritura, y uno no es un editor de Markdown en absoluto — está en la lista porque media audiencia lo usa como si lo fuera.

### Resumen rápido

Si ya tienes VS Code abierto, es el mejor editor de Markdown que vas a encontrar sin instalar nada, porque tus archivos siguen siendo archivos y git ya los conoce. Si quieres una aplicación de escritura cómoda sobre una carpeta de archivos `.md` normales, Typora e iA Writer son las dos que merece la pena pagar. Typora cuesta 14,99 $ sin impuestos, pago único, para hasta tres dispositivos, con quince días de prueba (comprobado en typora.io, el 8 de septiembre de 2026). iA Writer se paga una vez por plataforma, con siete días de prueba y sin tarjeta (comprobado en ia.net/writer, el 8 de septiembre de 2026). Obsidian es la opción gratuita con el mayor ecosistema de plugins. Si tus documentos viven en Notion, no tienes un editor de Markdown: tienes una base de datos con atajos de teclado con forma de Markdown, y sacar el documento es un trabajo de conversión, no un guardado.

## Las tres preguntas que separan a los editores de Markdown

**¿Edita archivos, o documentos?** Esta es la línea de falla, y de ahí sale cualquier otra diferencia. Un editor que edita archivos abre una carpeta, te muestra los documentos `.md` que hay dentro, escribe cada pulsación en esos documentos y los deja donde una copia de seguridad, un commit de git o cualquier otro programa puedan encontrarlos. Una aplicación que edita documentos los guarda en su propio almacén — una base de datos, el almacenamiento local del navegador, un espacio sincronizado— y te da un botón de exportar en su lugar. Mientras escribes, las dos cosas pueden sentirse idénticas. Dejan de sentirse idénticas el día en que quieres tu texto en otro sitio.

**¿Qué sintaxis añade?** Markdown es un lenguaje pequeño, y todo editor que lleva unos años vivo le ha hecho crecer cosas que la especificación no tiene. Wikilinks entre dobles corchetes. Bloques de aviso. Transclusión, donde un documento incluye a otro. Resaltado con doble signo igual. Nada de eso está en CommonMark, casi nada está en GitHub Flavored Markdown, y un conversor que sigue la especificación va a renderizarlo como los caracteres literales que escribiste. Eso no es el conversor equivocándose. Es tu editor, que escribió algo que solo tu editor lee, en un archivo que parece portable.

**¿Qué produce cuando el documento tiene que salir?** Los editores responden de cuatro maneras distintas. Algunos exportan HTML directamente. Algunos exportan solo PDF. Algunos llaman a Pandoc, que hay que instalar por separado. Algunos no tienen ningún export y esperan que pases el archivo por otra cosa, una postura razonable en un editor de texto y una sorpresa desagradable de descubrir con una entrega encima. [Los conversores que hacen bien este trabajo](/blog/best-markdown-to-html-converters) son una categoría de herramienta distinta, y saber en qué categoría estás te ahorra una tarde.

Hay una cuarta pregunta que solo le importa a algunas personas, y a esas les importa enormemente: si el documento llega a viajar a algún sitio. Un editor online guarda tu texto en un servidor. Para una entrada de blog, a nadie le importa. Para el contrato de un cliente, una evaluación de desempeño o un plan sin publicar, esa es toda la decisión, tomada antes de que nada de la experiencia de escritura sea relevante.

## Comparativa rápida: la chuleta

| Editor | Mejor para | Capacidad principal | Precio |
| --- | --- | --- | --- |
| VS Code | Escribir Markdown que vive en un repositorio | Vista previa integrada, edición a nivel de carpeta, integración con git | Gratis |
| Obsidian | Una colección personal grande de notas enlazadas | Carpeta local de archivos `.md`, ecosistema de plugins, exportación a PDF | Gratis para todo uso, incluido el comercial |
| Typora | Una aplicación de escritura sobre archivos planos | Edición en un solo panel que renderiza mientras escribes; exporta a HTML, PDF y Word | 14,99 $ pago único, hasta 3 dispositivos |
| iA Writer | Prosa larga en escritorio y móvil | Modos de enfoque, exportación a HTML y PDF con plantillas | Pago único por plataforma |
| Zettlr | Escritura académica con citas | Citas desde Zotero y otros gestores; exporta a través de Pandoc | Gratis, GPL v3 |
| StackEdit | Escribir en una pestaña del navegador, también sin conexión | Funciona sin conexión una vez cargado; sincroniza con Drive, Dropbox, GitHub | Gratis, Apache 2.0 |
| Dillinger | Un documento rápido con vista previa en vivo | Editor en el navegador con exportación a HTML y PDF | Gratis, MIT |
| Notion | Páginas de equipo, no documentos Markdown | Atajos con forma de Markdown como entrada; exporta a Markdown, HTML, PDF | Plan gratis; planes de pago por usuario |
| Vim / Neovim | Gente que ya vive en una terminal | Sintaxis, plegado y vista previa por plugins; conversión por línea de comandos | Gratis, código abierto |
| Nota | Escritores de macOS dispuestos a probar una beta | Editor sobre archivos Markdown locales; solo macOS | Beta; sin precio indicado en el sitio |
| Mark Text | Un editor de escritorio gratuito que renderiza mientras escribes | Edición en un solo panel; salida a HTML y PDF | Gratis, MIT |

## Los mejores editores de Markdown en 2026

### VS Code — el mejor si ya lo tienes abierto

VS Code es un editor de código con un soporte de Markdown tan bueno que la mayoría de los desarrolladores nunca instalan otra cosa. Abre una carpeta en vez de un archivo, lo que significa que tus documentos, tus imágenes y tu `.gitignore` están todos en la misma ventana, y la vista previa está a una pulsación de la escritura.

| A favor | En contra |
| --- | --- |
| Ya instalado para la mayoría de desarrolladores, y gratis | No pensado para prosa: sin modo de enfoque ni contador de palabras por defecto |
| Los archivos siguen siendo archivos normales en una carpeta normal | Exportar a HTML necesita una extensión, y las extensiones varían en calidad |
| La vista previa sigue el analizador markdown-it, compatible con CommonMark | El estilo de la vista previa no es el estilo de la exportación |
| Las extensiones añaden linting, formato de tablas y pegado de imágenes | La ventana es la de un desarrollador, con una barra lateral llena de código |

**Precio:** gratis.

**Detalles técnicos y funciones**

- Vista previa en paralelo que se desplaza con el texto fuente, más plegado por nivel de encabezado
- Autocompletado de rutas para enlaces e imágenes, así una ruta relativa rota se ve mientras la escribes
- Las extensiones cubren linting (markdownlint), alineación de tablas y exportación a HTML y PDF
- Edición multicursor y buscar y reemplazar con expresiones regulares, algo que importa más en prosa de lo que la gente espera
- Fragmentos de código, así el esqueleto de una tabla o un bloque de front matter son tres caracteres

**¿Para quién es?** Para cualquiera cuyo Markdown vive al lado del código: READMEs, changelogs, documentación dentro del repositorio. Es también el mejor editor de esta lista para [los bloques de código con cercas](/blog/code-blocks-in-markdown), porque el editor ya conoce todos los lenguajes que vas a meter dentro.

### Obsidian — la mejor aplicación gratis sobre una carpeta de archivos

Obsidian abre una carpeta de archivos `.md` y trata los enlaces entre ellos como lo esencial. Nada se guarda en un contenedor propietario: la carpeta que abre es una carpeta que también puedes abrir en VS Code, respaldar con cualquier cosa, o borrar sin pedir permiso.

| A favor | En contra |
| --- | --- |
| Tus documentos son archivos planos en una carpeta que elegiste tú | Su sintaxis de wikilinks no es CommonMark ni GFM, así que viaja mal |
| Gratis para uso personal y comercial | El ecosistema de plugins lo mantiene la comunidad, con la variación que eso implica |
| Un ecosistema de plugins grande, incluidos plugins de exportación | La exportación a HTML es un plugin, no viene integrada |
| El front matter es de primera clase, como propiedades del documento | El grafo y los plugins invitan a trastear en vez de a escribir |

**Precio:** gratis para todos los usos, incluido el personal, el comercial y el de organizaciones sin ánimo de lucro; los servicios de pago Sync y Publish, y una licencia de apoyo, se venden por separado (comprobado en obsidian.md/license, el 8 de septiembre de 2026).

**Detalles técnicos y funciones**

- Abre un directorio local; cada nota es un archivo `.md`, cada adjunto un archivo al lado
- `[[Nombre de nota]]` y `![[imagen.png]]` son sintaxis propia de Obsidian, no de ninguna especificación de Markdown; hay una opción para escribir enlaces estándar en su lugar
- El front matter en YAML se lee como propiedades estructuradas y se muestra como campos
- La exportación a PDF viene integrada; la exportación a HTML llega por plugins de la comunidad
- La vista previa en vivo esconde la sintaxis mientras escribes, con un modo fuente que muestra el texto crudo

**¿Para quién es?** Para cualquiera que esté acumulando unos cientos de notas que se referencian entre sí y quiera que sigan siendo legibles en diez años. Desactiva la opción de wikilinks el primer día si esas notas se van a publicar alguna vez, porque [la diferencia entre la sintaxis de una app y el Markdown portable](/blog/markdown-from-notion-obsidian-and-confluence) es barata de evitar y cara de arreglar después.

### Typora — el mejor editor de pago para quien no soporta ver la sintaxis

Typora es un editor de escritorio con un solo panel. No hay fuente a la izquierda y vista previa a la derecha: escribes `## Encabezado` y la línea se convierte en encabezado ahí mismo. Para quien encuentra el Markdown crudo ruidoso, esta es la diferencia entre usar Markdown y solo tolerarlo.

| A favor | En contra |
| --- | --- |
| La superficie de escritura más tranquila de esta lista, sin gestión de paneles divididos | De pago, y solo de escritorio |
| Exporta a HTML, PDF y Word desde el archivo que estás mirando | Esconder la sintaxis hace que algunos errores estructurales sean más difíciles de ver |
| Los temas son archivos CSS planos, así la exportación a HTML los hereda | No es una herramienta por lotes: un documento a la vez |
| Los archivos siguen siendo `.md` locales | Sin ecosistema de plugins que merezca ese nombre |

**Precio:** 14,99 $ sin impuestos, pago único que cubre hasta tres dispositivos, con quince días de prueba gratis (comprobado en typora.io, el 8 de septiembre de 2026).

**Detalles técnicos y funciones**

- Edición en un solo panel: el Markdown se sustituye por su renderizado mientras escribes, con la fuente visible de nuevo cuando el cursor entra en la línea
- Exporta a HTML, PDF y Word; el HTML toma el CSS del tema activo
- Los temas son archivos CSS en una carpeta, así un estilo de casa es una hoja de estilos y no una opción de menú
- Una opción para copiar las imágenes pegadas en una carpeta relativa junto al documento, la diferencia entre un archivo portable y uno con enlaces a tu escritorio
- Corre en macOS, Windows y Linux

**¿Para quién es?** Para quien escribe Markdown todos los días, quiere una aplicación y no una pestaña del navegador, y está contento pagando una vez. Es el camino más corto de un documento terminado a un HTML con estilo que otra persona puede abrir — y si lo que te frena es el límite de dispositivos, la falta de nada para móvil o una exportación decepcionante, [las alternativas se ordenan según cuál de esos motivos es el tuyo](/blog/typora-alternatives).

### iA Writer — el mejor para prosa larga entre escritorio y móvil

iA Writer es primero una aplicación de escritura y segundo un editor de Markdown. Tiene opiniones sobre tipografía, un modo de enfoque que atenúa todo salvo la frase actual, y un resaltado que marca las categorías gramaticales para que veas cuántos adjetivos estás usando.

| A favor | En contra |
| --- | --- |
| Pensado para prosa, no para documentación ni notas | Pagas por plataforma, así que un Mac y un iPad son dos compras |
| Mac, Windows, iPhone y iPad, con archivos planos por debajo | Sin plugins ni extensibilidad, por diseño |
| Exportación a HTML y PDF, con plantillas para el envoltorio | No es un buen ajuste para documentos llenos de código |
| Siete días de prueba sin tarjeta | Deliberadamente pocas funciones, que algunos leen como carencias |

**Precio:** compra única por plataforma —«paga una vez por plataforma, es tuya para siempre»— con siete días de prueba gratis y sin tarjeta (comprobado en ia.net/writer, el 8 de septiembre de 2026).

**Detalles técnicos y funciones**

- Trabaja sobre archivos `.md` normales en carpetas normales, incluidas las de iCloud y Dropbox
- Modo de enfoque y resaltado sintáctico de categorías gramaticales, pensado para editar más que para redactar
- Bloques de contenido: un documento puede incluir a otro por referencia, la forma en que un manuscrito de la longitud de un libro se mantiene en capítulos separados
- Exporta a HTML y PDF, con plantillas que controlan el envoltorio
- Disponible para macOS 10.15 o posterior y Windows 10 o posterior (comprobado en ia.net/writer, el 8 de septiembre de 2026)

**¿Para quién es?** Para quien escribe ensayos, capítulos y artículos en vez de documentación, quiere el mismo documento abierto en un portátil y un móvil, y no quiere mantener un ecosistema de plugins.

### Zettlr — el mejor editor gratis para escritura académica

Zettlr es una aplicación de Electron construida con Vue y TypeScript, pensada para quien escribe con referencias. Gestiona citas desde un gestor bibliográfico, búsqueda de texto completo en toda una carpeta, y exporta a través de Pandoc en vez de reimplementar la conversión.

| A favor | En contra |
| --- | --- |
| Citas desde Zotero, JabRef y otros, dentro del editor | La exportación depende de Pandoc, y a menudo de LaTeX, instalados por separado |
| Gratis y de código abierto bajo la GNU GPL v3 | Más pesado que un editor plano, al ser Electron |
| Búsqueda de texto completo en toda la carpeta | La interfaz es más densa que la de las aplicaciones de escritura de arriba |
| CSS personalizado, temas y modo oscuro | El marco de Zettelkasten no es para todo el mundo |

**Precio:** gratis, con licencia GNU GPL v3 (comprobado en github.com/Zettlr/Zettlr, el 8 de septiembre de 2026).

**Detalles técnicos y funciones**

- Electron, Node.js y Vue 3 en el frontend, con TypeScript en el código (comprobado en github.com/Zettlr/Zettlr, el 8 de septiembre de 2026)
- Exporta vía Pandoc, LaTeX y Textbundle, por eso la lista de formatos es larga y la instalación no es solo la app
- Resaltado de código para muchos lenguajes dentro de bloques con cercas
- Integración de citas con los gestores de referencias habituales
- Temas, modo oscuro y CSS personalizado tanto para editar como para exportar

**¿Para quién es?** Para quien escribe una tesis, un artículo o un libro con bibliografía y quiere la salida de Pandoc sin montar la línea de comandos a mano. Si de todos modos ibas a instalar Pandoc, Zettlr es un frontend gratuito para él.

### StackEdit — el mejor editor de navegador que sigue funcionando sin conexión

StackEdit es un editor de Markdown que corre en una pestaña del navegador y sigue funcionando cuando la conexión no. Sincroniza con el almacenamiento en la nube habitual cuando tiene red, y puede publicar directamente en varias plataformas de blog.

| A favor | En contra |
| --- | --- |
| Nada que instalar, y funciona sin conexión una vez cargado | Los documentos viven en el almacenamiento propio del navegador hasta que conectas un proveedor de sincronización |
| Sincroniza con Google Drive, Dropbox y GitHub | Borrar los datos del sitio es una manera real de perder trabajo |
| Publica en Blogger, WordPress y Zendesk | Su sintaxis extendida no siempre sobrevive en otro sitio |
| Exporta como Markdown, HTML, o mediante una plantilla Handlebars | Una pestaña se cierra por accidente con facilidad |

**Precio:** gratis, con licencia Apache 2.0 (comprobado en stackedit.io, el 8 de septiembre de 2026).

**Detalles técnicos y funciones**

- Corre por completo en el navegador y afirma que puedes escribir sin conexión como en una aplicación de escritorio
- Destinos de sincronización: Google Drive, Dropbox y GitHub
- Destinos de publicación: Blogger, WordPress y Zendesk
- Salida como Markdown, como HTML, o formateada mediante el motor de plantillas Handlebars
- Gestiona documentos largos con una tabla de contenidos y un esquema desplazable

**¿Para quién es?** Para quien está en una máquina donde no puede instalar software, y para quien el siguiente paso tras escribir es una plataforma de blog y no un archivo — y si el almacenamiento del navegador o la sincronización se ha vuelto el problema en vez de la comodidad, [las alternativas se ordenan según qué parte de StackEdit estás sustituyendo realmente](/blog/stackedit-alternatives).

### Dillinger — el mejor para un documento, ahora mismo

Dillinger corre en una pestaña del navegador: fuente en un lado, vista previa en el otro, y un menú de guardado que te devuelve HTML o PDF o sube el archivo a Dropbox, Google Drive, OneDrive o GitHub. Es la herramienta que abres cuando tienes un documento que escribir en los próximos veinte minutos y nada instalado.

| A favor | En contra |
| --- | --- |
| Abres una pestaña, escribes, exportas, cierras la pestaña | Tu documento pasa por un servicio alojado |
| Exportación a HTML y PDF sin necesitar cuenta | El estilo de la exportación es de la herramienta, no el tuyo |
| Gratis y de código abierto bajo licencia MIT | No es un editor para guardar un cuerpo de trabajo |
| Sincronización en la nube con los cuatro destinos habituales | Sin historia de uso sin conexión que valga la pena |

**Precio:** gratis, con licencia MIT.

**Detalles técnicos y funciones**

- Editor de dos paneles: Markdown a la izquierda, vista previa renderizada a la derecha
- Importa desde y guarda en Dropbox, Google Drive, OneDrive y GitHub
- Exporta la fuente como `.md` o el documento renderizado como HTML o PDF
- Sin instalación ni cuenta necesarias para el flujo básico

**¿Para quién es?** Para quien escribe un documento hoy. Para cualquier cosa con un destinatario detrás, trata la exportación como un primer borrador del archivo y comprueba qué produjo realmente — una vista previa y [un archivo que se abre correctamente en otro sitio](/blog/share-a-markdown-document-as-a-link) son cosas distintas.

### Notion — el que no es un editor de Markdown

Notion acepta atajos de Markdown. Escribes `## ` y obtienes un encabezado; escribes `- ` y obtienes una viñeta. Eso es asistencia de entrada, no almacenamiento: lo que Notion guarda es un árbol de bloques en su propia base de datos, y Markdown es uno de los formatos a los que convierte ese árbol al salir.

| A favor | En contra |
| --- | --- |
| Bueno en lo suyo: páginas compartidas, bases de datos, estructura de equipo | No es un editor de Markdown — la exportación es una conversión, con pérdidas |
| Exporta a Markdown y CSV, HTML, o PDF | Las bases de datos salen como CSV, no como tablas de Markdown |
| Familiar para cualquier equipo que ya lo use | Los bloques de aviso exportan como HTML, porque Markdown no tiene equivalente |
| Los recursos vienen incluidos en el archivo de exportación | Las rutas de carpetas anidadas pueden romper la extracción en Windows |

**Precio:** plan gratis disponible; los planes de pago se cobran por usuario — consulta notion.com/pricing para las cifras actuales.

**Detalles técnicos y funciones**

- Cuatro vías de exportación: PDF, HTML, «Markdown y CSV», e imprimir desde el navegador
- La exportación a Markdown llega como un archivo comprimido: archivos `.md` para páginas y subpáginas sin base de datos, un archivo `.csv` por cada base de datos de página completa, y carpetas separadas para imágenes y otros recursos
- La propia documentación de ayuda de Notion dice que los bloques de aviso se exportan como HTML «porque no hay equivalente en Markdown», y que una vista de formulario de una base de datos no se puede exportar en absoluto
- Los emojis personalizados no aparecen en las exportaciones a PDF
- En Windows, la extracción puede fallar cuando las rutas de carpetas anidadas del archivo superan los 260 caracteres; las soluciones documentadas son desactivar la creación de carpetas para subpáginas, o usar otra herramienta de extracción

(Todo lo anterior comprobado en notion.com/help/export-your-content, el 8 de septiembre de 2026.)

**¿Para quién es?** Para equipos que quieren un espacio de trabajo compartido y son honestos consigo mismos sobre que esto no es una herramienta de Markdown. Si tus documentos tienen que acabar como Markdown portable o como páginas web, planea un paso de limpieza después de cada exportación en vez de esperar que esta salga limpia.

### Vim y Neovim — los mejores si ya vives en una terminal

Vim y Neovim no son editores de Markdown y se vuelven buenos con tres o cuatro plugins. El atractivo no es el soporte de Markdown; es que la edición de texto es la más rápida que existe y ya la conoces.

| A favor | En contra |
| --- | --- |
| Velocidad de edición que nada de esta lista iguala, si tienes la memoria muscular | Todo es un plugin, y tú lo montas y lo mantienes |
| Gratis y de código abierto; corre por SSH, en cualquier cosa | Sin modelo de documento: una tabla es texto que alineas tú mismo |
| Vista previa y conversión son solo otros programas que llamas | La curva de aprendizaje es la ya conocida |
| La configuración es un archivo que puedes commitear y reutilizar | Nada se renderiza mientras escribes |

**Precio:** gratis y de código abierto. Vim se distribuye con su propia licencia charityware; Neovim es Apache 2.0.

**Detalles técnicos y funciones**

- Plugins como vim-markdown añaden resaltado de sintaxis, plegado por encabezado y ocultación de la marcación
- Plugins de vista previa como markdown-preview.nvim renderizan el documento en una ventana del navegador mientras escribes, usando un proceso de Node
- Plugins de tablas como vim-table-mode mantienen las tablas de pipes alineadas mientras las editas
- La conversión está a un comando de distancia: `:%!` y una tubería, o un mapeo que llama a un conversor sobre el archivo actual
- Toda la configuración es texto, así que la misma instalación te sigue a cada máquina

**¿Para quién es?** Para quien ya lo usa para código. Nadie debería aprender Vim para escribir Markdown, y quien ya sabe Vim no debería aprender un segundo editor para escribirlo.

### Nota — la apuesta interesante

Nota es un editor de Markdown para macOS pensado para escribir y publicar desde una carpeta local de archivos. Merece conocerse y merece verse con claridad: el sitio describe una beta de macOS, ofrece lista de espera y reserva anticipada, y no indica precio en la página.

| A favor | En contra |
| --- | --- |
| Construido alrededor de archivos Markdown locales, no de un servicio | Solo macOS |
| Pensado para publicar, no solo para tomar notas | Software beta, con la estabilidad que eso implica |
| Pequeño y enfocado en vez de una plataforma de plugins | Sin precio indicado en el sitio, así que hay que presupuestar lo desconocido |

**Precio:** no indicado en nota.md, que ofrece lista de espera y reserva anticipada en vez de un precio publicado (comprobado el 8 de septiembre de 2026).

**Detalles técnicos y funciones**

- Solo macOS, según el sitio; no se anuncia build para Windows ni Linux
- Se distribuye como beta a quien se apunte a la lista de espera, con opción de reserva anticipada
- Trabaja sobre archivos Markdown normales en disco, no sobre documentos de un servicio
- Orientado a escribir y publicar, no a tomar notas

**¿Para quién es?** Para escritores de Mac a los que les gusta probar aplicaciones nuevas y guardan sus archivos donde la aplicación no los controla. Como los documentos son archivos `.md` normales, el coste de que la apuesta no salga bien es bajo: cambias de editor y la carpeta sigue igual. Esa propiedad es la razón entera para preferir los editores que son dueños de sus archivos, y vale más que cualquier función suelta.

### Mark Text — el mejor editor de escritorio gratis de un solo panel

Mark Text es un editor de escritorio de código abierto con el enfoque de renderizar mientras escribes que Typora popularizó, publicado bajo licencia MIT y construido con Electron y Vue.

| A favor | En contra |
| --- | --- |
| Gratis, con licencia MIT, e instalable en los tres escritorios | Proyecto comunitario: revisa el historial de commits reciente antes de comprometerte |
| Renderiza mientras escribes, en un solo panel | Menos formatos de exportación que los editores de pago |
| Exporta a HTML y PDF | Electron, así que la huella de memoria es la esperable |
| Archivos locales, nada se sube | Menos temas y extensiones que otros |

**Precio:** gratis, con licencia MIT.

**Detalles técnicos y funciones**

- Builds para Linux, macOS y Windows, en x64 y arm64
- Edición en un solo panel con la sintaxis sustituida por su renderizado
- Salida a HTML y PDF
- Electron y Vue, así que el código es accesible si quieres cambiar algo

**¿Para quién es?** Para cualquiera que quiera el modelo de edición de Typora sin pagarlo, y esté cómodo dependiendo de un proyecto comunitario. Si una hoja de ruta mantenida te importa más que el precio de una licencia de Typora, compra Typora.

## La división que las tablas comparativas no dibujan

Toda lista de editores de Markdown los ordena en un eje. El eje que decide en cuántos problemas vas a estar dentro de tres años es binario, y casi nadie lo pone en la tabla.

**Editores dueños de archivos.** VS Code, Obsidian, Typora, iA Writer, Zettlr, Mark Text, Vim y Nota apuntan todos a un directorio en un disco. La consecuencia es que el editor es reemplazable. Puedes abrir la misma carpeta en un segundo editor mañana, pasarle un conversor en una compilación, buscar en ella con `grep`, commitearla a git y respaldarla con la misma herramienta que respalda todo lo demás. Cuando una de estas aplicaciones se abandona, pierdes la aplicación. No pierdes la escritura.

**Aplicaciones dueñas de documentos.** Notion es dueño de sus documentos en una base de datos. StackEdit, hasta que conectas un proveedor de sincronización, es dueño de ellos en el almacenamiento del navegador. Un editor alojado es dueño de ellos en un servidor. La consecuencia es que sacar tu texto es una operación que implementa el proveedor, con la fidelidad que el proveedor elige, en los formatos que el proveedor ofrece. Esa operación suele ir bien, y de vez en cuando es la peor tarde del trimestre. La pista es que se llama «exportar» y no «abrir».

**La sintaxis propietaria es una fuga lenta.** Wikilinks, avisos, marcas de resaltado, consultas incrustadas, transclusión — cada una es cómoda dentro de la aplicación e inerte fuera de ella. No lo notas, porque solo lees esos archivos en la aplicación que los escribió. Lo notas el día que la documentación se muda al repositorio, o un colega abre una nota en otro editor, o un conversor renderiza `[[Onboarding]]` como cuatro corchetes literales y una palabra. Nada se corrompe. Simplemente ya no es Markdown, y lleva un año sin serlo.

**La vista previa no es la exportación.** Todo editor de esta lista tiene una vista previa, y en todos ellos el editor le pone el estilo. Lo que llega al HTML exportado es otra hoja de estilos, a veces otro analizador, y a veces otro dialecto de Markdown. Las tablas son donde esto se nota primero, porque las tablas no están en CommonMark en absoluto: un editor puede renderizar una correctamente en su propio panel y emitir un párrafo de caracteres de pipe al salir. [Probar una tabla antes de confiar en la tubería](/blog/markdown-tables-that-survive-conversion) lleva un minuto y ahorra un reenvío.

**Lo que hace cada uno cuando necesitas HTML.** Esta es la pregunta que los ordena de verdad. Typora, iA Writer, Mark Text, StackEdit y Dillinger exportan HTML directamente, con su propio estilo. Obsidian exporta PDF de forma nativa y HTML mediante un plugin. VS Code y Vim delegan en una extensión o un comando. Zettlr delega en Pandoc, que instalas tú. Notion ofrece exportación a HTML de un árbol de bloques que nunca fue Markdown para empezar. Ninguno se equivoca; están respondiendo preguntas distintas. Lo que comparten es que el HTML que producen es el HTML que ellos eligieron, y si necesitas un tipo de salida concreto — un archivo completo, estilos en línea, nada pedido a una red— eso es trabajo de un conversor, no de un editor.

**El coste de salida es el precio real.** 14,99 $ pagados una vez no es el coste de un editor. El coste es lo que cuesta dejar de usarlo. Para un editor dueño de archivos, ese coste es cero: lo cierras y abres otro sobre la misma carpeta. Para una aplicación dueña de documentos, es una exportación, una inspección, una limpieza de sintaxis sin equivalente en Markdown, y un conjunto de rutas de recursos que arreglar. Pésalo antes que la tipografía.

## Cómo elegir

1. **Decide si tu texto tiene que sobrevivir al editor.** Si la respuesta es sí — y para notas, documentación y cualquier cosa con tu nombre encima, lo es— elige algo que abra una carpeta de archivos, porque una carpeta de archivos puede abrirla cualquier cosa que exista en 2035.
2. **Ajusta el editor al tipo de escritura, no a las reseñas.** La prosa quiere iA Writer o Typora; la documentación junto al código quiere VS Code; un conjunto de notas enlazadas quiere Obsidian; una bibliografía quiere Zettlr. Elegir la categoría equivocada significa pelear con la interfaz cada día por algo que otra aplicación hace por defecto.
3. **Apaga la sintaxis propietaria el primer día.** Si el editor ofrece enlaces de Markdown estándar en vez de los suyos, acepta la oferta. Corregir cientos de wikilinks más adelante es un trabajo de scripting, y los scripts sobre tus propias notas tienen la costumbre de comerse un fin de semana.
4. **Comprueba la exportación antes de tener una fecha límite.** Escribe un documento representativo — una tabla, un bloque de código con cercas, una imagen, una nota al pie—, expórtalo, y abre el resultado en otro navegador con la red apagada. Lo que se rompa ahí se romperá entonces, cuando tengas menos tiempo.
5. **Cuenta las instalaciones que necesita la exportación.** Un editor que exporta a través de Pandoc es excelente y son dos instalaciones. En tu propia máquina eso está bien; en un portátil de trabajo bloqueado es la razón por la que la exportación nunca llega a pasar.
6. **Sé honesto sobre adónde va el documento.** Si es confidencial, un editor que lo guarda en el servidor de otro queda fuera, por mucho que te guste. Esa decisión va primero, porque ninguna experiencia de escritura vale volver a discutirla después.

## Conclusión

El mejor editor de Markdown es el que edita tus archivos en vez de ser dueño de tus documentos, con una forma que se ajusta a la escritura que realmente haces: VS Code si ya lo tienes abierto, Typora o iA Writer si quieres pagar una vez por una superficie más tranquila, Obsidian si las notas se enlazan entre sí, Zettlr si hay bibliografía, Vim si ya vives ahí. Notion es la excepción que merece nombrarse dos veces, porque es un buen producto y un editor de Markdown mediocre, y la brecha solo se ve al exportar. Escribas donde escribas, mantén la conversión separada de la edición: cuando el documento tenga que convertirse en una página web que otra persona pueda abrir, [convierte el Markdown a un archivo HTML autocontenido](/) en tu navegador, donde el archivo se queda en tu máquina y la salida es un solo archivo que no le pide nada a la red.

## Preguntas frecuentes

### ¿Cuál es el mejor editor de Markdown para principiantes?

Typora, si no te importa pagar 14,99 $ una vez, porque esconde la sintaxis y no hay nada que configurar. Si quieres algo gratis, Mark Text te da el mismo modelo de edición bajo licencia MIT, y StackEdit no necesita instalación alguna. Evita empezar con Vim o una configuración llena de plugins; aprende primero la sintaxis y las herramientas después.

### ¿Obsidian es un editor de Markdown o una app de notas?

Las dos cosas, y la distinción importa. Edita archivos `.md` normales en una carpeta que tú elijes, lo que lo hace un editor de Markdown real, pero su sintaxis de wikilinks e incrustaciones es propia de Obsidian y no de CommonMark ni de GFM. Cambia la opción de enlaces a Markdown estándar si esas notas se van a convertir o leer alguna vez en otro sitio.

### ¿VS Code es bueno para escribir Markdown?

Sí, sobre todo para lo que vive en un repositorio. La vista previa integrada sigue un analizador compatible con CommonMark, el autocompletado de rutas atrapa enlaces de imagen rotos mientras los escribes, y git ya rastrea el archivo. Es un mal ajuste para prosa larga, porque nada del mobiliario pensado para escribir — modos de enfoque, tipografía, diseños sin distracciones— está ahí sin extensiones.

### ¿Notion exporta Markdown de verdad?

Exporta Markdown, con lagunas documentadas. Las bases de datos se vuelven archivos CSV en vez de tablas de Markdown, los bloques de aviso salen como HTML porque Markdown no tiene equivalente, una vista de formulario no se puede exportar, y en Windows las rutas anidadas del archivo pueden superar el límite de 260 caracteres y fallar al extraerse (comprobado en notion.com/help/export-your-content, el 8 de septiembre de 2026). Presupuesta un paso de limpieza cada vez.

### ¿Cuál es el mejor editor de Markdown gratis?

VS Code si escribes cerca del código, Obsidian si estás construyendo un conjunto de notas enlazadas — es gratis para uso personal y comercial—, y Zettlr si necesitas citas. Los tres guardan tu texto en archivos planos. Para una pestaña del navegador sin nada instalado, StackEdit es gratis bajo Apache 2.0 y funciona sin conexión una vez cargado.

### ¿Necesito un editor de Markdown de pago?

No. Cualquier trabajo de esta página se puede hacer con software gratuito, y las opciones gratuitas no son un compromiso a la baja. Pagas por una superficie de escritura más agradable y por la atención continuada de alguien sobre ella, algo que a unos les vale 14,99 $ y a otros nada. Decide después de una quincena con un editor gratuito, no antes.

### ¿Qué editor de Markdown me da HTML que puedo enviar a alguien?

Typora, iA Writer, Mark Text, StackEdit y Dillinger exportan HTML directamente, cada uno con su propio estilo. Si lo que necesitas es un solo archivo autocontenido — estilos en línea, sin hojas de estilo externas ni fuentes, que se abra igual en una máquina sin conexión— eso es un paso de conversión y no una función del editor, y merece hacerse por separado de donde escribiste el texto.
