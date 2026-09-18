---
title: "Markdown o HTML: en qué escribir, y cuándo cambiar"
description: "¿Markdown o HTML? Depende de qué le pasa después al documento: revisión, conversión, maquetación exacta, partes interactivas — y qué límites son en realidad ventajas"
date: 2026-08-15
tag: Workflow
keywords: markdown o html, diferencia entre markdown y html, cuándo usar markdown, html dentro de un markdown, limitaciones de markdown, html vs markdown para documentación, markdown para documentar
---

Nadie se pregunta «¿Markdown o HTML?» en abstracto. La pregunta llega pegada a un archivo concreto: un runbook que alguien tiene que mantener al día, una página que debe verse exactamente como la versión impresa, una plantilla que tiene que sobrevivir a Outlook. Los dos formatos no compiten por el mismo trabajo, y la discusión solo se resuelve preguntando qué le pasa al documento después de que termines de escribirlo.

### Resumen rápido

Escribe Markdown cuando el documento vaya a ser leído, revisado, editado por otras personas y probablemente convertido; escribe HTML cuando la maquetación, la interactividad o el canal de entrega sean el propio contenido. Las limitaciones de Markdown son la razón de que se pueda revisar bien: un archivo incapaz de expresar dos columnas tampoco puede esconder un cambio dentro de un diff. El HTML crudo metido en un Markdown es la salida de emergencia correcta para una figura, un iframe, un `<details>` — y una señal de alarma cuando aparece cada tres párrafos. Las excepciones donde conviene empezar en HTML y quedarse ahí son concretas y fáciles de reconocer: plantillas de correo, cualquier cosa que necesite una maquetación exacta, y cualquier cosa con piezas que se mueven.

Buena parte de la fricción que la gente le achaca al formato es en realidad un desajuste. Alguien escribe una política interna en HTML porque el destino final es una página web, y dieciocho meses después nadie puede revisar un cambio en ella, porque el diff son cuarenta líneas de marcado alterado alrededor de tres palabras distintas. Otra persona escribe una factura lista para imprimir en Markdown, descubre que no hay manera de forzar un salto de página y termina pegando `<div style="page-break-after: always">` en mitad de un párrafo.

Las dos direcciones cuestan lo mismo: el formato dejó de encajar con el futuro del documento. Markdown es un formato de escritura que se convierte en un formato de publicación. HTML es el formato de publicación. Elegir es decidir cuál de esos dos trabajos domina la vida del archivo.

El resto de este artículo es esa decisión, caso por caso, más las partes que la gente suele entender mal: lo que Markdown de verdad no puede hacer y por qué eso es una ventaja y no un hueco, cuándo el HTML crudo es una salida legítima, y qué cuesta cuando la respuesta de manual —«escribe Markdown y convierte»— resulta ser la equivocada.

## Lo que la elección decide en realidad

La diferencia visible es la sintaxis: `## Título` frente a `<h2>Título</h2>`. Es la diferencia menos interesante, y la única que casi todas las comparaciones tratan.

Lo que en realidad estás elegiendo es dónde vive la presentación. En HTML, estructura y presentación conviven en el mismo archivo, o al menos en el mismo repositorio, unidas por clases y una hoja de estilos. Cambia el título y quizá tengas que cambiar también el contenedor, la clase y la regla CSS que la selecciona. En Markdown, la presentación vive completamente fuera del documento. El archivo dice «esto es un encabezado de nivel dos» y se niega a decir nada sobre el aspecto que debe tener un encabezado de nivel dos. Esa única restricción es lo que hace que un archivo Markdown sea portable, comparable en un diff y seguro de entregar a alguien que no programa.

También estás elegiendo el tamaño de la superficie editable. Un documento HTML tiene miles de estados legales, y la mayoría de ellos están rotos de alguna forma sutil: un `<li>` sin cerrar, un `<div>` anidado dentro de un `<p>`, un atributo perdido que el navegador repara en silencio y un validador señala. Un documento Markdown tiene pocas construcciones y casi ninguna manera de romper el análisis. Lo peor que suele pasar es que una lista se renderiza como un párrafo, y eso se nota al instante.

Y estás eligiendo quién será el segundo autor. Esta es la parte que decide la mayoría de los casos reales. Si la respuesta es «un ingeniero de soporte a las dos de la madrugada», «una abogada», «un gestor de producto» o «alguien dentro de seis meses que nunca ha visto este repositorio», el formato necesita un suelo bajo. Si la respuesta es «el mismo desarrollador frontend que lo escribió», el suelo no importa y el techo sí.

Tres preguntas resuelven casi todos los casos:

- **¿Cuál es el artefacto final?** Una página web, un PDF, un correo, un panel de ayuda dentro de la aplicación, o un archivo en un repositorio que la gente lee como texto.
- **¿Quién lo edita después de ti?** Un desarrollador, un equipo mixto, o el público general.
- **¿Hay algo que tenga que ser exacto?** Saltos de página exactos, anchos de columna exactos, un renderizado exacto en un cliente concreto. La exactitud es el argumento más fuerte que existe a favor de HTML.

## Markdown contra HTML: la chuleta

Una sola tabla, leída fila por fila. La tercera columna es la opción que la gente olvida que tiene: escribir Markdown, convertirlo, y tratar el HTML como un producto de la compilación en lugar de como un archivo fuente.

| Pregunta | Markdown | HTML escrito a mano | Markdown convertido a HTML |
| --- | --- | --- | --- |
| Coste de escribir una página de prosa | El más bajo: la sintaxis no molesta | El más alto: etiquetas, anidación, envoltorios | El más bajo, más un paso de compilación |
| Qué muestra una revisión de código | Palabras cambiadas | Palabras cambiadas enterradas en marcado cambiado | Palabras cambiadas en la fuente; la salida se regenera |
| Quién puede editarlo con seguridad | Cualquiera que sepa escribir | Gente cómoda con el marcado | Cualquiera, del lado de Markdown |
| Maquetación exacta: columnas, saltos de página | No se puede expresar | Control total | Solo lo que ofrezca la plantilla |
| Partes interactivas: formularios, scripts, widgets | No se puede expresar | Nativo | Solo mediante HTML crudo |
| Renderizado fiable en clientes de correo | No | Sí, con marcado específico para correo | No, sin una plantilla específica para correo |
| Tablas | Rejillas simples, sin combinar celdas ni anidar | Cualquier tabla | Tan bueno como lo permita la variante |
| Atributos de accesibilidad — `lang`, `scope`, ARIA | Casi siempre ausentes | Completos | Vienen de la plantilla, no de la prosa |
| Riesgo de publicar un script por accidente | Bajo, hasta que se permite HTML crudo | Es tu propio script | Depende por completo de que se sanee |
| Legible en diez años sin herramientas | Sí, es prosa | Sí, pero se lee como marcado | La fuente se mantiene legible |
| Dónde vive el estilo | En ningún sitio del archivo | En el archivo o en su hoja de estilos | En el conversor o en la plantilla |
| Qué puedes enviarle a alguien | Un archivo `.md` que quizá no pueda abrir | Un archivo que se abre, si es autónomo | Un documento HTML completo |

El patrón de esa tabla es constante. Markdown gana todas las filas sobre personas y tiempo. HTML gana todas las filas sobre control y entrega. La tercera columna son las victorias de Markdown en personas y tiempo, sumadas a la entrega de HTML, al precio de un paso de conversión que ahora es tuyo.

## Los casos, decididos por el destino

Nada de lo que sigue es cuestión de gusto. Cada caso tiene un destino, y el destino elige el formato.

### Documentación que vive junto al código — Markdown

Si el documento está en un repositorio, junto a lo que describe, debería ser Markdown. Se revisa en la misma pull request que el cambio que documenta, que es el único mecanismo que mantiene la documentación al día de forma fiable. GitHub, GitLab y cualquier alojador de código lo renderizan sin necesidad de compilar nada. La gente nueva lo edita sin aprender ninguna herramienta.

La alternativa en HTML falla aquí de una manera muy concreta: la documentación deja de revisarse. Quien revisa ve un diff de sesenta líneas de marcado para una corrección de dos frases, lo aprueba sin leerlo, y a partir de ahí los documentos se van desviando. [Mantener la documentación dentro del repositorio](/blog/documentation-that-lives-in-the-repo) es más una decisión de flujo de trabajo que de formato, y Markdown es el formato que hace que ese flujo de trabajo sea lo bastante barato como para mantenerse.

**Para quién es:** equipos de ingeniería, cualquiera cuyo documento tenga un número de versión enganchado a un código base.

### README, registros de cambios, guías de contribución — Markdown

Estos se leen como texto tan a menudo como se leen como páginas. Un registro de cambios se busca con grep, se compara con diff, se pega en unas notas de versión y a veces se lee en un teléfono desde una terminal. HTML empeora cada uno de esos usos y no mejora ninguno.

**Para quién es:** cualquier repositorio, sin excepción que merezca discutirse.

### Notas, borradores y cualquier cosa que todavía estás pensando — Markdown

