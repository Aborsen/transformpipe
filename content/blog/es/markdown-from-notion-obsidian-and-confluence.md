---
title: "Sacar Markdown de Notion, Obsidian, Confluence y demás"
description: "Cada vía de exportación desde Notion, Obsidian, Confluence, Google Docs y Word: qué produce cada una, qué destroza en silencio, y cómo repararlo después"
updated: 2026-09-14
date: 2026-07-02
tag: Workflow
keywords: exportar notion a markdown, exportar obsidian a html, confluence a markdown, pasar confluence a markdown, google docs a markdown, word a markdown, html a markdown, notion a markdown, exportar pagina de confluence a markdown, migrar wiki a markdown
---

El documento ya existe: encabezados, una tabla, tres capturas de pantalla, un recuadro de aviso con color — dentro de una aplicación que no te va a entregar un archivo sin más. Sacarlo rara vez es un solo clic, y el clic que encuentras pierde algo que notas una semana después.

Lo que hace esto más difícil de lo que parece es que ninguna de estas aplicaciones guarda Markdown. Guardan un árbol de bloques con tipo, o XHTML con macros dentro, o un modelo de documento propio, y el botón de exportar es un conversor que alguien escribió para pasar de ese modelo a un formato de archivo. Cada conversor descarta lo que su destino no puede expresar. La pregunta nunca es si se pierde algo; es qué se pierde, y si te enteras ahora o después de haber tirado el original.

### Resumen rápido

Notion exporta un zip de Markdown y CSV en el que cada nombre de archivo y cada enlace interno lleva pegado el id de la página, y los avisos, los desplegables y las columnas llegan aplanados. Obsidian ya es Markdown, pero en su propio dialecto, así que los wikilinks, las incrustaciones y las referencias de bloque necesitan conversión antes de que nada más pueda leerlos. Confluence no tiene ninguna exportación a Markdown: te llevas el HTML del espacio exportado y lo conviertes, perdiendo lo que hicieran las macros. Google Docs descarga Markdown directamente pero no puede llevar imágenes ni comentarios en un solo archivo, y Word y todo lo demás pasan por HTML. Con diez páginas repáralo a mano; con mil se convierte en un trabajo de reescritura con script, y la reescritura es de nombres de archivo, enlaces, rutas de adjuntos y anclas, en ese orden.

| Origen | Vía de exportación | Qué obtienes | Qué destroza |
| --- | --- | --- | --- |
| Notion | Exportar, formato «Markdown y CSV» | zip: un `.md` por página, carpetas, un `.csv` por base de datos | ids en cada nombre de archivo y enlace, avisos, desplegables, columnas, comentarios |
| Obsidian | ninguna falta — los archivos ya están en tu disco | una carpeta de `.md` y adjuntos | wikilinks, incrustaciones, referencias de bloque, avisos, bloques de Dataview |
| Confluence Cloud | exportación del espacio a HTML (admin del espacio) | zip de HTML renderizado más adjuntos | macros, jerarquía de páginas, comentarios, anclas de encabezado |
| Página de Confluence | exportar a Word o PDF | un archivo por página | todo lo estructural; el PDF es un callejón sin salida |
| Google Docs | Archivo, Descargar, Markdown | un archivo `.md` | imágenes, comentarios, sugerencias |
| Google Docs | Archivo, Descargar, Página web | zip de HTML más una carpeta de imágenes | atributos de estilo que hay que quitar después |
| Word | el propio `.docx` | un zip de XML que conviertes tú | encabezados simulados con negrita, numeración de listas, control de cambios |
| Evernote | exportar como ENEX o HTML | contenedor XML, o HTML más una carpeta de recursos | metadatos de la nota, tareas, formato hecho a mano |
| Bear | exportar como Markdown o Textbundle | Markdown, con los recursos en el caso de Textbundle | la sintaxis propia de etiquetas de Bear se lee como encabezados en otros sitios |
| Apple Notes | Archivo, Exportar como, Markdown | un archivo por nota | adjuntos, tablas, y es solo nota por nota |
| Roam | exportar desde dentro del grafo | lee la lista de formatos en tu propio grafo antes de planificar | las referencias de bloque y las consultas no tienen equivalente |

## Notion: un zip donde cada nombre de archivo crece un id

Elige «Markdown y CSV» y Notion construye un zip: un `.md` por página, una carpeta por página que tuviera subpáginas o imágenes, un `.csv` por base de datos. Cada nombre lleva un id hexadecimal largo: Notion identifica las páginas por id, y el título es solo una etiqueta.

