---
title: "Qué no sobrevive de una .docx: el formato que se pierde al pasar a Markdown"
description: Un inventario de lo que lleva un Word y Markdown no puede expresar, qué pérdidas importan, cuáles son hábitos que conviene soltar, y qué hacer con las leyendas.
date: 2026-08-17
tag: Conversión
keywords: docx a markdown se pierde el formato, word a markdown pierde formato, la conversión de docx pierde los estilos, leyendas de word en markdown, referencias cruzadas de word en markdown, cambios control de word en markdown, saltos de página docx markdown
---

Conviertes un documento de Word a Markdown y falta algo. A veces es la cita destacada de la página dos. A veces es la numeración. A veces no es nada que puedas nombrar, solo una sensación: el documento parecía un documento y ahora parece un archivo de texto.

Las dos reacciones suelen tener razón, y hablan de cosas distintas. Una `.docx` lleva cientos de datos distintos sobre cómo deben verse sus palabras. Markdown lleva alrededor de una docena de datos sobre qué son sus palabras. Convertir entre los dos no es comprimir; es cambiar de tema. La pregunta interesante no es cuánto se perdió, sino cuál de esas pérdidas debería importarte.

### Resumen rápido

La mayor parte de lo que una `.docx` pierde en el camino a Markdown es presentación, y la presentación es la parte que de todas formas ibas a sobrescribir: fuentes, tamaños, colores, márgenes, saltos de página, columnas, cabeceras y pies describen todos una página impresa que ya no existe. Cuatro pérdidas son reales y merecen trabajo: **los cambios con seguimiento**, **los comentarios**, **las leyendas** y **las referencias cruzadas**, porque cada una lleva un significado que no se puede reconstruir solo a partir de las palabras. Los cuadros de texto son la pérdida que la gente pasa por alto más a menudo, porque el texto sencillamente no está y nada te avisa. Arregla las leyendas y las referencias cruzadas a mano antes de convertir, conserva la capa de revisión con una herramienta que tenga un flag documentado para ello, y archiva el original en cualquier caso.

## Lo que tiene Markdown, y por qué la lista es tan corta

Ayuda ver de una vez todo el formato de destino. Markdown, en la especificación CommonMark, te da: párrafos, seis niveles de encabezado, énfasis, énfasis fuerte, listas ordenadas y sin ordenar, citas en bloque, fragmentos de código, bloques de código con vallas o con sangría, separadores temáticos, enlaces, imágenes, saltos de línea forzados, y HTML crudo. GitHub Flavored Markdown añade tablas, elementos de lista de tareas, tachado y autoenlaces. Las notas al pie no están en ninguna de las dos especificaciones; GitHub las renderiza y muchos analizadores no, algo que [merece la pena saber antes de depender de cualquier extensión](/blog/commonmark-gfm-and-the-flavours).

Ese es todo el vocabulario. No hay sintaxis para una tipografía, un tamaño de punto, un color, un margen, una página, una columna, una leyenda, una referencia cruzada, un comentario, una inserción, una eliminación, un cuadro de texto, una tabulación o una celda de tabla que abarque dos columnas. No es «soporte limitado» — no hay sintaxis en absoluto. Cualquier herramienta que parezca conservar una de esas cosas está emitiendo HTML crudo con un atributo `style`, que es un documento distinto con una extensión `.md` puesta encima.

Que la lista sea corta es una decisión de diseño, no un descuido. Markdown describe estructura: esto es un encabezado, esto es una lista, esto es una cita. Cómo se ve un encabezado es problema de otro, decidido más tarde, por una hoja de estilos, un renderizador o un theme. Word describe las dos cosas a la vez y te deja saltarte la estructura del todo — puedes hacer un encabezado seleccionando una línea, eligiendo 16 pt en negrita, y pulsando centrar. Word lo va a renderizar exactamente como lo pediste. Nada en el archivo registra que fuera un encabezado.

Esa única diferencia explica la mayor parte de lo que la gente llama pérdida de formato. Un conversor lee una `.docx` buscando estructura. Donde el documento tiene estructura, la conversión sale limpia y un poco aburrida. Donde el documento tiene apariencia haciendo las veces de estructura, el conversor no tiene nada que leer, y la apariencia se cae porque no hay dónde ponerla. El documento no perdió sus encabezados. Nunca los tuvo.

## El inventario, punto por punto, con un veredicto