Escribir HTML mientras compones prosa reparte la atención entre la frase y su contenedor. La gente que más Markdown escribe no son desarrolladores publicando sitios web; son personas tomando notas, y el formato sobrevive porque se queda fuera de en medio. Existe un buen número de editores dedicados solo a esto, y los buenos hacen que la sintaxis sea casi invisible.

**Para quién es:** cualquiera cuyo primer borrador no sea el artefacto final.

### Un documento que hay que enviarle a una persona concreta — Markdown, convertido

Aquí la respuesta no es ninguno de los dos formatos por sí solo. Quieres escribir Markdown y entregar HTML, porque un archivo `.md` es una petición de que el destinatario instale o abra algo, y un archivo HTML completo es un documento que se abre con lo que esa persona ya tenga.

La propiedad importante de esa salida es que sea autónoma: doctype, `<head>`, estilos incluidos, ninguna petición a un CDN para una tipografía o una hoja de estilos. Un fragmento —`<h1>Título</h1><p>Texto</p>` sin nada alrededor— es HTML legal y se renderiza como texto negro sin estilo al ancho por defecto del navegador, lo cual se ve roto para cualquiera que lo reciba.

**Para quién es:** una propuesta, un informe, un documento de traspaso, una especificación que va a un cliente.

### Un sitio, un portal de documentación, un blog — Markdown, convertido por un generador

Varios documentos que se enlazan entre sí necesitan navegación, feeds, búsqueda y una plantilla compartida. Ese es el trabajo de un generador de sitios estáticos, y todos ellos aceptan Markdown como entrada por la misma razón: nadie quiere escribir a mano cien páginas de marcado. El HTML en ese esquema está generado, y ningún humano debería editarlo.

**Para quién es:** cualquiera que publique un conjunto de páginas y no una sola página.

### Plantillas de correo — HTML, y de un dialecto muy concreto

Este es el caso más claro en el que Markdown es el punto de partida equivocado, y merece la pena ser preciso sobre por qué. El HTML de correo no es el HTML que se escribe para navegadores. Los clientes difieren en qué CSS soportan, algunos eliminan por completo un bloque `<style>`, de modo que los estilos hay que escribirlos en línea en cada elemento, y la maquetación se sigue construyendo con tablas anidadas en lugar de flexbox o grid. Outlook en Windows lleva muchos años renderizando el correo HTML con el motor de Microsoft Word en vez de con un motor de navegador, que es la razón de que tanto marcado de correo parezca escrito en 2003 — porque tiene que serlo.

Ningún conversor de Markdown apunta a eso. Un conversor produce HTML que cumple estándares para un navegador, y ese HTML estándar es precisamente lo que un cliente de correo hostil destroza. Puedes escribir el cuerpo del texto en Markdown y pegar la salida convertida dentro de una plantilla, pero la plantilla en sí está construida a mano en HTML, o construida con un framework diseñado para correo como MJML, que compila su propia sintaxis de componentes al marcado de tablas anidadas que los clientes toleran. MJML es gratuito y de código abierto.

**Para quién es:** cualquiera que envíe correo que tenga que verse igual en más de tres clientes. Escribe la plantilla en HTML una vez; no intentes generarla.

### Cualquier cosa donde la maquetación sea el contenido — HTML con CSS

Facturas, certificados, contratos con cláusulas numeradas que no pueden partirse entre páginas, carteles, formularios, cualquier cosa con una rejilla de columnas fija o un pie que tenga que quedarse abajo en cada página impresa. Markdown no puede expresar nada de eso, y ninguna extensión razonable lo hará jamás, porque son instrucciones de presentación, y todo el diseño de Markdown consiste en excluir las instrucciones de presentación.

Las herramientas aquí son las reglas de paginado CSS —`@page` para los márgenes, `break-inside: avoid` para mantener entera una fila de tabla, `break-after` para forzar una página nueva— y operan sobre HTML. Si el destino es un artefacto impreso con reglas sobre cómo debe quedar en la página, empieza en HTML. Si es un documento que simplemente termina como PDF, Markdown convertido a HTML e impreso desde el navegador suele bastar; [lo que se gana y se pierde por ese camino](/blog/markdown-to-pdf) conviene saberlo antes de comprometerse.

**Para quién es:** documentos financieros, documentos legales, cualquier cosa que vaya a una imprenta.

### Cualquier cosa con piezas que se mueven — HTML

Formularios que se envían, pestañas, filtros, gráficos que responden a la interacción, una calculadora, un buscador, una tabla que se puede ordenar, un reproductor de vídeo con controles propios. No son documentos con decoración; son pequeñas aplicaciones. Markdown no tiene sintaxis para ellas y no debería adquirirla.