El cuadro de diálogo de exportación merece leerse en vez de solo hacerle clic. Ofrece una elección de formato — PDF, HTML, o Markdown y CSV — un desplegable «Incluir contenido» que puede excluir archivos e imágenes, un interruptor «Incluir subpáginas», y un interruptor «Crear carpetas para las subpáginas» (comprobado en notion.com, el 9 de septiembre de 2026). Dos límites más de la misma página importan antes de planificar una migración alrededor de esto: solo se exporta la vista actual o la predeterminada de una base de datos, no se admite exportar todas las vistas a la vez, y una vista de formulario no se puede exportar en absoluto — exportas la vista de tabla en su lugar. Para una exportación grande, Notion puede enviar un enlace de descarga por correo en vez de empezar la descarga, el enlace caduca a los siete días, y el procesamiento puede tardar hasta treinta horas (comprobado en notion.com, el 9 de septiembre de 2026). Eso es un dato de planificación, no una nota al margen: si el plan era «exportar el viernes por la tarde y convertir el viernes por la noche», puede que no sea el plan.

Tres cosas que esperar:

- **Los ids se quedan.** Renombra los archivos si alguien va a leer los nombres, y luego arregla los enlaces a los antiguos.
- **Los avisos se aplanan.** Markdown no tiene un bloque con icono y color de fondo, así que un aviso vuelve como un párrafo con el emoji varado al principio. Los desplegables pierden la capacidad de desplegarse.
- **Las bases de datos salen como CSV.** Una vista de tabla es un archivo aparte, no una tabla de Markdown: reconstruirla es un trabajo de hoja de cálculo, y después [una cuestión de si las barras verticales sobreviven](/blog/markdown-tables-that-survive-conversion).

Las imágenes se guardan en la carpeta de la página con nombres generados, accesibles por rutas relativas codificadas por porcentaje que solo funcionan mientras la carpeta viaje junto al archivo — la suposición que [las rutas relativas hacen y rompen](/blog/images-and-links-that-still-work).

### Qué se convierte cada tipo de bloque

| En Notion | En la exportación | Reparación |
| --- | --- | --- |
| Aviso (callout) | párrafo, con el carácter del icono al principio | una convención de cita en bloque con una entrada en negrita |
| Desplegable (toggle) | el resumen como una línea, el contenido como los bloques que siguen | un elemento `<details>`, o un encabezado y texto plano |
| Desplegable con encabezado | un encabezado, con el contenido puesto debajo | normalmente correcto tal cual queda |
| Columnas | las columnas una tras otra, en el orden del documento | acepta el reflujo, o reconstrúyelo como una tabla |
| Bloque sincronizado | su contenido, copiado en cada página donde se mostraba | elige un único hogar para el texto y enlázalo desde el resto |
| Base de datos, página completa | un archivo `.csv`, más un `.md` por fila que tuviera cuerpo de página | reconstruye la tabla, conserva las páginas de fila como archivos |
| Vista de base de datos enlazada | nada útil — la vista es una consulta, no contenido | recréala donde acaben las páginas |
| Ecuación en línea | el LaTeX, delimitado | depende por completo de qué lo renderice después |
| Comentario | ausente | copia cualquier cosa sin resolver al cuerpo antes de exportar |
| Panel de menciones inversas | ausente | era derivado, no guardado |

La fila de los comentarios es la que sorprende a los equipos. Los hilos de discusión no son parte del contenido de la página, así que una exportación es la página sin el argumento que la produjo. Si las decisiones viven en los comentarios, se van en el momento en que se archiva el espacio de trabajo.

### El sufijo del id, y por qué no es solo feo

Una página llamada «Notas de la reunión» sale como `Notas de la reunión 21f4c8a1b2c34d5e8f90123456789abc.md`, y un enlace hacia ella desde otra página se escribe contra ese nombre de archivo exacto, codificado por porcentaje para los espacios. El id es el mismo que aparece en la URL de la página dentro de la app, que es la parte útil: te da una clave para mapear los enlaces antiguos a los nuevos.

```text
Meeting notes 21f4c8a1b2c34d5e8f90123456789abc.md    the file
Meeting%20notes%2021f4c8a1b2c34d5e8f90123456789abc.md    the link
meeting-notes.md    what you want
```

Renombra los archivos sin reescribir los enlaces y te queda una carpeta de documentos que se apuntan todos entre sí y ninguno resuelve. Ese es el problema de migración entero en miniatura, y es por lo que el renombrado y la reescritura de enlaces tienen que ser una sola operación sobre un solo mapa, no dos pasadas hechas en tardes distintas.

Si el destino es un único documento Markdown en vez de una carpeta de archivos separados con un mapa de enlaces que funcione, el problema del id desaparece de otra forma: [una conversión de Notion a Markdown hecha justo para esto](/notion-to-markdown) coge el `.zip` de exportación sin tocarlo, fusiona cada página en un único documento en su orden original con un índice, y convierte un enlace entre páginas en las palabras que mostraba en vez de en un nombre de archivo que no resolvería fuera de su carpeta original de todos modos. No reconstruye el mapa de enlaces por archivo de arriba — nada lo hace de forma automática, porque exige decidir dónde vivirá cada página — pero cuando el objetivo siempre fue una sola página para leer o compartir, el sufijo del id deja de ser un problema que resolver. [La comparativa completa de vías](/blog/convert-notion-export-to-markdown) cubre con más profundidad el script de reescritura de ids y la alternativa basada en la API.