Todo lo que puede llevar una `.docx`, lo que Markdown puede expresar de ello, y si la pérdida merece tu atención. «Duelo» significa que la información se ha ido y no se puede reconstruir a partir de las palabras. «Mejor así» significa que el documento está mejor sin ella. «Hay que trabajar» significa que importa y hay algo concreto que hacer.

| Qué lleva el archivo Word | Equivalente en Markdown | Veredicto | Qué hacer con ello |
| --- | --- | --- | --- |
| Tipografía y tamaño de punto | Ninguno | Mejor así | Nada. El renderizador decide |
| Color de texto y resaltado | Ninguno | Mejor así, salvo que el color llevara significado | Sustituir el código de colores por palabras antes de convertir |
| Negrita y cursiva | `**` y `*` | Sobrevive | Nada |
| Versalitas, contorno, sombra, espaciado de caracteres | Ninguno | Mejor así | Nada |
| Superíndice y subíndice | Solo HTML crudo | Pérdida menor | Aceptar `<sup>`/`<sub>` en la salida, o reescribir |
| Tachado | `~~`, solo en GFM | Sobrevive en su mayoría | Comprobar el dialecto de tu renderizador |
| Tamaño de página, márgenes, orientación | Ninguno | Mejor así | Nada. No hay páginas |
| Saltos de página | Ninguno | Mejor así | Borrar líneas en blanco sueltas y marcas perdidas |
| Saltos de sección | Ninguno | Mejor así | Nada, salvo que las cabeceras cambiaran por sección |
| Varias columnas | Ninguno | Mejor así | Nada. El orden de lectura ahora es lineal |
| Cabeceras, pies, números de página | Ninguno | Duelo por una línea de ello | Traer «Confidencial», la versión o la fecha al cuerpo |
| Marcas de agua | Ninguno | Duelo si decía BORRADOR | Poner el estado en el frontmatter o en la primera línea |
| Tabulaciones, puntos de guía, alineación manual | Ninguno | Mejor así | Convertir listas de contenido con puntos en enlaces reales |
| Interlineado, sangrías, espacio antes y después | Ninguno | Mejor así | Nada |
| Cuadros de texto y citas destacadas | Ninguno; el texto suele desaparecer | Duelo, y comprobar | Buscar en la salida una frase que sabías que estaba en uno |
| Formas, SmartArt, gráficos, diagramas | Ninguno | Duelo | Exportar como imágenes y referenciarlas |
| Imágenes en el flujo | Solo una referencia `![]()` | Sobrevive como referencia | Extraer los archivos; comprobar cada ruta |
| Cambios con seguimiento | Ninguno | Duelo — este es el caso caro | Convertir con una herramienta que los conserve, o conservar la `.docx` |
| Comentarios | Ninguno | Duelo | Exportar el hilo por separado antes de convertir |
| Notas al pie y al final | Solo sintaxis de extensión | Depende del renderizador | Probar un documento con notas al pie de principio a fin |
| Leyendas | Ninguno | Hay que trabajar | Reescribir como líneas en cursiva o como `<figcaption>` en HTML |
| Referencias cruzadas (`REF`, `PAGEREF`) | Ninguno; se vuelve texto obsoleto | Hay que trabajar | Reescribir como enlaces de anclaje antes o después de convertir |
| Campo de tabla de contenidos | Ninguno | Mejor así | Borrarlo; dejar que el renderizador construya uno nuevo |
| Índice y entradas de índice | Ninguno | Duelo, raramente | Aceptar la pérdida o conservar un PDF |
| Marcadores | Anclas de encabezado, indirectamente | Parcial | Volver a anclar todo lo que enlazabas |
| Hiperenlaces | `[]()` | Sobrevive | Comprobar los enlaces relativos y dentro del documento |
| Listas numeradas y con viñetas | `1.` y `-` | Sobrevive normalmente, a veces colapsa | Comprobar si existe `numbering.xml` en el archivo |
| Tablas simples | Tablas GFM | Sobrevive | Contar las columnas |
| Celdas combinadas, tablas anidadas, bloques dentro de celdas | Ninguno | Duelo | Reformar a mano o conservar como HTML |
| Estilos semánticos: Título 1-9, Cita, Leyenda | Encabezados, citas en bloque | Sobrevive si se usan bien | Reparar documentos que fingen encabezados con negrita |
| Estilos decorativos: Párrafo de lista, Texto, propios | Ninguno | Mejor así | Nada |
| Ecuaciones (OMML) | Ninguno; a veces texto ilegible | Duelo | Reescribir en TeX o exportar como imágenes |
| Controles de contenido y campos de formulario | Ninguno | Duelo si era un formulario | El documento era una aplicación, no un documento |
| Objetos incrustados: hojas de cálculo, PDF, otros documentos | Ninguno | Duelo | Extraer y guardar al lado |
| Propiedades del documento: autor, título, empresa, revisión | Frontmatter, si la herramienta lo escribe | Parcial | Copiar a mano lo que importe al frontmatter |
| Metadatos de idioma y revisión ortográfica | Ninguno | Mejor así | Nada |
| Campos que calculan: `DATE`, `STYLEREF`, `SEQ` | Texto congelado en caché | Hay que trabajar | Buscar y sustituir cada uno por texto real |