La pista es si el lector hace algo más que leer. Si hace clic en algo que cambia lo que ve, estás construyendo HTML, y la prosa dentro de él es solo una pequeña parte del archivo.

**Para quién es:** interfaces de aplicación, páginas de marketing con interacción, paneles de control.

### Contenido en una base de datos, editado por personal no técnico — normalmente ninguno de los dos, directamente

Vale la pena nombrarlo porque es habitual y se clasifica mal. Si marketing edita el texto a través de un CMS, el formato que se guarda es el que produzca ese CMS —a menudo HTML salido de un editor de texto enriquecido, a veces una estructura JSON por bloques. Elegir Markdown ahí significa pedirle a editores no técnicos que aprendan sintaxis y que previsualicen su trabajo en una segunda ventana. Algunos equipos lo hacen encantados; más de ellos dejan de usar el CMS en silencio.

**Para quién es:** equipos donde quien edita es el propio destinatario, y no el desarrollador.

## Lo que Markdown se niega a hacer, a propósito

La lista de abajo se lee como una lista de funciones que faltan. Está más cerca de ser una especificación. Cada elemento se dejó fuera para que el formato se mantuviera lo bastante pequeño como para leerse como texto plano, y cada omisión compra algo.

**Ningún estilo de ningún tipo.** No hay sintaxis para color, tipografía, tamaño, alineación ni espaciado. Lo que obtienes es una afirmación sobre estructura —encabezado, lista, énfasis— y la decisión sobre el aspecto se delega en lo que sea que renderice el archivo. Lo que compras: el mismo documento se renderiza correctamente en un alojador de código, en la vista previa de un editor, en una terminal, en un sitio estático y en un HTML convertido, porque ninguno de ellos tiene que ponerse de acuerdo con los demás sobre el aspecto.

**Ninguna maquetación.** Sin columnas, sin flotantes, sin saltos de página, sin control sobre dónde se sitúa nada. Un documento Markdown es una sola columna de bloques en el orden de la fuente. Lo que compras: se reajusta en un teléfono sin ningún esfuerzo, y se convierte a cualquier maquetación que quiera la plantilla en lugar de pelearse con una.

**Ningún atributo en los elementos.** El Markdown básico no da forma de añadir una clase, un id, un `lang`, un `title` ni un rol ARIA. Varias implementaciones lo añaden como extensión —listas de atributos en Python-Markdown, `markdown-it-attrs`, divs con marcadores en Pandoc— y en el momento en que usas una de ellas, tu archivo queda atado a esa implementación. Lo que compras: un archivo sin atributos no puede cargar presentación específica de una herramienta, así que se queda portable.

**Las tablas son rejillas y nada más.** GitHub Flavored Markdown te da una fila de cabecera, alineación por columna y celdas con contenido en línea. No hay `colspan`, ni `rowspan`, ni tabla anidada, ni celda con una lista o un salto de párrafo dentro, ni pie de tabla. Si tu tabla necesita algo de eso, necesitas HTML para esa tabla. Lo que compras: la tabla es legible en el archivo fuente, cosa que una tabla HTML no es. Las tablas son también lo que más se rompe al convertir, y [mantenerlas intactas durante la conversión](/blog/markdown-tables-that-survive-conversion) tiene sus propias reglas.

**Sin notas al pie, listas de definición ni matemáticas en la especificación base.** CommonMark no tiene ninguna de las tres. GFM añade tablas, listas de tareas, tachado y autoenlaces, y se detiene ahí. Notas al pie, listas de definición, matemáticas con `$…$` y bloques de aviso son extensiones, soportadas por algunos analizadores y renderizadas literalmente como texto por otros. Lo que compras: una especificación pequeña que muchas implementaciones aplican correctamente de verdad. También significa que «Markdown soporta X» es casi siempre una afirmación sobre un analizador concreto y no sobre Markdown en general; [las diferencias entre las variantes](/blog/commonmark-gfm-and-the-flavours) son de donde vienen la mayoría de las sorpresas al cambiar de herramienta.

**Sin contenido condicional, sin includes, sin variables.** No puedes decir «muestra este párrafo solo en la edición empresarial» ni «inserta aquí el bloque de licencia». Los generadores de sitios estáticos lo añaden con front matter y sintaxis de plantillas, que es exactamente el punto en el que tu Markdown deja de ser Markdown portable. Lo que compras: lo que lees es lo que hay.