## Obsidian: ya es Markdown, pero no el dialecto estándar

Una bóveda de Obsidian es una carpeta de archivos `.md`, así que no hay nada que extraer: llevar una a HTML es un trabajo de conversión, no de exportación. La trampa es que varias cosas que Obsidian entiende son propias suyas.

```markdown
[[Meeting notes]]            <!-- wikilink, not standard Markdown -->
![[architecture.png]]        <!-- embed, also not standard -->

> [!warning] Careful
> This is an Obsidian callout.
```

Un conversor estándar imprime el wikilink y la incrustación como texto literal, corchetes incluidos, y renderiza el aviso como una cita en bloque con `[!warning]` arriba. O cambias el ajuste de la bóveda para que los enlaces nuevos sean enlaces Markdown normales, o buscas y reemplazas antes de convertir.

El ajuste es el interruptor «Usar [[Wikilinks]]» bajo Archivos y enlaces; desactivarlo hace que Obsidian genere enlaces Markdown estándar en su lugar (comprobado en obsidian.md, el 9 de septiembre de 2026). Solo aplica a enlaces nuevos. Todo lo ya escrito se queda como estaba, así que una bóveda que lleva dos años en marcha necesita la reescritura de todos modos — el ajuste detiene el crecimiento del problema, no lo arregla.

### El dialecto, elemento por elemento