## Presentación: fuentes, tamaños, colores y estilos sin significado

Esta es la categoría más grande en volumen y la más pequeña en consecuencias. Una `.docx` registra, para cada tramo de caracteres, un conjunto de propiedades: familia de fuente, tamaño en semipuntos, grosor, color como valor hexadecimal, resaltado, espaciado, interletrado, si son versalitas. Markdown no registra nada de eso, y tampoco lo hace el HTML que produce de camino un buen conversor. Las propiedades simplemente se leen y se ignoran.

Para casi cualquier documento, ese es el resultado correcto. El Calibri de 11 pt era el valor por defecto de Word, no una decisión. Los encabezados azules eran el azul de cualquier theme que se aplicara en 2019. El único párrafo en Georgia es donde alguien pegó desde un correo. Nada de eso sobrevive, nada debería, y el documento se lee mejor en cuanto una sola hoja de estilos decide todo eso de forma consistente.

Hay una excepción, y merece tomarse en serio. A veces el color es el único sitio donde vive un significado. Una especificación donde el texto rojo significa «todavía sin acordar». Una lista de precios donde el verde significa «confirmado». Un borrador de traducción donde los pasajes resaltados son los que necesitan revisión. Convierte ese documento y obtienes una lista plana de elementos sin ninguna forma de saber cuáles eran cuáles, y las palabras mismas no te lo van a decir, porque todo el sentido del color era que las palabras no tuvieran que hacerlo.

El arreglo no es una opción del conversor. No hay sintaxis a la que convertir el color. El arreglo es pasar veinte minutos antes en Word añadiendo la palabra para la que el color hacía de sustituto — «(sin acordar)», «(confirmado)», «(por revisar)» — y luego convertir. Es tedioso, y es lo único que funciona, y es mucho más fácil antes de la conversión que después, porque antes de convertir todavía puedes ver cuáles eran rojas.

**Los estilos son el mismo problema con otra cara.** El mecanismo de estilos de Word es genuinamente bueno: un párrafo lleva un `w:pStyle` que nombra su estilo, y la definición del estilo vive en `word/styles.xml`. Los conversores leen el nombre del estilo y lo asignan. Título 1 se convierte en `#`, Título 2 en `##`, Cita se convierte en una cita en bloque. mammoth incluye por defecto una asignación de estilos que hace exactamente esto y te deja añadir tus propias asignaciones para estilos de casa que no puede conocer.

El problema es que la mayoría de documentos de Word no usan estilos para la estructura. Usan Normal para todo y recurren a la barra de herramientas. Un documento escrito así se convierte en una larga secuencia de párrafos, correctamente, porque eso es lo que es. El encabezado que ves en pantalla es un párrafo cuyas propiedades de tramo dicen, por casualidad, negrita y 16 pt, y ningún conversor lo va a ascender, porque ascenderlo significaría adivinar — y el mismo documento tiene negrita y 16 pt en algún punto en mitad de una frase donde alguien destacó el nombre de un producto.

Luego está la otra mitad de la lista de estilos: Párrafo de lista, Texto, Texto con sangría, Sin espaciado, más lo que sea que una plantilla heredara de una plantilla que heredó del estilo de casa de una empresa de 2011. Estos describen sangría y espaciado. No tienen contenido semántico, no se asignan a nada, y dejarlos caer no es una pérdida de ningún tipo. Si conviertes un documento y la salida no tiene ni rastro de «Párrafo de lista», no ha ido mal nada.

## Mobiliario de página y contenido que flota

Todo en esta sección describe una página impresa. Markdown no tiene páginas, y el HTML renderizado en un navegador tampoco las tiene hasta que alguien lo imprime. Así que estas pérdidas son estructurales y no accidentales — no hay nada al otro lado que las reciba.