**Sin semántica más allá de una docena de construcciones.** Sin `<figure>` con `<figcaption>`, sin `<abbr>`, sin `<time>`, sin `<aside>`, sin `<section>` con un encabezado que la etiquete. Para documentos que deben cumplir un estándar de accesibilidad, esto es un hueco real, y se rellena con la plantilla de conversión o con HTML crudo dentro del archivo.

El patrón: Markdown se niega a describir el aspecto, y se niega a ser extensible de maneras que atarían un documento a una sola herramienta. Ambas negativas explican por qué un archivo `.md` de 2011 todavía funciona en todas partes hoy. Un formato que hubiera aceptado cada petición razonable de nueva función sería hoy un HTML peor con un ecosistema más pequeño.

## HTML crudo dentro de Markdown: la salida de emergencia y la señal de alarma

Markdown siempre ha permitido HTML crudo en mitad de un documento. El Markdown original lo permitía por diseño, y CommonMark especifica cómo se comporta el HTML a nivel de bloque y en línea. Así que el «o esto o lo otro» estricto del título es un poco falso: puedes escribir Markdown y saltar a HTML para un elemento concreto.

Si eso está bien depende de con qué frecuencia lo hagas y a qué estés recurriendo.

### Dónde es la respuesta correcta

| Caso | Por qué HTML es lo correcto aquí |
| --- | --- |
| Un bloque colapsable — `<details><summary>` | No existe sintaxis Markdown para ello, degrada a texto visible, y es un solo par de etiquetas |
| Un vídeo embebido o un mapa en iframe | Markdown no tiene sintaxis de embebido; la alternativa es un plugin que ata el archivo a un renderizador concreto |
| Una figura con un pie de foto real | `<figure>` y `<figcaption>` llevan semántica que `![alt](src)` no puede dar |
| Una tabla con una celda combinada | La sintaxis de rejilla sencillamente no puede expresarlo; una tabla HTML es lo honesto |
| Un ancla para enlazar a mitad de documento | `<a id="section-3"></a>` cuando el renderizador no genera ids de encabezado |
| Un atributo `lang` en una cita | Necesario para que un lector de pantalla lo pronuncie bien, imposible de otro modo |
| Una única insignia o imagen en línea con un ancho fijo | Poco frecuente, contenido, y evidente para el siguiente lector |

El hilo común: el elemento es pequeño, autónomo, y no hay construcción Markdown para él. Aparece una o dos veces en un archivo, quien lo lee entiende qué hace, y quitarlo perdería significado en vez de decoración.

### Dónde es una señal de alarma

El HTML crudo te está diciendo algo cuando aparece así:

- **Envoltorios alrededor de prosa normal.** `<div class="callout">` con tres párrafos corrientes dentro. Estás reimplementando una plantilla dentro del contenido, y ahora cada documento que quiera un aviso destacado depende de una clase CSS que vive en otro sitio.
- **Estilos en línea.** `<span style="color: #c00">` en mitad de un párrafo. Has metido presentación en un archivo cuyo valor entero era excluir la presentación, y estará mal en cuanto la página tenga un tema oscuro.
- **`<br>` usado para controlar el espaciado.** Suele ser señal de que el problema real está en cómo se comportan los saltos de línea y las listas, no de que falte una función.
- **Secciones enteras en HTML.** Si dos tercios del archivo son marcado, es un archivo HTML con algo de Markdown dentro. Renómbralo y deja de fingir.
- **Tablas en HTML sin razón estructural.** Si la tabla es una rejilla sencilla y alguien la escribió en HTML por el estilo, ese estilo pertenece a la plantilla.
- **Cualquier cosa que se ejecute.** `<script>`, `onclick`, URLs `javascript:`. Un documento que se ejecuta no es un documento.

De ahí salen dos consecuencias prácticas.

La primera es la portabilidad. El HTML crudo pasa limpio a una salida HTML y a ninguna otra. Convierte ese archivo a PDF, a un documento de Word, a texto plano o a una vista de terminal, y el HTML o bien desaparece, o aparece como corchetes angulares literales, o rompe el conversor. Cuanto más HTML crudo tenga un archivo, más se ha comprometido en silencio con un único formato de salida.

La segunda es la seguridad, y no es teórica. Porque Markdown permite HTML crudo, un archivo `.md` puede llevar una etiqueta `<script>`, un manejador `onerror` o un enlace `javascript:`, y un conversor fiel se los entrega los tres al navegador tal cual. Para tus propias notas eso no importa. Para un README de un repositorio que no escribiste tú, un documento que te envió un cliente, o contenido enviado por usuarios, decide si tu página ataca a quien la lee — y por eso [sanear tiene que ocurrir en más de un sitio, con sus propias reglas](/blog/sanitising-markdown-safely) en lugar de suponer que un conversor lo hace por ti. Algunos analizadores escapan el HTML crudo por defecto y otros lo dejan pasar; tienes que saber cuál usas.