| Obsidian escribe | Un conversor estándar ve | Qué hacer |
| --- | --- | --- |
| `[[Note]]` | el texto literal, corchetes incluidos | reescríbelo como `[Note](note.md)` contra un mapa de título a ruta |
| `[[Note\|label]]` | texto literal | reescríbelo como `[label](note.md)` |
| `![[image.png]]` | texto literal | reescríbelo como `![](image.png)` |
| `![[Note]]` | texto literal | incrusta la nota en línea, o enlázala — la transclusión no tiene equivalente |
| `[[Note#Heading]]` | texto literal | reescríbelo como `note.md#heading`, y comprueba que la regla de slug coincide con tu renderizador |
| `[[Note#^block-id]]` | texto literal | no hay destino al que enlazar; incrusta el texto citado en línea |
| `^block-id` al final de una línea | un acento circunflejo y una palabra sueltos en la salida | bórralo cuando nada lo referencie ya |
| aviso `> [!note]` | una cita en bloque con `[!note]` en la primera línea | quita la marca, conserva la cita |
| un bloque ```` ```dataview ```` | un bloque de código que muestra la consulta | la tabla que se renderizaba nunca estuvo en el archivo |
| `%%comment%%` | el texto, visible para el lector | bórralo antes de convertir |

Las referencias de bloque merecen el énfasis que les da la propia documentación de Obsidian: son específicas de Obsidian y no forman parte del Markdown estándar, así que no se transfieren (comprobado en obsidian.md, el 9 de septiembre de 2026). Lo mismo pasa con las incrustaciones. Ambas son punteros dentro de un grafo, y una carpeta de archivos no es un grafo.

La fila de Dataview es la que la gente interpreta mal. Una consulta de Dataview es un bloque de código con `dataview` como cadena de información, y la tabla que veías en Obsidian se generaba al momento de mostrarla, por un plugin. Nada de eso está en el archivo. Convierte la bóveda y obtienes el texto de la consulta en un bloque de código, correctamente, y el lector no obtiene ninguna tabla en absoluto.

El bloque de propiedades del principio es frontmatter en YAML: un conversor que no lo reconoce renderiza el `---` de apertura como una línea horizontal y convierte el de cierre en un encabezado hecho con tu última línea de metadatos.

Una vez que una nota es Markdown normal, la conversión es un trabajo aburrido: suéltala en [TransformPipe](https://transformpipe.com) para una vista previa, una pestaña de HTML fuente y un `.html` autocontenido con estilos en línea. Varias sueltas juntas se encadenan en un solo documento — o salta la limpieza manual de arriba y suelta directamente la carpeta de la bóveda, comprimida: [su conversión de Obsidian a Markdown](/obsidian-to-markdown) lee los archivos `.md` de dentro directamente, resuelve los `[[wikilinks]]`, los alias y las anclas de encabezado a las palabras que mostraban, y fusiona cada nota en un documento con un índice, en el mismo paso. [La reescritura completa de wikilinks e incrustaciones](/blog/convert-obsidian-vault-to-markdown) cubre cómo hacerlo a mano, en toda una bóveda.

### Hacer una bóveda portable antes de necesitarlo

Cuatro costumbres mantienen una bóveda convertible sin cambiar cómo escribes en ella. Desactiva los wikilinks, para que los enlaces nuevos sean estándar. Guarda los adjuntos en una carpeta dentro de la bóveda en vez de fuera, para que las rutas relativas se mantengan cuando la carpeta se copie. Evita una incrustación donde valdría un enlace, porque un enlace se degrada en un enlace y una incrustación se degrada en corchetes. Y trata las referencias de bloque como una ayuda de navegación personal en vez de como una forma de construir un argumento a base de piezas, ya que son la única construcción sin ninguna vía de degradación.

## Confluence: el formato de almacenamiento es XHTML, así que una exportación es una conversión

Confluence no guarda Markdown. Una página se guarda en el formato de almacenamiento de Confluence, que se basa en XHTML — técnicamente XML, ya que no cumple del todo con XHTML —, y las construcciones propias de Confluence viven en dos espacios de nombres: `ac:` para sus elementos y `ri:` para los identificadores de recursos. Una macro es un `ac:structured-macro`, una imagen es un `ac:image` que envuelve un `ri:attachment`, y un enlace de página es un `ac:link` que envuelve un `ri:page` (comprobado en confluence.atlassian.com, el 9 de septiembre de 2026).

Nada de esa lista tiene forma en Markdown. Así que la salida es una que tú ensamblas, y la primera decisión es qué exportación te dejan ejecutar.

| Exportación | Alcance | Quién puede ejecutarla | Qué sale |
| --- | --- | --- | --- |
| Exportar a Word | una página | cualquiera con acceso | un archivo que Word abre y otros editores a menudo no |
| Exportar a PDF | una página | cualquiera con acceso | una página renderizada; los comentarios nunca se incluyen |
| Exportación de espacio, HTML | todo el espacio | admin del espacio | zip de HTML renderizado más adjuntos |
| Exportación de espacio, XML | todo el espacio | admin del espacio | formato de almacenamiento, para restaurar dentro de Confluence |
| Exportación de espacio, CSV | todo el espacio | admin del espacio | contenido que puedes ver, con adjuntos y comentarios incluidos por defecto |
| Exportación de espacio, PDF | todo el espacio | admin del espacio | un solo archivo, sin entradas de blog, sin comentarios |

Cada fila de esa tabla viene de la propia documentación de Atlassian, exclusiones incluidas: los comentarios de página no se exportan actualmente durante una exportación a HTML, los comentarios nunca se incluyen en una exportación a PDF, las entradas de blog también se dejan fuera de una exportación de espacio a PDF, y la exportación CSV se lleva todo lo que puedes ver, adjuntos y comentarios entre ello (comprobado en support.atlassian.com, el 9 de septiembre de 2026). La exportación a Word de una sola página también está documentada como algo que produce un archivo que solo Word abre de forma fiable, lo cual la descarta como entrada para un script.

Eso deja el HTML como la única fuente sensata para una conversión masiva, lo que convierte el trabajo en [una conversión de HTML a Markdown](/html-to-markdown) con un recorrido de directorios delante. Dos formas de hacer el paso de conversión:

- Un conversor o una biblioteca sobre el HTML exportado — pandoc, o algo como turndown en un script. Las macros llegan como el HTML al que se renderizaron: un panel de información se convierte en un `div` normal, un árbol de páginas o un extracto deja enlaces al sitio en vivo. [La comparativa de pandoc](/blog/pandoc-alternatives-for-markdown-to-html) cubre cuándo se gana su instalación la herramienta más pesada.
- Una app del Marketplace que emite Markdown directamente: mejor con las macros, una cosa más que aprobar.

### En qué se convierten las macros

La regla es sencilla en cuanto la ves. Una macro que se renderizó a HTML estático sobrevive como ese HTML. Una macro que era una consulta en vivo sobrevive como una instantánea de lo que mostraba en ese momento, o como nada.

| Macro | En el HTML exportado | Después de convertir |
| --- | --- | --- |
| Panel de información, nota, aviso, consejo | un `div` con una clase y un icono | un párrafo; dale una convención de cita en bloque |
| Bloque de código | un `pre` con marcado de resaltado | un bloque con cercas, normalmente sin el lenguaje |
| Tabla de contenidos | una lista renderizada de enlaces de anclaje | una lista de enlaces a anclas que ya no existen |
| Árbol de páginas, vista de hijos | una lista renderizada de enlaces al sitio en vivo | enlaces absolutos de vuelta a Confluence |
| Extracto, inclusión | el texto transcluido, incrustado | texto duplicado en cada página que lo incluía |
| Issue o filtro de Jira | una tabla instantánea, o un enlace | una tabla congelada en el día de la exportación |
| Expandir | el contenido, expandido | contenido plano, sin desplegable |
| Macro de adjuntos | una lista de enlaces a `/download/attachments/...` | enlaces que necesitan una sesión |

Los adjuntos son la trampa recurrente: viven detrás de URLs `/download/attachments/` que esperan una sesión. Una exportación de espacio los mete en el zip, una página copiada no, así que una imagen que se ve bien mientras tienes sesión iniciada es una caja rota para cualquier otra persona.

Dos cosas más que la exportación HTML no conserva de una forma utilizable. El árbol de páginas se expresa en un archivo índice en vez de en la estructura de carpetas — los nombres de archivo exportados son planos y generados por máquina, así que la jerarquía hay que reconstruirla a partir del índice si quieres carpetas. Y las anclas de encabezado cambian: Confluence genera ids que incluyen el título de la página, así que cualquier enlace interno escrito contra `#PageTitle-Heading` deja de resolver en el momento en que tu nuevo renderizador genera `#heading` en su lugar. Las etiquetas son metadatos sin equivalente en Markdown, y merece la pena escribirlas en el frontmatter durante la conversión, porque nada más las va a conservar.