**Los márgenes, el tamaño de página, la orientación y las columnas** viven en un elemento de propiedades de sección, `w:sectPr`, al final de una sección. Registra el tamaño del papel, los cuatro márgenes, el margen de encuadernación, si las páginas se reflejan, y el diseño de columnas. Todo eso se va. Y, curiosamente, también se va el problema de orden de lectura que crean las columnas: un diseño a dos columnas en Word es una sola historia continua repartida en dos cajas, y convertirlo produce la historia en orden. La gente espera que esto se rompa y normalmente no se rompe.

**Los saltos de página** son un tramo que contiene `<w:br w:type="page"/>`, o una propiedad de párrafo que dice salto de página antes. No hay Markdown para ellos porque no hay página que romper. La mayoría de conversores los descartan en silencio. Si tu salida tiene una línea en blanco extraña o una marca perdida donde antes empezaba un capítulo, ese es el residuo. Bórralo. Si el documento de verdad necesita romperse para impresión más adelante, el sitio para decirlo es el CSS de lo que sea que lo renderice — `break-before: page` en una clase de encabezado — no el Markdown.

**Las cabeceras, los pies y los números de página** son partes separadas dentro del archivo: `word/header1.xml`, `word/footer1.xml` y sus hermanos, referenciados desde las propiedades de sección. Todo los descarta, y normalmente eso es correcto, porque «Página 3 de 12» no tiene sentido en un documento sin páginas.

Suele valer la pena rescatar una línea de un pie de página. Un documento cuyo pie decía «Confidencial — solo uso interno — v4.2 — revisado el 12 de marzo» ha sido republicado ahora, en un formato fácil de compartir, sin nada de eso encima. La clasificación, la versión y la fecha de revisión estaban solo en el mobiliario. Antes de convertir, lee la cabecera y el pie una vez, y pon lo que importe en el frontmatter o en la primera línea del cuerpo, donde un lector de verdad se lo va a encontrar.

**Las marcas de agua** son la misma historia en una forma más dramática. Una marca de agua de BORRADOR es una forma en la cabecera, dibujada detrás del texto. Se convierte en nada, así que un borrador pasa a ser indistinguible de un documento final. Di «Borrador» con palabras.

**Los cuadros de texto son la pérdida que a la gente le cuesta más creer.** Un cuadro de texto no forma parte del flujo del documento; es un objeto de dibujo, y el texto que hay dentro se sienta en un elemento `w:txbxContent` adjunto a una forma. Según cómo se creó, esa forma puede venir envuelta en un bloque de contenido alternativo que guarda dos versiones de sí misma para distintas versiones de Word. Los conversores que recorren el cuerpo del documento buscando párrafos pueden no llegar nunca a su interior. Así que la cita destacada que ves en pantalla, la barra lateral con la definición clave, el cuadro de color con el resumen de tres frases que alguien va a preguntar más tarde — nada de eso aparece en la salida, y no se avisa de ningún error, porque desde el punto de vista del conversor no se ha saltado nada.

La única comprobación fiable es buscar. Elige una frase de cada elemento en un cuadro del original, una por una, y búscala en el archivo convertido. Si falta, vuelve a escribirla — como una cita en bloque, un encabezado, o un párrafo normal en el sitio al que pertenece. Y haz eso antes de archivar la `.docx`, porque la búsqueda es fácil mientras los dos archivos están abiertos e imposible en cuanto solo te queda uno.

**Las formas, SmartArt, gráficos y diagramas** siguen el mismo camino y por la misma razón, salvo que aquí la pérdida no admite discusión: un diagrama de proceso es información, y Markdown no tiene forma de contenerla. Exporta cada uno como PNG o SVG desde Word, pon los archivos en algún sitio estable, y referéncialos. Eso convierte una pérdida total en una dependencia de imágenes, que es un problema mucho más pequeño — aunque no gratuito, porque [una referencia de imagen que funciona en local puede romperse igualmente cuando el archivo se mueve](/blog/images-and-links-that-still-work).

## La capa de revisión: cambios con seguimiento y comentarios

Esta es la categoría en la que una conversión descuidada destruye algo que nadie puede reconstruir.

Una `.docx` revisada no contiene el texto final. Contiene los dos textos a la vez: inserciones envueltas en `w:ins`, eliminaciones envueltas en `w:del`, cada una con un autor y una marca de tiempo, y el texto eliminado conservado por completo dentro de la eliminación. Eso es lo que hace posible el panel de revisión de Word. También es lo que convierte un documento de Word en un registro de una negociación en vez de en la declaración de una posición.