Una norma casera que funciona: el HTML crudo se permite para elementos que Markdown no puede expresar, y no se permite por motivos de aspecto. Si alguien tiene que añadir una clase CSS para que se vea bien, pertenece a la plantilla.

## Revisión, colaboradores y longevidad

Estos tres argumentos reciben menos atención que la sintaxis y decantan más casos reales.

### Comparar prosa con diff

El control de versiones compara líneas. Este es el hecho más determinante de escribir documentos dentro de un repositorio, y explica la mayor parte de la ventaja de Markdown.

En Markdown, cambiar una frase cambia las palabras de esa frase. Quien revisa ve la redacción anterior y la nueva una junto a la otra y puede juzgar si es una mejora. En HTML, la misma edición puede llegar envuelta en atributos cambiados, un bloque reindentado o un `</p>` movido de sitio, y el trabajo de quien revisa se vuelve arqueología. Peor aún, HTML tienta a la gente a reformatear, y un commit de reformateo que también cambia tres palabras es un commit que nadie revisa como debería.

Dos técnicas mejoran todavía más los diffs de Markdown, y ninguna está disponible en un archivo lleno de marcado:

- **Una frase por línea.** Ajustar el salto de línea a los límites de la frase en vez de a una columna. Una frase cambiada es entonces un diff de una sola línea, y mover una frase es un movimiento en lugar de la reescritura de un párrafo. Se ve raro en el archivo crudo durante más o menos un día.
- **Diffs a nivel de palabra.** `git diff --word-diff` muestra palabras cambiadas en vez de líneas cambiadas, lo que convierte un párrafo reajustado de una pared de rojo y verde en un puñado de sustituciones.

Ningún truco rescata a HTML, porque en HTML el ruido no es de espaciado, es de estructura.

### Quién más tiene que editar el archivo

Pregúntate honestamente quién toca el archivo después de ti, y ajusta el formato a la persona menos técnica de esa lista. Es una restricción de diseño, no una cortesía.

| Segundo autor | Qué se le puede pedir |
| --- | --- |
| El mismo desarrollador | Cualquier cosa. El formato es una preferencia |
| Otro desarrollador, más tarde | Markdown. No aprenderá tus nombres de clase para arreglar una errata |
| Un gestor de producto o un ingeniero de soporte | Markdown, con una vista previa disponible. Las ediciones en HTML se evitarán o se romperán |
| Un abogado o el equipo de finanzas | Ninguno de los dos: trabajarán en Word, y alguien lo convertirá |
| Un traductor | Markdown, y te lo agradecerá — el marcado alrededor del texto es donde viven los errores de traducción |
| El público, mediante pull request | Markdown, saneado. Las contribuciones en HTML son una carga de revisión y una superficie de seguridad |

El fallo de HTML no es que la gente lo edite mal. Es que no lo edita en absoluto. Te envían un mensaje pidiéndote que cambies una palabra, o no cambian nada y dejan que el documento se quede obsoleto. Todo conjunto de documentación que murió de obsolescencia murió en parte por un formato que hacía que las correcciones pequeñas dieran miedo.

### Longevidad

Un archivo Markdown es un archivo de texto que se lee correctamente sin ningún software. Ábrelo en el Bloc de notas dentro de quince años y los encabezados seguirán viéndose como encabezados. Es una propiedad rara, y viene de que el formato se niega a codificar el aspecto.

HTML también es duradero — los navegadores siguen renderizando marcado antiguo, y un archivo HTML autónomo con los estilos incluidos es de los mejores formatos de documento a largo plazo que existen. Los problemas vienen de lo que el HTML moderno suele acabar dependiendo, no del HTML en sí: una hoja de estilos en un CDN que deja de resolver, una tipografía de un servicio que cambió sus condiciones, un script de un paquete que ya no existe, nombres de clase que no significan nada sin el framework que los definió. Una página que pide cuatro cosas por red está a cuatro fallos futuros de ser ilegible.

Así que el ranking de longevidad es: primero la fuente Markdown, segundo el HTML autónomo, tercero, muy por detrás, el HTML con dependencias externas, y último cualquier cosa que necesite un sistema de compilación para poder verse siquiera. Ese es otro argumento a favor de mantener Markdown como fuente de verdad y tratar HTML como salida: lo duradero es el archivo que todavía puedes leer, y lo descartable es el archivo que puedes regenerar.