Para el caso habitual — una exportación de espacio que quieres como un solo documento legible en vez de un árbol de carpetas con una estructura de página funcionando —, [una conversión de Confluence a Markdown](/confluence-to-markdown) toma el `.zip` de exportación HTML del espacio tal como sale de Confluence, convierte el HTML de cada página con el mismo conversor que hay detrás de [la conversión de HTML a Markdown](/html-to-markdown) de arriba, y fusiona las páginas en orden en un solo documento con un índice. No reconstruye el árbol de páginas ni reescribe los enlaces `/download/attachments/` — nada lo hace sin decidir dónde van a vivir las páginas y sus adjuntos —, pero elimina el recorrido de directorios y el paso de conversión por archivo para cualquiera cuyo destino fuera desde el principio un solo documento para leer o compartir. [La comparativa completa de exportación](/blog/convert-confluence-page-to-markdown) cubre las apps del Marketplace y la diferencia entre Server/Data Center.

## Google Docs: dos vías de salida, ninguna se lleva la conversación

Google Docs a Markdown funciona casi siempre bien. Archivo, luego Descargar, ofrece Markdown (.md) directamente, y los encabezados, listas, tablas, enlaces y énfasis sobreviven (comprobado en workspaceupdates.googleblog.com, el 9 de septiembre de 2026). La misma actualización añadió una preferencia bajo Herramientas, Preferencias, Activar Markdown, que activa Copiar como Markdown y Pegar desde Markdown — útil para un fragmento, no para un documento entero.

Los comentarios y las sugerencias de edición no sobreviven. Tampoco lo hace una imagen, porque un único archivo `.md` no tiene dónde ponerla. Eso te deja con una decisión de vía en vez de una respuesta única.

| Vía | Conserva | Pierde | Úsala cuando |
| --- | --- | --- | --- |
| Descargar como Markdown | encabezados, listas, tablas, enlaces, énfasis | imágenes, comentarios, sugerencias | el documento es texto, y quieres un solo archivo |
| Descargar como Página web, comprimida | imágenes, en una carpeta junto al HTML | comentarios, sugerencias; añade estilos en línea que hay que quitar | el documento tiene capturas de pantalla |
| Descargar como Word, y convertir | imágenes, estilos, control de cambios como marcado | comentarios, sugerencias | ya estás convirtiendo `.docx` por lotes |

La vía de HTML es la que conviene por defecto cuando hay imágenes de por medio. El zip te da una carpeta de imágenes y un archivo HTML, y el paso de conversión quita la sopa de clases y los atributos `style` en línea que Google pone en cada párrafo — que es justo el punto, porque nada de eso significa algo en Markdown. [El recorrido completo de esa conversión](/blog/convert-google-docs-to-markdown) cubre los detalles que conviene saber antes de un lote.

Las sugerencias son el modo de fallo con dientes. Un documento en modo de sugerencias contiene dos versiones de sí mismo, y la exportación contiene una de ellas, elegida por ti. Acepta o rechaza todo antes de exportar, para que el archivo que conviertas sea el documento que crees que es. Lo mismo con los comentarios: si una decisión existe solo en un hilo resuelto, cópiala en el cuerpo primero o pierdela.

## Word: un conversor puede leer estructura, no intención

Un `.docx` es un zip de XML, y Word a Markdown funciona más o menos tan bien como se lo merece el documento. Los encabezados escritos con los estilos de encabezado de Word se convierten en encabezados `#`; los encabezados simulados con negrita de 16pt se convierten en párrafos de texto en negrita. Las listas numeradas se dividen igual, así que arreglar los estilos en Word gana a arreglar el Markdown después.