Markdown no tiene nada para esto. No hay sintaxis para «esta cláusula la insertó la otra parte el martes» ni sintaxis para «se eliminaron estas once palabras». Un conversor tiene por tanto que elegir, y la mayoría elige sin decírtelo. El comportamiento habitual es entregarte el texto como si se hubieran aceptado todos los cambios — que es una de tres respuestas plausibles, aplicada en silencio, a una pregunta que no te hicieron. Las eliminaciones de alguien ya no están, y con ellas el hecho de que alguna vez se propusieran.

Pandoc es la herramienta que tiene aquí un control documentado: `--track-changes` acepta `accept`, `reject` o `all`, y solo `all` conserva las dos versiones en la salida, envueltas en spans. El enfoque de mammoth es distinto — trabaja a partir de una asignación de estilos, y el marcado de revisión no es algo que sus valores por defecto sacan a la superficie. La consecuencia práctica es la misma en ambos casos: si un documento ha pasado por revisión y no estás conservando la revisión a propósito, estás convirtiendo el resultado y descartando el argumento.

**Los comentarios son peores, porque no tienen dónde anclarse.** Un comentario de Word se ancla a un rango de texto con las marcas `w:commentRangeStart` y `w:commentRangeEnd`, y el texto del comentario en sí vive en `word/comments.xml` con un autor, una fecha, y posiblemente un hilo de respuestas. Markdown no tiene el concepto de una anotación de rango. Incluso si un conversor escribiera el texto del comentario, solo podría ponerlo cerca del texto, no sobre él, y el anclaje es la mitad del significado: «esto» en un comentario se refiere exactamente a las palabras a las que estaba adjunto.

El manual de Pandoc es explícito en que `accept` y `reject` ignoran los comentarios, y solo `all` los incluye. A mammoth se le puede hacer emitir referencias de comentario si añades una asignación de estilo para ellos, algo que su documentación cubre y que casi nadie hace. Todo lo demás los descarta y no dice nada.

El consejo honesto es dejar de tratar esto como un problema de conversión. Si el hilo de revisión importa —y en un contrato, una especificación o un trabajo académico a menudo es lo más valioso del archivo—, sácalo primero de Word en sus propios términos. Word puede imprimir o exportar el documento con comentarios, y un PDF de la versión marcada es un archivo perfectamente bueno. Luego convierte el texto limpio a Markdown para el futuro, y conserva la copia marcada para el pasado. Dos archivos, cada uno bueno en una sola tarea, es mejor resultado que uno solo que finge hacer las dos.

Las notas al pie están en el borde de esta categoría. Al menos tienen un hogar posible: `word/footnotes.xml` las guarda, y el propio dialecto de Markdown de Pandoc tiene sintaxis de notas al pie para escribirlas. Pero las notas al pie no están en CommonMark, así que un conversor dirigido a CommonMark estricto tiene que incrustarlas, añadirlas como párrafos normales al final, o descartarlas. Convierte un documento con notas al pie, baja hasta el final, y mira, antes de asumir que el comportamiento que quieres es el que tienes.

## Leyendas, referencias cruzadas y campos: las pérdidas que merecen trabajo

Estas merecen su propia sección porque son las únicas pérdidas de este artículo en las que un trabajo concreto y repetible convierte de forma fiable un mal resultado en uno bueno.

**Una leyenda en Word no es una línea de texto bajo una imagen.** Es un párrafo en el estilo Leyenda que contiene un campo `SEQ` —algo como `SEQ Figure \* ARABIC`— que Word calcula para producir el número. Por eso insertar una figura nueva a mitad de un documento renumera todo lo que viene después. El número no está escrito; se deriva de la posición.

Convierte ese documento y pasan dos cosas. El estilo Leyenda no tiene equivalente en Markdown, así que el párrafo se convierte en un párrafo normal, visualmente indistinguible del cuerpo del texto. Y el campo se congela en el número que Word calculó por última vez. Ahora tienes un documento donde «Figura 4» es una frase corriente entre dos párrafos, y va a seguir diciendo 4 después de que borres la Figura 2.

Hay dos arreglos decentes y uno malo. El malo es dejarlas y esperar. El primero decente es aceptar que la leyenda ya es prosa y hacer que se vea deliberado: una línea en cursiva justo después de la imagen, con la numeración eliminada del todo o renumerada a mano y ya nunca tocada. Quitar los números suele ser mejor, porque una leyenda que dice qué muestra la figura es más útil que una que dice qué figura es, y no se puede quedar obsoleta.