## Dónde falla «escribe Markdown y convierte», y qué cuesta

El consejo habitual de este artículo es el consejo correcto la mayor parte del tiempo. Vale la pena ser preciso sobre cuándo no lo es, porque el fallo casi nunca es dramático — es una acumulación lenta de parches hasta que alguien nota que la tubería cuesta más de lo que valen los documentos.

**Cuando la salida se termina editando a mano.** En el momento en que alguien abre el HTML generado y arregla algo dentro, el Markdown deja de ser la fuente de verdad y tienes dos archivos que se han separado. La siguiente conversión descarta en silencio su arreglo. Es la forma más común en que se pudre un flujo de trabajo de Markdown a HTML, y la única defensa es una norma de que los archivos generados nunca se editan, reforzada guardándolos en un sitio obviamente descartable.

**Cuando el diseño necesita control por elemento.** Si el encargo incluye «esta cita destacada ocupa el 60 % del ancho, alineada a la derecha, con el color de marca del cliente detrás», Markdown te va a dar guerra en cada elemento. Puedes expresarlo con HTML crudo y estilos en línea, y en ese punto tienes un archivo HTML con pasos de más. Coste: horas de parches, y un archivo que nadie puede mantener.

**Cuando la exactitud es contractual.** Cualquier cosa con una maquetación especificada — un informe regulatorio, un formato de factura que el sistema de un cliente analiza automáticamente, un certificado con un bloque de firma que tiene que quedar en una posición fija. Coste: hay que controlar toda la ruta de renderizado, y controlar una ruta de renderizado desde Markdown es controlar una plantilla, con un paso intermedio.

**Cuando el canal tiene su propio dialecto.** El correo, ya visto arriba. También el texto enriquecido dentro de una aplicación guardado como HTML, y cualquier cosa que consuma un sistema que espera un marcado específico. Coste: la salida limpia y conforme a estándares de un conversor es exactamente la salida equivocada.

**Cuando el documento es interactivo.** Ninguna cantidad de conversión produce comportamiento. Coste: ninguno, si te das cuenta a tiempo. Considerable, si escribes cuarenta páginas de Markdown antes de descubrir que la sección 9 necesita un formulario que funcione.

**Cuando la variante se desvía.** Tu Markdown se renderiza bien en tu alojador de código y mal en tu compilación, porque los dos usan analizadores distintos. Notas al pie, listas de tareas, sangría de listas anidadas y autoenlaces son los sospechosos habituales. Coste: una clase de error que solo aparece en la salida publicada, que es el peor lugar para encontrarlo.

**Cuando el archivo es genuinamente enorme.** Un solo documento de muchos megabytes se lleva mal con una conversión en el navegador, y a partir de cierto punto se lleva mal con ser un único documento. Coste: dividirlo, o mover la conversión a un paso de compilación donde la memoria no sea un problema.

**Cuando la propia tubería se convierte en el trabajo.** Un conversor, una plantilla y un script están bien. Cuatro conversores, una cadena de plugins, un filtro Lua a medida y un contenedor para ejecutarlo son un proyecto, y el proyecto necesita un responsable. Coste: quien lo lleva no puede irse sin un traspaso, y las tuberías de documentación tienden a terminar en manos de la única persona que entendía la plantilla.

Nada de esto es un argumento contra Markdown para prosa. Es un argumento para fijarse, antes de empezar, en cuál de los dos trabajos —escribir o presentar— domina el archivo.

## Cómo decidir

Cinco criterios, cada uno con su consecuencia.

1. **Nombra el artefacto final antes de la primera línea.** Si es una página web, un PDF o un archivo en un repositorio, escribe Markdown; si es un correo, un documento impreso con maquetación fija o una interfaz, escribe HTML. Equivocarse aquí cuesta una reescritura, y la reescritura siempre llega más tarde de lo que debería.
2. **Ajusta el formato a la persona menos técnica que vaya a editarlo.** Si un ingeniero de soporte o un traductor tiene que corregir una frase con poco margen, HTML significa que te lo pedirán a ti en su lugar, y el documento se desviará entre una petición y la siguiente.
3. **Asume que cada cambio lo revisará alguien con prisa.** Markdown hace que una frase cambiada se vea como una frase cambiada; HTML hace que se vea como un archivo cambiado, y quien revisa aprueba lo que no puede leer.
4. **Cuenta las partes interactivas.** Un bloque `<details>` es una salida de emergencia; un formulario, una barra de pestañas o un gráfico significan que el documento es una aplicación, y Markdown es el formato de origen equivocado para eso.
5. **Decide quién es dueño del estilo, y escríbelo.** Si es la plantilla, mantén la presentación completamente fuera del contenido; si eres el autor, has elegido HTML aunque la extensión del archivo diga otra cosa — y la próxima persona que edite ese archivo hereda tu CSS junto con tu prosa.