Eso merece decirse como regla, porque decide dónde ocurre el trabajo. Un conversor puede leer estructura que se expresó de forma estructural. No puede leer intención. Si el documento se formateó a ojo — negrita en vez de encabezados, tabulaciones en vez de listas, un párrafo en blanco en vez de una regla de espaciado —, la conversión produce un muro de texto plano que es técnicamente fiel e inútil, y el arreglo más barato es media hora en Word aplicando estilos antes de convertir nada. [Qué conserva y qué pierde una conversión de `.docx`](/blog/convert-docx-to-markdown) cubre el resto: control de cambios, comentarios, cuadros de texto, notas al pie, objetos incrustados, y las imágenes que salen a una carpeta junto al archivo.

## Evernote, Bear, Apple Notes, Roam y todo lo demás

Estos cuatro aparecen lo bastante seguido como para nombrarlos, y cada uno tiene una vía que conviene conocer. La última entrada es el recurso para todo lo que no se nombra en ningún sitio de arriba.

**Evernote.** Selecciona notas o un bloc y exporta como ENEX, HTML de una página, o HTML de varias páginas; la exportación está limitada a 100 notas a la vez, aunque un bloc entero puede ir de una sola tirada (comprobado en help.evernote.com, el 9 de septiembre de 2026). ENEX es un contenedor XML que solo Evernote y sus importadores leen, así que a menos que te muevas a algo que importa ENEX, coge la exportación HTML de varias páginas: te da un archivo HTML por nota, una carpeta de recursos compartida entre ellas, y un índice que las enlaza entre sí. A partir de ahí es el mismo paso de HTML a Markdown que todo lo demás.

**Bear.** Una nota individual se exporta como `.txt`, `.md`, `.textbundle`, `.bearnote` o `.rtf`, con HTML, DOCX, PDF, JPG y ePub disponibles en Bear Pro; varias notas a la vez pasan por Archivo, Exportar notas en el Mac (comprobado en bear.app, el 9 de septiembre de 2026). Elige Textbundle en vez de Markdown plano cuando las notas tengan imágenes — un Textbundle es el Markdown y sus recursos en un solo paquete, que es exactamente el problema que un `.md` suelto no puede resolver. Las etiquetas de Bear se escriben como `#etiqueta` en el cuerpo, y un conversor estándar lee una línea que empieza por `#` como un encabezado, así que una línea de etiquetas necesita atención antes de convertir en vez de después.

**Apple Notes.** En el Mac, Archivo, Exportar como ofrece PDF y Markdown, y el lado de importación acepta TXT, RTF, RTFD, HTML y el ENEX de Evernote, con un Archivo, Importar Markdown por separado (comprobado en support.apple.com, el 9 de septiembre de 2026). Es por nota: no hay exportación de toda la biblioteca, así que cualquier cosa más allá de unas pocas docenas de notas significa seleccionar en tandas. Los adjuntos no forman parte de la exportación a Markdown.

**Roam.** Roam funciona por esquema: cada viñeta es un bloque con un id, y tanto las referencias de bloque como las consultas son punteros dentro del grafo en vez de texto dentro de una página. Sea cual sea el formato de exportación que elijas, esas dos construcciones no tienen equivalente en Markdown — una referencia hay que incrustarla como su texto o descartarla, y una consulta no tiene resultado que llevar consigo. Lee el menú de exportación de tu propio grafo antes de planificar en torno a un formato, y planifica la reescritura de referencias de todos modos.

**Todo lo demás.** Para una herramienta sin conversor propio — una wiki vieja, un CMS, un centro de ayuda, un correo — coge el HTML que sea que produzca y aplica un paso de HTML a Markdown, porque HTML es el formato que casi todo puede producir. Cuando no hay ninguna exportación en absoluto, el navegador es la exportación: guarda la página renderizada, o copia la región del artículo. Lo que obtienes es todo el chrome de la página además de su contenido, así que la conversión va seguida de un paso de recorte, y el recorte suele ser un solo selector.

## Migrar mil páginas, donde la respuesta de un clic falla

Todo lo anterior describe un solo documento. Una migración es un problema distinto, y la versión honesta va así.

| Escala | Lo que cuesta de verdad | Qué hacer |
| --- | --- | --- |
| Menos de 10 páginas | una hora, quizá dos | arréglalo a mano, en el orden en que lo notará un lector |
| Entre 10 y 50 | una tarde | arréglalo a mano, pero lleva una lista de los defectos que se repiten |
| Entre 50 y 200 | un día de trabajo manual, o media jornada de script | automatiza los dos o tres defectos que se repiten, arregla el resto a mano |
| 200 y más | días de cualquier forma | escribe el script, y reserva tiempo para la segunda pasada |

El umbral no es más bajo porque el script no sea un conversor. La conversión es la parte fácil — una llamada de biblioteca por archivo. El script es un problema de reescritura, y contiene cuatro reescrituras separadas, cada una de las cuales puede quedar terminada y correcta mientras las otras tres siguen rotas.