El segundo es conservar la semántica bajando a HTML, algo que Markdown permite: un elemento `<figure>` que envuelve la imagen con un `<figcaption>` dentro. Eso le da a un renderizador algo real que estilizar y a un lector de pantalla algo real que anunciar. Te cuesta la legibilidad de la fuente Markdown en ese punto, y es el intercambio correcto para documentos donde las figuras son estructurales — un trabajo académico, un manual, un informe con veinte diagramas. El Markdown de Pandoc tiene una extensión `implicit_figures` que trata un párrafo que solo contiene una imagen como una figura con el texto alternativo como leyenda, algo que merece la pena saber si ya conviertes a través de Pandoc, porque significa que escribir la leyenda como texto alternativo te da la estructura gratis.

**Las referencias cruzadas son el mismo mecanismo apuntando hacia dentro, y fallan más en silencio.** «Ver la sección 4.2 en la página 11» es, en el archivo, un campo `REF` que apunta a un marcador y un campo `PAGEREF` que apunta a la página de ese mismo marcador. Word recalcula los dos. Markdown no tiene ninguno, y el marcador tampoco tiene equivalente, así que lo que obtienes es el texto en caché: una frase que dice «ver la sección 4.2 en la página 11», en un documento sin secciones numeradas así y sin página 11.

Esto es peor que una leyenda que falta porque no se ve visiblemente roto. Se lee como una referencia cruzada que funciona. Un lector la sigue, no encuentra nada, y concluye que el documento está mal en vez de que se convirtió.

El trabajo es mecánico y merece la pena hacerlo. Busca en el archivo convertido «ver», «arriba», «abajo», «página», «sección», «figura», «tabla» y «anexo», y trata cada resultado:

- Una referencia a un encabezado se convierte en un enlace al ancla de ese encabezado. Los renderizadores de Markdown generan anclas a partir del texto del encabezado —normalmente en minúsculas con guiones en vez de espacios, aunque la regla exacta varía según el renderizador, así que comprueba uno antes de escribir cincuenta. `[las reglas de retención](#retencion-de-datos)` sobrevive a una renumeración porque apunta a las palabras, no al número.
- Una referencia a un número de página tiene que desaparecer. No hay página. Reescríbela como una referencia a la sección, o borra la frase.
- Una referencia a una figura o tabla sigue lo que decidieras sobre las leyendas. Si quitaste los números, la referencia tiene que nombrar la cosa en su lugar: «el diagrama de despliegue» en vez de «Figura 4».
- Una referencia a una cláusula numerada en un contrato o una norma se queda como texto, porque la numeración es parte del contenido y no algo que calcule el renderizador.

**La tabla de contenidos no necesita ningún trabajo, solo borrarla.** Una tabla de contenidos de Word es un campo, y lo que se convierte es el texto en caché: una lista de encabezados con puntos guía y números de página, sentada como párrafos normales en la parte superior de tu documento. No se puede actualizar y se va a desviar dentro de una semana. Bórrala entera. Todo renderizador de documentación y la mayoría de generadores de sitios estáticos construyen una lista de contenidos a partir de los encabezados, y siempre va a ser correcta porque está derivada en vez de recordada.

**Los demás campos calculados merecen un repaso cada uno.** `DATE` se convierte en la fecha en que se actualizó por última vez, así que una carta convertida hoy puede afirmar ser de cuando alguien la abrió por última vez en Word. Los campos `STYLEREF`, comunes en cabeceras que se repiten, repiten el texto de un encabezado y lo congelan. La numeración automática de listas interactúa con todo esto. La regla general es simple: cualquier cosa que Word calculó es ahora un fósil del último cálculo, así que lee cada número del documento convertido una vez y pregúntate de dónde vino.

## Dónde falla «convertir y arreglarlo después»

El enfoque obvio es ejecutar la conversión, mirar la salida, y reparar lo que esté mal. Es el enfoque correcto para la mayoría de documentos, y falla de cuatro formas concretas que merece la pena conocer antes de comprometerte con él.

**No puedes reparar lo que no puedes ver que falta.** Este es el problema del cuadro de texto generalizado. Reparar funciona cuando la salida está visiblemente mal: una tabla con las columnas desplazadas, un encabezado en el nivel equivocado, una imagen rota. No funciona cuando la salida está incompleta en silencio, porque no hay pista. Nada en un archivo convertido dice «aquí solía haber una barra lateral». La única defensa es una comparación con el original, y una comparación solo es posible mientras todavía tienes el original abierto — lo que significa que la comprobación tiene que pasar en el momento de la conversión, no después, cuando alguien lo note.