## Conclusión

Escribe Markdown por defecto, convierte, y guarda el HTML como un producto de compilación que nunca editas — ese esquema te da prosa revisable, editores que no le tienen miedo al archivo, y una salida que se abre en cualquier parte, que es casi todo lo que la gente quiere de un flujo de trabajo de documentos. Cambia a HTML de forma deliberada y completa cuando el destino lo exija: plantillas de correo que tienen que sobrevivir al propio motor de renderizado de un cliente de correo, documentos cuya maquetación forma parte de la especificación, y cualquier cosa con la que el lector interactúe en vez de leerla. Cuando el paso que necesitas es el habitual —Markdown que entra, una página autónoma y completa que sale, nada subido a ningún sitio— [TransformPipe lo hace en el navegador](/), gratis y sin instalar nada; cuando es una de las excepciones, gasta el tiempo en HTML y deja de disculparte por ello.

## Preguntas frecuentes

### ¿Es Markdown mejor que HTML?

Ninguno de los dos es mejor; responden a preguntas distintas. Markdown es un formato de escritura pensado para gente que edita texto y revisa cambios, y HTML es un formato de entrega pensado para controlar lo que renderiza un navegador o un cliente. El esquema habitual —escribir Markdown, convertir a HTML— usa cada uno para lo que hace bien.

### ¿Puedo usar HTML dentro de un archivo Markdown?

Sí. El Markdown original permitía HTML crudo por diseño, y CommonMark especifica cómo se comporta, así que un bloque `<details>`, un iframe o una tabla con celdas combinadas pueden convivir en mitad de un documento Markdown. Úsalo para elementos que Markdown no puede expresar, no por aspecto, y ten en cuenta que el HTML crudo solo sobrevive al convertir a HTML — otros formatos de salida lo eliminarán o lo dejarán roto.

### ¿Es seguro Markdown si puede contener HTML?

Solo si algo lo sanea. Porque el HTML crudo está permitido, un archivo `.md` puede llevar `<script>`, `onerror=` o una URL `javascript:`, y un renderizador fiel se los pasará todos al navegador. Algunos analizadores escapan el HTML crudo por defecto y otros lo dejan pasar, así que comprueba cuál es el comportamiento del tuyo antes de convertir un archivo que no escribiste tú.

### ¿Debería escribir mi web en Markdown o en HTML?

Escribe el contenido en Markdown y la plantilla en HTML. Todo generador de sitios estáticos funciona así por una razón: escribir a mano el marcado de cien páginas es incómodo e inconsistente, mientras que escribir a mano una plantilla es una cantidad de trabajo normal. Las páginas que son sobre todo interfaz y poca prosa —una tabla de precios con un interruptor, un flujo de registro— son la excepción, y les corresponde HTML.

### ¿Por qué no puedo controlar la maquetación en Markdown?

Porque la maquetación es presentación, y Markdown se diseñó para excluir la presentación, de modo que un solo archivo se renderizara con sentido en una terminal, un editor, un alojador de código y una página convertida. No hay sintaxis para columnas, saltos de página ni anchos, y añadirla mediante HTML en línea ata el documento a un único formato de salida. Si la maquetación forma parte del requisito, esa es la señal de que hay que escribir HTML.

### ¿Se pierde algo al convertir Markdown a HTML?

La estructura sobrevive; lo que la variante no soporte, no. Tablas, listas de tareas, tachado y autoenlaces necesitan GitHub Flavored Markdown en lugar de CommonMark puro, y notas al pie, listas de definición y matemáticas son extensiones que muchos analizadores ignoran. Convierte un archivo representativo y revisa las tablas y las listas antes de comprometerte con una herramienta.

### ¿Qué formato debería usar la documentación si el equipo no es técnico?

Markdown, pero solo con una vista previa delante — un editor de Markdown, un wiki que renderiza mientras escribes, o la vista previa de una pull request. Pedirle a autores no técnicos que escriban una sintaxis que no pueden ver renderizada es la razón por la que algunos equipos concluyen que Markdown no funciona para ellos, cuando el problema real era la vista previa ausente — y si la respuesta es que el equipo preferiría quedarse en Word directamente, [cuál de los dos formatos debería ser la fuente](/blog/markdown-vs-docx-for-documentation) es la decisión que hay que zanjar antes de tocar ninguna herramienta.