**Nombres de archivo.** Quita el sufijo del id, convierte lo que queda en un slug, y resuelve las colisiones: dos páginas llamadas «Notas de la reunión» bajo padres distintos son un mismo nombre de archivo tras el slugificado. Construye un mapa de la ruta antigua a la nueva y escríbelo a disco, porque lo vas a necesitar tres veces más, y otra vez dentro de seis meses cuando alguien pregunte adónde fue una página.

**Enlaces.** Cada enlace interno de la exportación está escrito contra el nombre de archivo antiguo, codificado por porcentaje. Reescribe cada uno pasándolo por el mapa. Los enlaces que apuntaban a la propia aplicación en vez de a otra página — una URL absoluta dentro del espacio de trabajo o la wiki — son un segundo conjunto, que se empareja por id o por clave de página en vez de por nombre de archivo, y son los que siguen funcionando en silencio el día que apagas el sistema antiguo y rotos en silencio el día siguiente.

**Adjuntos.** Muévelos a un único directorio de recursos, reescribe el `src` de cada imagen, y elimina duplicados: el mismo logotipo exportado en cuarenta carpetas de página son cuarenta archivos. Los nombres con espacios, acentos o emojis se normalizan aquí, una sola vez, en vez de en el primer renderizador que se queje de ellos.

**Anclas.** Los ids de encabezado los genera lo que sea que renderice el Markdown, y la regla nueva no va a coincidir con la antigua. Los enlaces internos y cualquier bloque de tabla de contenidos hay que regenerarlos, no reescribirlos.

Haz las cuatro cosas en una sola pasada sobre un documento parseado, en vez de con una cadena de expresiones regulares sobre el texto en crudo. Una expresión regular que reescribe `](...)` también reescribe el interior de un bloque de código con cercas, y la página donde lo notas es justo la que documenta la sintaxis de enlaces. Parsea, recorre el árbol, escríbelo de vuelta. Una vez que el árbol está bien, [ejecutar la conversión sobre todo el directorio](/blog/batch-convert-markdown-files) es la parte corta.

### Qué muestrear antes de comprometerte con un script

Elige seis páginas, no una, y elígelas a propósito: la página más larga, la más enlazada, la que tiene más imágenes, una página cargada de tablas o de base de datos, una que se apoye mucho en las construcciones propias de la herramienta — avisos, macros, incrustaciones — y una escrita por quien en el equipo use la aplicación de la forma más peculiar. Esa última encuentra más defectos que las otras cinco juntas.

Lleva las seis por todo el camino, hasta HTML terminado, y comprueba cada una contra la lista de abajo. Lo que falle en la muestra es lo que el script tiene que gestionar; lo que el script no pueda gestionar es lo que alguien arregla a mano, y ahora sabes cuántas páginas son.

- [ ] **Enlaces.** Los internos primero: si siguen apuntando a las URLs antiguas o a nombres de archivo que ya no existen.
- [ ] **Imágenes.** Abre el archivo convertido desde algún sitio distinto de la carpeta de exportación.
- [ ] **Tablas.** Las celdas fusionadas y el contenido anidado no tienen forma en Markdown; llegan aplanados o directamente faltan.
- [ ] **Avisos y paneles.** Elige una sola sustitución, una cita en bloque con una entrada en negrita, y úsala en todas partes.
- [ ] **Bloques de código.** Comprueba que las pistas de lenguaje pasaron, y que el corrector automático no metió comillas tipográficas en el código.
- [ ] **Anclas.** Haz clic en cada enlace interno, incluidos los que generó un bloque de contenidos.
- [ ] **Frontmatter.** Decide qué metadatos vas a conservar antes de correr el script, no después.
- [ ] **Codificación.** Los espacios irrompibles, los guiones blandos y las comillas tipográficas viajan de forma invisible y rompen las búsquedas y los diffs.
- [ ] **Colisiones.** Dos páginas que acabaron con el mismo nombre de archivo son una pérdida de datos silenciosa, y el único síntoma es un archivo con el contenido equivocado dentro.

### El orden de las operaciones

Ejecuta el script en un directorio de salida nuevo cada vez, para que una mala corrida se borre en vez de tener que desenredarla, y nunca dentro de la propia carpeta de exportación. Compara la segunda corrida contra la primera: ese diff es lo único que te dice qué cambió tu arreglo y qué cambió por accidente. Y decide de antemano si el sistema antiguo se congela mientras corre la migración o si aceptas un delta y reexportas las páginas que se movieron — las dos son viables, y descubrir después cuál elegiste no lo es.

## Cómo elegir la vía de salida