**La información que necesitas para arreglarlo está en el archivo que sustituiste.** Qué elementos eran rojos. Qué decía el pie de página. Quién propuso borrar la tercera cláusula y por qué. Dónde estaba de verdad la Figura 4 antes de que se congelara la numeración. Todo eso está en la `.docx`, nada de eso está en el Markdown, y en el momento en que la `.docx` desaparece, la reparación deja de ser posible y se convierte en una reconstrucción. Conservar el original no es sentimentalismo; es la única copia de las respuestas.

**Arreglarlo después significa arreglarlo en cada copia.** Un documento convertido es fácil de mover. Alguien lo pega en un wiki, lo comitea en un repositorio, se lo envía a un cliente. Dos semanas después notas las referencias cruzadas congeladas. Ahora la reparación está en cuatro sitios, de los cuales no conoces tres. Convertir cien documentos multiplica esto por cien, que es el argumento real para una lista de comprobación en forma pasada una vez por documento, en vez de una corrección aplicada al descubrirlo.

**Algunas cosas cuestan más arreglarlas que rehacerlas.** Un documento con celdas combinadas, tablas anidadas y celdas que contienen listas no se puede reparar dentro de Markdown, porque la sintaxis de tablas de Markdown no tiene expansión ni contenido en bloque dentro de las celdas; solo puedes reformar los datos o conservarlos como una tabla HTML. [Las tablas son lo que se rompe más a menudo en cualquiera de las dos direcciones](/blog/markdown-tables-that-survive-conversion) y lo menos fácil de parchear después. Un documento construido enteramente a partir de cuadros de texto y formas —un folleto, un cartel, una página única diseñada— no es un documento con formato que perder. Es un diseño, y las palabras son accesorias a él. Convertirlo produce un fragmento de prosa que nadie quiere, y la respuesta honesta es que el archivo debería seguir siendo un PDF.

Lo que esto cuesta, sumado: el tiempo no está en la conversión, que tarda segundos, ni en las reparaciones obvias, que tardan minutos. Está en la comprobación, que tarda entre diez y veinte minutos para un documento de cierta entidad, y en conservar el original, que cuesta espacio en disco y una convención de nombres. Los equipos que se saltan la comprobación no se enteran de inmediato. Se enteran cuando alguien pregunta qué decía el párrafo que se borró.

## Qué decidir antes de convertir

1. **Establece si el documento tiene estructura o solo apariencia.** Abre el panel de estilos y mira. Si los encabezados son estilos de Título de verdad, la conversión va a salir limpia y tu comprobación va a ser rápida; si todo es Normal con negrita manual, la salida va a ser un muro de párrafos y ningún conversor te va a salvar, así que el camino más barato es aplicar estilos reales en Word primero y convertir una sola vez después.
2. **Lee la cabecera, el pie y cualquier marca de agua antes de tocar nada.** Lo que sea que digan —una clasificación, una versión, una fecha de revisión, la palabra BORRADOR— no existe en ningún otro sitio del archivo y va a desaparecer en un solo paso, y un documento republicado sin su propia clasificación es una filtración y no una conversión.
3. **Averigua si el archivo ha pasado por revisión.** Los cambios con seguimiento y los comentarios son las pérdidas que no puedes deshacer, así que si la revisión importa, exporta primero un PDF marcado y convierte el texto limpio después; si te saltas esto, estás eligiendo descartar el argumento y conservar solo el resultado.
4. **Inventaría el contenido flotante a mano.** Cuenta los cuadros de texto, las formas, SmartArt y los gráficos, anota el número, y comprueba ese mismo número contra la salida, porque son los únicos elementos que desaparecen sin dejar ningún rastro y la comprobación cuesta un minuto por elemento.
5. **Decide la regla de leyendas una vez, para todos tus documentos.** O las leyendas se convierten en líneas en cursiva sin números, o se convierten en bloques de `<figure>` y `<figcaption>`; decidirlo documento por documento garantiza un conjunto de archivos inconsistente y una segunda pasada más adelante.
6. **Barre las referencias cruzadas antes de publicar, no después.** Cada «ver página 11» y «como se muestra en la Figura 4» es ahora texto congelado que se lee como si funcionara, y en cuanto el archivo se ha copiado a un wiki y a un repositorio estás arreglando la misma frase en tres sitios.
7. **Conserva la `.docx`, y ponla en algún sitio que se pueda encontrar.** Cada pérdida de este artículo es de un solo sentido, así que el original es tu único registro de lo que el documento sabía antes, y el coste de conservarlo son unos cientos de kilobytes frente al coste de no conservarlo, que es una pregunta que directamente no puedes responder.