1. **Exporta una vez, y guarda el archivo.** Si conviertes en el mismo sitio no puedes volver a ejecutar el script, y vas a volver a ejecutarlo — probablemente tres veces.
2. **Elige la vía por lo que tienes que conservar, no por cuántos clics cuesta.** Si el documento tiene capturas de pantalla, la ruta de Markdown en un solo archivo estaba mal antes de empezar, y ninguna reparación después devuelve las imágenes.
3. **Prefiere la exportación que empaqueta los recursos sobre la que los enlaza.** Una ruta que necesita una sesión es una imagen que funciona para ti y una caja rota para cualquier lector, y no lo vas a notar, porque tú tienes la sesión iniciada.
4. **Decide qué sustituye a cada construcción antes de convertir, no después.** Una convención de cita en bloque elegida de antemano gana a cincuenta improvisadas descubiertas en revisión, y la segunda es mucho más cara de deshacer.
5. **Convierte un documento representativo de principio a fin antes que el resto.** Llevarlo hasta HTML terminado te dice si el arreglo es un ajuste, un buscar-y-reemplazar o un conversor — tres respuestas con costes muy distintos.
6. **Cuenta las páginas antes de escribir código.** Por debajo de unas veinte, las manos ganan a un script; por encima de unas doscientas, las manos son una semana que no recuperas.
7. **Guarda el mapa de lo antiguo a lo nuevo sea cual sea la escala.** Sin él no puedes escribir una lista de redirecciones, y una wiki sin redirecciones es una wiki en la que cada marcador que alguien guardó ahora es un 404.

## Conclusión

Cada una de estas aplicaciones te va a dar algo. La habilidad está en saber qué, y en comprobarlo antes de que el original desaparezca: un zip de Notion cuyos enlaces apuntan todos a ids, una bóveda cuyos wikilinks nada más lee, un espacio de Confluence donde las macros eran la parte útil, un Google Doc cuyas imágenes nunca estuvieron en el archivo. Lleva un documento real por todo el camino primero, repara lo que se rompa, y solo entonces decide si el resto es una tarde de trabajo manual o un script con cuatro reescrituras dentro. Cuando el Markdown por fin esté limpio, [TransformPipe](https://transformpipe.com) lo convierte en una página que puedes compartir, y su CLI acepta un lote de archivos en un solo comando, con `--merge` encadenándolos en uno.

## Preguntas frecuentes

### ¿Puedo exportar una página de Notion directamente como Markdown?

Sí — el cuadro de diálogo de exportación ofrece Markdown y CSV como formato, y una sola página sale como un archivo `.md` con sus imágenes en una carpeta al lado. Las bases de datos en esa exportación se convierten en archivos CSV en vez de tablas de Markdown, y cada nombre de archivo y cada enlace interno lleva el id de la página.

### ¿Por qué mis nombres de archivo de Notion tienen códigos largos?

Porque Notion identifica las páginas por id y el título es solo una etiqueta, así que la exportación añade el id de la página para mantener los nombres únicos. Ese id es el mismo que aparece en la URL de la página, lo que lo convierte en una clave útil: construye un mapa de id a nuevo nombre de archivo, y luego reescribe los enlaces y los nombres de archivo en una sola pasada.

### ¿Cómo paso una página de Confluence a Markdown?

No hay exportación a Markdown, así que exportas HTML y lo conviertes. Todo un espacio se exporta a HTML comprimido si eres admin del espacio, que es también la única vía que empaqueta los adjuntos; una sola página solo ofrece Word y PDF, y el PDF es un callejón sin salida. Las macros llegan como el HTML al que se renderizaron.

### ¿Las notas de Obsidian funcionan en otras herramientas de Markdown?

El Markdown plano sí. Los wikilinks, las incrustaciones, las referencias de bloque y los avisos no, porque son sintaxis propia de Obsidian y un parser estándar los imprime como texto literal. Desactiva el ajuste de wikilinks para que los enlaces nuevos sean estándar, y reescribe los existentes antes de convertir.

### ¿Exportar desde Google Docs conserva mis imágenes y comentarios?

Las imágenes sobreviven a la descarga como Página web, que te da un zip con una carpeta de imágenes, y no sobreviven a la descarga como Markdown, que es un solo archivo sin dónde ponerlas. Los comentarios y las sugerencias de edición no sobreviven a ninguna de las dos vías, así que resuélvelos y acepta o rechaza cada sugerencia antes de exportar nada.

### ¿Cuál es la forma más rápida de mover una wiki entera a Markdown?

Exporta una vez, convierte una página representativa hasta HTML terminado, y deja que lo que se rompa en esa página te diga si necesitas un script. Si lo necesitas, trátalo como un trabajo de reescritura sobre nombres de archivo, enlaces, rutas de adjuntos y anclas en vez de como un trabajo de conversión, y guarda el mapa de lo antiguo a lo nuevo para poder escribir redirecciones.

### ¿Qué exportaciones conservan los comentarios y la discusión?

Casi ninguna. Los comentarios de Notion no están en la exportación, los comentarios de página de Confluence están ausentes de la exportación HTML y nunca en un PDF, y los comentarios de Google Docs no salen en ningún formato de descarga. Si una decisión existe solo en un hilo de comentarios, cópiala al cuerpo del documento antes de exportar nada.