## Conclusión

La mayor parte de lo que una `.docx` pierde en el camino a Markdown nunca mereció conservarse: la tipografía, el tamaño de punto, los márgenes, los saltos de página, las columnas, los puntos guía y las dos docenas de estilos de párrafo que solo describían espaciado. Dejarlos caer es el propósito del ejercicio, porque un documento que describe su propia estructura se puede estilizar de forma consistente, buscar, diferenciar y revisar de una manera que un documento que describe su propia apariencia no puede. Las cuatro cosas que merecen trabajo son la capa de revisión, las leyendas, las referencias cruzadas y lo que sea que esté sentado en un cuadro de texto, y las cuatro son más fáciles de tratar antes de la conversión que después. [La ruta paso a paso y su lista de comprobación](/blog/convert-docx-to-markdown) cubre cómo ejecutar la conversión en sí, y [la comparativa de las herramientas que lo hacen](/blog/best-word-to-markdown-converters) cubre cuál usar; para un solo archivo que prefieras no subir, [la conversión de Word a Markdown de TransformPipe](/word-to-markdown) corre en el navegador, gratis, sin que la `.docx` salga nunca de tu máquina mientras estés desconectado. Sea cual sea el camino que tomes, archiva el original, porque las fuentes, los pies de página, los comentarios y la cita destacada que no notaste no van a volver.

## Preguntas frecuentes

### ¿Por qué mi documento de Word pierde todo su formato al convertirlo a Markdown?

Porque Markdown no tiene sintaxis para la mayor parte de él. No hay forma de expresar una tipografía, un tamaño de punto, un color, un margen o un salto de página en Markdown, así que un conversor pasa por encima de todo eso. Lo que sobrevive es estructura —encabezados, listas, enlaces, tablas, énfasis— y solo donde el documento la registró como estructura y no como apariencia.

### ¿Por qué mis encabezados salieron como párrafos normales?

Casi con toda seguridad porque nunca fueron encabezados. Si un encabezado se hizo seleccionando una línea y aplicando negrita y un tamaño mayor, el archivo registra propiedades de tramo, no un encabezado, y un conversor no tiene nada que ascender. Aplica estilos de Título reales en Word y convierte otra vez; la diferencia es inmediata.

### ¿Qué pasa con las leyendas cuando convierto una .docx a Markdown?

El estilo Leyenda no tiene equivalente en Markdown, así que la leyenda se convierte en un párrafo normal, y el campo `SEQ` que producía su número se congela en el último valor que calculó Word. Reescribe las leyendas como líneas en cursiva sin números, que no se quedan obsoletas, o usa `<figure>` y `<figcaption>` en HTML donde las figuras importen.

### ¿Pueden sobrevivir las referencias cruzadas a una conversión de Word a Markdown?

No como referencias cruzadas. Un campo `REF` o `PAGEREF` se convierte en el texto que Word calculó por última vez, así que «ver la sección 4.2 en la página 11» llega con aspecto correcto y apuntando a nada. Reescribe cada una como un enlace de Markdown al ancla del encabezado de destino, y borra cualquier cosa que se refiera a un número de página.

### ¿Adónde han ido mis cuadros de texto?

Probablemente a ningún sitio — el texto nunca se extrajo. Un cuadro de texto es un objeto de dibujo y no parte del flujo del documento, y muchos conversores no llegan a su interior, sin avisar de ningún error. Busca en el archivo convertido una frase que sepas que estaba en cada cuadro, y vuelve a escribir lo que falte mientras todavía tienes el original abierto.

### ¿Debería conservar la .docx original después de convertir?

Sí, siempre. Cada pérdida descrita aquí es de un solo sentido, y el original es el único registro que queda de lo que decía el pie de página, qué elementos estaban resaltados, quién propuso qué eliminación, y qué había en la barra lateral. Cuesta unos cientos de kilobytes y responde preguntas que el Markdown no puede.

### ¿Merece la pena convertir un documento diseñado como un folleto?

Normalmente no. Un folleto o un cartel es un diseño en el que se colocan las palabras, más que un documento por el que fluyen, y convertirlo produce fragmentos de prosa desconectados con el diseño desaparecido. Si el artefacto es el diseño, conserva un PDF y escribe la versión en Markdown desde cero cuando de verdad necesites una.
