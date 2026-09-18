---
title: "Markdown contra Word para documentación: quién debe ser la fuente"
description: Markdown o Word para documentación, según lo que el documento tiene que hacer - revisión, quién edita, historial, maquetación, búsqueda, publicación y firma.
date: 2026-09-05
tag: Workflow
keywords: markdown vs word documentacion, markdown vs docx, formato de documentacion, docs as code, word o markdown para documentacion, docx vs markdown, formato de documentacion tecnica
---

Pregúntale a una organización dónde vive su documentación y suelen darte tres respuestas a la vez: una carpeta de archivos `.docx` en una unidad compartida, un wiki que nadie ha tocado desde la última reorganización, y un directorio `docs/` en un repositorio que solo leen los ingenieros. Las tres están parcialmente vigentes. Ninguna es la fuente de verdad, y la razón nunca es que alguien elegiera el formato equivocado a propósito. Es que nadie decidió nunca qué formato tenía permiso para ser el original.

La discusión entonces se lleva como cuestión de gusto. Los ingenieros dicen que Word es un desastre; el resto de la empresa dice que Markdown es un rito de iniciación. Los dos bandos describen una experiencia real y ninguno describe la decisión de verdad, que no es en absoluto una cuestión de preferencia. Es sobre qué tiene que hacer un documento concreto — revisarse, cambiarse por doce personas, buscarse, imprimirse, firmarse, publicarse, auditarse en tres años cuando alguien pregunte por qué una cláusula dice treinta días.

Este artículo decide eso trabajo por trabajo. Es una pregunta distinta de [Markdown contra HTML escrito a mano](/blog/markdown-vs-html), que trata sobre formato de escritura contra formato de publicación; aquí los dos candidatos son formatos de escritura, y la pregunta es cuál debería ser el original del que se genera todo lo demás.

### Resumen rápido

Decide por el trabajo del documento, no por el gusto del equipo. Si el documento cambia con frecuencia, lo revisa más que un puñado de personas, hay que buscarlo y editarlo en bloque, y termina en una página web, Markdown en control de versiones gana en casi todos los aspectos. Si hay que imprimirlo con una plantilla, firmarlo, entregarlo a alguien que especifica una maquetación, o leerlo línea por línea una persona cuyo trabajo entero son contratos, Word gana y ninguna herramienta cambia eso. La mayoría de organizaciones necesitan los dos — y el único arreglo que sobrevive es un formato como fuente y el otro como exportación generada, nunca los dos como fuentes.

## Qué es un .docx, qué es un archivo .md, y qué produce eso después

Un `.docx` es un archivo zip. Renómbralo y descomprímelo y obtienes un directorio de partes XML: una con el texto del documento, otra con los estilos con nombre, otra con las definiciones de lista que hacen que las listas numeradas se renumeren solas, y una parte de relaciones que asigna identificadores internos a imágenes, hiperenlaces, cabeceras y pies. El formato está documentado y estandarizado — es Office Open XML, publicado como ECMA-376, y las cuatro partes de la especificación se pueden descargar gratis (comprobado en ecma-international.org, el 9 de septiembre de 2026)— lo cual importa para la longevidad, pero nada de eso está pensado para que lo lea una persona. Abre la parte principal del archivo en un editor de texto y obtienes varios miles de caracteres de marca antes de la primera frase de tu documento. [La anatomía de ese archivo y qué decide cada parte](/blog/convert-docx-to-markdown) merece leerse si alguna vez tienes que convertir uno.

Un archivo `.md` es texto. Son las frases que escribiste, en UTF-8, con un pequeño conjunto de convenciones encima: almohadillas para títulos, asteriscos para énfasis, guiones para elementos de lista, barras para tablas, comillas invertidas para código. No hay contenedor, ninguna parte de estilo separada, ninguna tabla de relaciones. La estructura está codificada como caracteres al principio de las líneas, lo que significa que la estructura es visible para cualquier cosa que pueda leer una línea de texto.

Esa única diferencia produce casi todo lo demás en esta página:

- **Lo que puede mostrar un diff.** Un cambio en un archivo de texto es un cambio en una línea. Un cambio en un archivo zip es un cambio en un blob binario, así que las herramientas que comparan versiones no tienen nada con qué trabajar excepto el archivo entero.
- **Lo que puede tocar la automatización.** Cualquier cosa puede leer un archivo de texto — grep, un linter, un script de build, un corrector ortográfico, un editor en un teléfono. Leer un `.docx` necesita una biblioteca que entienda el formato, y volver a escribir uno de forma segura necesita más que eso.
- **Lo que el formato puede expresar.** Word puede guardar un comentario anclado a un rango de caracteres, un esquema de numeración que se renumera al insertar un elemento, una cabecera que se repite en cada página y un índice que se actualiza solo. Markdown no guarda nada de eso, porque no guarda nada más que el texto.
- **Si los bytes se describen a sí mismos.** Un archivo Markdown leído sin ningún software sigue mostrando los títulos como títulos. Un `.docx` leído sin software muestra XML.
- **En quién hay que confiar para tocarlo.** Un archivo de texto lo puede editar con seguridad alguien sin formación, porque hay muy pocas formas de romper el análisis. Un documento de Word se puede romper de formas invisibles hasta que se imprime.

El archivo no es un fallo de diseño. Es el precio de lo que puede hacer, y esas cosas son reales. El error es asumir que el precio merece la pena para todos los documentos, y el error contrario es asumir que nunca merece la pena.

## Markdown contra Word para documentación: la chuleta

Una tabla, léela por filas. La última columna es el veredicto honesto y no un ganador, porque varias de estas filas de verdad van en el sentido contrario.

| Dimensión | Markdown en control de versiones | Word (.docx) | Quién gana, y cuándo |
| --- | --- | --- | --- |
| Revisar un cambio | Diff de líneas: las palabras cambiadas aparecen como cambiadas | Cambios controlados: cada edición atribuida, aceptada o rechazada por separado | Markdown para muchos cambios pequeños; Word cuando cada frase necesita una decisión |
| Comentar una frase | Comentario de revisión en una línea, en una pull request | Comentario anclado a un rango de caracteres, con hilo de respuestas | Word, claramente, para revisores no técnicos |
| Dos personas editando a la vez | Rama y fusión, conflictos marcados por línea | Coautoría en la nube, o copias por correo fusionadas a mano | Markdown para un conjunto de archivos; Word en la nube para un archivo, una hora |
| Quién puede editar sin formación | Cualquiera que sepa escribir, una vez superado el flujo de trabajo | Cualquiera que haya usado un ordenador | Word, y fingir lo contrario es como los documentos se quedan desactualizados |
| Historial | Cada cambio, con un mensaje, un autor y una razón | Instantáneas por fecha y autor, en la plataforma que guarda el archivo | Markdown: la unidad es un cambio, no una copia |
| Por qué una frase dice lo que dice | Culpa la línea, lee el commit, lee la pull request | Lee la lista de versiones y adivina | Markdown, y no es que vaya reñido |
| Búsqueda en todo el conjunto | Búsqueda exacta y con expresiones regulares, en un segundo, desde cualquier sitio | Búsqueda de la plataforma que encuentra documentos, no líneas | Markdown |
| Cambiar una frase en 200 archivos | Un comando, un diff, una revisión | Abrir 200 archivos, o escribir un script contra el XML | Markdown |
| Maquetación de página, cabeceras, pies, saltos de página | No es expresable | Nativo, y la razón por la que existe el formato | Word |
| Plantilla de casa y estilos con nombre | Vive en el conversor o en el tema del sitio | Vive en el documento, aplicado por quien escribe | Word para algo puntual; Markdown para consistencia en cientos |
| Numeración automática y referencias cruzadas | No está en el formato; algunos generadores añaden anclas | Campos que se renumeran y vuelven a apuntar solos | Word |
| Impresión y firma | Necesita un paso de conversión a PDF | El documento ya está paginado | Word |
| Publicar en una página web | Una conversión, o un generador | Marca de guardar-como-página-web, o una conversión pasando por Markdown de todas formas | Markdown |
| Muestras de código | Bloques delimitados, con idioma etiquetado, nunca autocorregidos | El autocorrector cambia tus comillas y guiones | Markdown, y esto es una cuestión de corrección |
| Accesibilidad | Semántico por construcción, auditado una vez en el tema | Atributos ricos disponibles, auditados por documento | Empate: Markdown es más barato, Word es más capaz |
| Longevidad de los bytes | Texto: legible sin software | Estandarizado y ampliamente legible, pero necesita una aplicación | Markdown |
| Dependencia del proveedor | Ninguna que merezca nombrarse | No es el formato; es la plantilla, las macros y las costumbres | Markdown |
| Imágenes | Referenciadas como archivos separados, que pueden desaparecer | Van dentro del archivo, que no puede desaparecer | Word para un único archivo que viaja |
| Coste de herramientas | Un servidor, una costumbre de revisión, un paso de build que alguien mantiene | Ya está instalado en cada escritorio | Word para un equipo pequeño sin ingenieros |

El patrón es lo bastante consistente como para decirlo sin rodeos: Markdown gana cada fila sobre cambio, escala y tiempo, y Word gana cada fila sobre páginas, comentarios de revisión y la persona menos técnica del edificio. Cualquier decisión que ignore una de las dos mitades la va a revertir después quien la herede.

## Revisión, historial, y quién puede editarlo

Estos tres argumentos resuelven más casos reales que cualquier cosa sobre sintaxis, y el primero de ellos lo discuten habitualmente ambos bandos de forma injusta.

### Un diff y los cambios controlados no son la misma herramienta

Un diff te muestra la diferencia entre dos estados. Los cambios controlados te muestran los actos de cambiar: esta persona tachó esa cláusula, esta persona insertó esas cinco palabras, y cada uno se puede aceptar o rechazar por su cuenta. Son productos distintos, y las discusiones que la gente tiene sobre ellos suelen ser dos personas describiendo trabajos distintos.

Para un abogado leyendo un contrato, los cambios controlados con comentarios al margen son el mejor instrumento, y no es que vaya reñido. La unidad de trabajo es la propuesta individual —quién sugirió esta redacción, qué dijo al margen sobre ella, la acepto o la contrapropongo— y Word modela exactamente eso. Una pull request modela otra cosa: un conjunto coherente de cambios, propuestos juntos, aceptados o rechazados juntos. Puedes aprobar un diff línea por línea en la mayoría de herramientas de revisión, pero no puedes entregarle a alguien un documento con catorce propuestas independientes y dejar que se lleve nueve.

Para doce personas editando un manual del empleado, los cambios controlados son el peor instrumento, y eso tampoco va reñido. Doce revisores producen doce copias. Alguien las fusiona a mano, lo que significa que alguien lee el mismo párrafo doce veces y decide cuál de cuatro redacciones conservar, sin ningún registro después de qué se rechazó o por qué. El archivo llamado `manual_final_v3_JS_comentarios_actualizado.docx` no es una broma sobre nombrar archivos; es el síntoma visible de un formato sin operación de fusión. La coautoría en la nube elimina las copias, que es una mejora genuina, pero elimina el registro junto con ellas: todos editan el documento en vivo, y el historial se convierte en una lista de momentos en vez de una lista de decisiones.

| Modelo de revisión | Unidad de revisión | Atribución | Concurrencia | Registro posterior |
| --- | --- | --- | --- | --- |
| Cambios controlados en archivos por correo | Una inserción o eliminación | Por cambio, por autor | Una persona a la vez por copia | Lo que recordara quien fusionó |
| Cambios controlados en un archivo con coautoría en la nube | Una inserción o eliminación | Por cambio, mientras está pendiente | Muchas personas a la vez | Instantáneas por tiempo del documento |
| Pull request sobre Markdown | Un conjunto de cambios relacionados | Por commit y por comentario | Muchas personas, en ramas | Permanente: diff, discusión, decisión |
| Solo comentarios, sin ediciones | Una sugerencia en prosa | Por comentario | Muchas personas a la vez | El hilo de comentarios, hasta que se resuelve |

La lectura práctica: los cambios controlados son mejores para negociar un documento y peores para mantenerlo. La documentación se mantiene, que es por lo que el formato que es malo negociando sigue ganando para los documentos, y por lo que los contratos siguen viviendo en Word sin importar lo que sienta el equipo de ingeniería.

### El blame, y por qué una frase dice lo que dice

Este es el argumento que convierte a los escépticos, y nunca aparece en una comparativa de funciones porque Word no tiene nada que poner en esa columna.

Un conjunto de documentación que lleva viva unos años contiene frases que nadie puede explicar. «Los tokens de acceso expiran a los treinta días.» ¿Por qué treinta? ¿Fue una decisión, un compromiso con el equipo de seguridad, o una errata sobre la que alguien ya ha construido una biblioteca cliente? En un repositorio, le preguntas al archivo: haz blame de la línea, obtén el commit, lee el mensaje del commit, sigue hasta la pull request, lee la discusión que ocurrió ahí y el issue que la provocó. Esa cadena tarda unos noventa segundos y produce la razón o demuestra que nunca la hubo, lo cual también es útil.

En un patrimonio de Word la misma pregunta es irrespondible en la práctica. El historial de versiones de la plataforma de almacenamiento te da instantáneas por autor y fecha —historial real, y mejor que nada— pero la unidad es el documento, no la frase. Puedes encontrar que Priya guardó una versión nueva un martes de marzo. No puedes encontrar cuál de los cuarenta cambios de ese guardado fueron los treinta días, ni a qué estaba respondiendo. Así que la frase se queda, porque nadie puede justificar eliminar algo que no puede explicar, y la documentación acumula afirmaciones que ya no coinciden con el sistema.

La consecuencia merece decirse con un coste adjunto: en Word, la procedencia de una frase tiene que vivir en la memoria de alguien o en un registro de cambios separado que mantiene una persona, y los dos se van de la organización cuando esa persona se va.

### Quién puede editarlo, y la frase que termina la conversación

«Simplemente abre una pull request contra los docs.» Dicho a una compañera de ventas que ha notado que la página de precios describe un plan retirado en primavera, esa frase termina la conversación. No va a abrir una pull request. Va a mandar un mensaje, o no va a hacer nada, y la página seguirá mal en seis meses.

Esto es una limitación real, no un problema de formación, y tratarlo como un problema de formación es la forma más común en que falla un programa de docs as code. El flujo de trabajo alrededor de Markdown —un servidor, un fork o una rama, un mensaje de commit, una revisión, una fusión, un despliegue— son cinco conceptos que no tienen nada que ver con escribir una frase. El suelo de Word es genuinamente más bajo: abre el archivo, cambia las palabras, guarda. Cualquiera que haya usado un ordenador supera esa barra.

Hay tres respuestas honestas, y la equivocada es insistir en que la gente aprenda.

- **Usa el editor web del propio alojador de código.** Editar un archivo en el navegador, con vista previa, y dejar que el alojador cree la rama y la pull request por detrás convierte cinco conceptos en dos: cambia las palabras, escribe una línea de por qué. Esto funciona, es lo que usan de verdad la mayoría de arreglos exitosos, y todavía requiere una cuenta y un recorrido guiado.
- **Pon una superficie de edición encima.** Un sistema de contenido que escribe Markdown de vuelta al repositorio les da a los editores no técnicos una experiencia de edición normal y mantiene la fuente en control de versiones. Son más piezas móviles de las que ser dueño, y alguien tiene que serlo.
- **Acepta la edición como un mensaje, y cuéntala.** Alguien técnico hace el cambio. Está bien para correcciones ocasionales y es terrible como arreglo permanente, porque la cola se vuelve un cuello de botella y el cuello de botella se vuelve estancamiento.

Cualquiera que elijas, la decisión pertenece a la persona menos técnica que tenga que cambiar una frase con poco margen — el mismo principio que hace de un repositorio el sitio correcto para los docs que mantienen los ingenieros también hace de él el sitio equivocado para los docs que solo toca el equipo de finanzas. [Lo que de verdad pertenece al repositorio, y cómo se organiza el directorio](/blog/documentation-that-lives-in-the-repo) es la versión más larga de ese argumento.

## Lo que Word puede expresar y Markdown no

Markdown tiene alrededor de una docena de construcciones. Word tiene un modelo de página. La brecha entre ellos no es una cuestión de funciones que falten y que un conversor pueda añadir después; es la diferencia entre un formato que describe estructura y un formato que describe un artefacto impreso.

Lo que un `.docx` lleva y no tiene ningún equivalente en Markdown en absoluto:

- Una plantilla con estilos con nombre, de forma que «Heading 2» signifique una tipografía, tamaño, espaciado y color concretos en cada documento de la organización.
- Cabeceras y pies, números de página, una portada, saltos de sección, márgenes y orientación cambiados a mitad de camino, marcas de agua.
- Un campo de índice que se actualiza solo, pies de foto que se numeran solos, y referencias cruzadas que vuelven a apuntar cuando mueves una sección.
- Saltos de página y mantener-con-el-siguiente, es decir, control sobre qué cae al principio de una página.
- Notas al pie renderizadas al pie de la página a la que pertenecen, en vez de reunidas al final del documento.
- Cuadros de texto, formas flotantes, tablas con celdas combinadas, y cualquier cosa posicionada en relación con la página en vez de con el flujo del texto.
- La propia capa de revisión: inserciones y eliminaciones pendientes, y hilos de comentarios anclados a rangos de caracteres.

El inventario completo —elemento por elemento, con un veredicto sobre qué pérdidas de verdad importan y cuáles son costumbres que vale la pena abandonar— está en [lo que no hay que conservar de un .docx](/blog/what-not-to-keep-from-a-docx), y no tiene sentido repetirlo aquí. Lo que importa para esta decisión es que ninguna de esas ausencias es un hueco salvo que el trabajo del documento las necesite. Un manual de procedimiento no necesita una portada. Un manual del empleado que se imprime y se entrega a los nuevos sí. Una propuesta con un bloque de firma que tiene que sentarse sobre un pie fijo necesita el modelo de página, de forma permanente y sin discusión.

La lista contraria es más corta y suele quedarse fuera de estas comparativas por completo, así que aquí está. Markdown expresa varias cosas que un documento de Word maneja mal:

- **Código, con seguridad.** Un bloque delimitado etiquetado con un idioma sobrevive a copiar y pegar, y no se autocorrige. Word sustituye mientras escribes, y una de las opciones documentadas se llama `"Straight quotes" with "smart quotes"` (comprobado en support.microsoft.com, el 9 de septiembre de 2026); el mismo mecanismo convierte los guiones escritos en rayas. Cualquiera de las dos sustituciones dentro de una muestra de comando significa que el lector que la copia obtiene un error. Esto es un defecto de corrección, no una preferencia de formato.
- **Enlaces que una máquina puede comprobar.** Los enlaces de texto se pueden validar en un build, así que un conjunto de documentación puede fallar su propia comprobación cuando un enlace muere. Comprobar las relaciones de hiperenlace dentro de doscientos archivos es un proyecto.
- **Diagramas como texto.** Un diagrama escrito como texto delimitado vive en el diff, se revisa como prosa, y no exige que nadie encuentre el archivo de dibujo original. Un grupo de formas pegado en Word es una imagen sin fuente.
- **Frontmatter.** Una cabecera legible por máquina que lleva un propietario, una fecha de revisión y un estado, que un build puede leer y usar. Word tiene propiedades de documento, y nadie las rellena.

## A escala: búsqueda, scripting, publicación, longevidad, accesibilidad

Todo lo de arriba trata de un solo documento. Las dimensiones de abajo solo aparecen cuando hay doscientos, que es exactamente cuando una decisión de formato se vuelve cara de revertir.

### Búsqueda, y qué significa «buscar» en cada caso

Buscar texto en un directorio de archivos Markdown es exacto, rápido y accesible para cualquier cosa: una expresión regular, una frase sensible a mayúsculas, una búsqueda restringida a títulos, una búsqueda que lista archivo y número de línea. Corre en un portátil sin índice ni servicio, y corre en un build, lo que significa que un conjunto de documentación puede responder preguntas sobre sí mismo. Busca cada página que menciona un endpoint obsoleto, y obtienes una lista de líneas sobre las que puedes actuar.

Buscar en un patrimonio de Word es buscar en un índice mantenido por lo que sea que guarde los archivos. En su mejor momento encuentra documentos, no líneas, y los ordena por relevancia en vez de listarlos exhaustivamente — que es el diseño correcto para encontrar un documento y el equivocado para auditar una afirmación. No encuentra nada dentro de una captura de pantalla, y no te va a decir que la frase aparece en un pie de página de la página once de seis archivos.

### Programar un cambio en doscientos archivos

Un producto se renombra. Cambia una dirección de soporte. Una URL se muda de un dominio a otro. En Markdown esto es un comando, un diff que lees antes de subirlo, y una revisión de alguien que comprueba los casos límite —los que están dentro de muestras de código, los que están dentro del texto de un enlace, la forma posesiva. El cambio entero es una unidad revisable y o pasó en todas partes o se ve en el diff que no pasó.

En un patrimonio de Word el mismo cambio tiene tres opciones: abrir cada archivo, programar contra las partes XML, o escribir una macro. Las tres funcionan. Lo que pasa en realidad es que alguien hace los veinte archivos importantes, tiene intención de terminar, y no termina — y la mitad que no se hizo es invisible, porque no hay diff que mirar ni comprobación que falle. Seis meses después el nombre viejo del producto sigue en cuatro propuestas que se envían a clientes. El coste de no poder programar un cambio no es la mano de obra; es que los cambios parciales no dejan rastro.

### Publicar en una página web

Desde Markdown, publicar es el caso ordinario: una conversión a una página HTML completa, o un generador si hay un conjunto de páginas que se enlazan entre sí. La salida es marca semántica que hereda su estilo de una plantilla, lo que significa que el conjunto entero se ve consistente porque el estilo nunca estuvo en los documentos.

Desde Word, publicar es un desvío. La propia salida de guardar-como-página-web de la aplicación lleva una gran cantidad de marca que existe para reproducir el renderizado de Word en vez de para describir el documento, y el resultado es difícil de restilizar y desagradable de mantener. La vía que funciona es la indirecta: convierte el `.docx` a Markdown, revisa qué conservó la conversión, y luego publica desde el Markdown. Si estás publicando desde Word con regularidad, ese desvío es el argumento para cambiar qué formato es la fuente.

### Longevidad y dependencia del proveedor

La afirmación de longevidad de Markdown es la más fuerte que tiene. El archivo es texto; se lee correctamente en cualquier editor, en cualquier sistema operativo, sin que tenga que seguir existiendo ningún software. En veinte años los títulos seguirán siendo visiblemente títulos.

La posición de Word es mejor que su reputación. El formato es abierto y estandarizado —ECMA-376, equivalente a ISO/IEC 29500 (comprobado en ecma-international.org, el 9 de septiembre de 2026)— otras aplicaciones lo leen y escriben, y los archivos de hace una década se abren hoy. No es dependencia del proveedor en el sentido legal o técnico. La dependencia es de comportamiento, y es real: la plantilla corporativa, las macros que escribió alguien, las costumbres de revisión, el hecho de que cada documento asume una aplicación con un modelo de página. Eso es lo que hace caro dejar un patrimonio de Word, no el formato del archivo.

Así que la clasificación para un documento que quieres legible en veinte años es: Markdown primero, `.docx` segundo, y cualquier documento en la nube propietario que solo existe dentro del editor de un proveedor, un distante tercero. Si la longevidad es un requisito declarado, conserva una fuente Markdown y un PDF exportado, y trata el archivo de Word editable como el descartable.

### Accesibilidad

Word es más capaz aquí de lo que la mayoría de ingenieros asume. Los estilos de título producen un esquema de documento real que un lector de pantalla navega, las imágenes tienen un campo de texto alternativo, las tablas pueden tener una fila de cabecera designada, y la aplicación trae un comprobador de accesibilidad cuyas reglas publicadas incluyen texto alternativo en todo contenido no textual y contraste suficiente entre texto y fondo (comprobado en support.microsoft.com, el 9 de septiembre de 2026). La trampa es que todo eso es por documento y depende de que el autor use estilos en vez de poner el texto grande y en negrita — que es exactamente la costumbre que también rompe la conversión.

Markdown es semántico por construcción. Un título es un título sin forma de fingirlo, el texto alternativo es parte de la sintaxis de imagen, y las listas son listas. Lo que Markdown no puede expresar es el resto de la superficie de accesibilidad: un atributo de idioma, el alcance de una tabla, un pie de foto atado a una tabla, ARIA donde se necesite. Eso viene de la plantilla o el tema que renderiza el Markdown, que es el punto estructural importante — auditas un conjunto de documentación en Markdown una vez, en su tema, y cada página hereda el resultado. Auditas un patrimonio de Word un documento a la vez, para siempre.

## Dónde pierde Markdown, y qué cuesta eso

Markdown gana en casi cada eje que le importa a un equipo técnico, y pierde por completo siempre que el trabajo del documento es imprimirse, firmarse, o revisarse por alguien que trabaja en Word. Merece la pena decirlo sin rodeos en vez de discutirlo alrededor, porque los fallos son predecibles y cada uno tiene un coste al que se le puede poner un número.

**Cuando el artefacto es una página impresa.** Cualquier cosa que se le entrega a una persona en papel tiene una maquetación, y una maquetación significa páginas, márgenes, cabeceras y control sobre qué cae dónde. Markdown no puede expresar nada de eso; una conversión a PDF te da lo que decida la plantilla. Coste: o aceptas la paginación de la plantilla o gastas el tiempo construyendo una plantilla que haga lo que quieres, que es un proyecto real con un propietario.

**Cuando algo hay que firmarlo.** Una propuesta, un contrato, un acuse de recibo de una política. Los flujos de firma esperan un documento paginado con posiciones fijas, y el artefacto firmado es el registro. Coste: ninguno si conviertes al final, considerable si intentaste hacer de Markdown lo que se firma.

**Cuando el revisor trabaja en Word y no se va a mover.** Un abogado, un regulador, un auditor, el equipo de compras de un cliente. Van a devolver un archivo con cambios controlados, y volver a leer esos cambios en una fuente Markdown es trabajo manual que ningún conversor hace bien. Coste: la tarde de una persona por ronda de revisión, y el riesgo de que se pierda un cambio.

**Cuando el documento está diseñado.** Una propuesta, un folleto, un informe con la marca de un cliente. Coste: horas de soluciones improvisadas, y al final una admisión de que el documento siempre fue una pieza de diseño.

**Cuando los revisores no técnicos necesitan comentar.** No editar — comentar. Los hilos de comentarios anclados de Word son la herramienta correcta y no hay ningún equivalente en Markdown que use un revisor no técnico. Coste: los comentarios llegan por correo en su lugar, sin ancla, y se pierden.

**Cuando hay formularios y campos rellenables.** Nada en Markdown hace esto. Coste: la herramienta equivocada por completo.

**Cuando nadie es dueño de la cadena.** Docs as code necesita un repositorio, una costumbre de revisión, un build y alguien que mantenga los tres. A un equipo pequeño sin ingenieros no se le debería pedir que gestione uno. Coste: la cadena se rompe, nadie la arregla, y los docs vuelven a la unidad compartida con un paso extra de resentimiento pegado.

**Cuando el dialecto se desvía.** Markdown es una familia de dialectos. Una tabla se renderiza en tu alojador de código y sale como caracteres de barra en tu build, las notas al pie funcionan en un analizador y no en el siguiente. Coste: errores que solo aparecen en la salida publicada.

**Cuando las tablas son complicadas.** Celdas combinadas, tablas anidadas, una celda que contiene una lista. Las tablas de Markdown son cuadrículas sencillas. Coste: o la tabla se simplifica, que a menudo es una mejora, o se vuelve HTML en crudo en medio de tu prosa.

## El híbrido en el que termina la mayoría de organizaciones, y cómo evitar que se pudra

Casi nadie usa un solo formato. El estado final es un híbrido, y el híbrido está bien — lo que se pudre es la versión donde los dos formatos se tratan como originales. Ese es el arreglo donde alguien arregla una errata en la copia de Word el martes, la fuente Markdown se regenera el miércoles, y el arreglo del martes desaparece sin que nadie lo note durante un año.

Una regla lo evita: **un formato es la fuente, el otro es una exportación, y la exportación nunca se edita.** Todo lo demás es implementación.

| Documento | Fuente | Exportación | Quién edita la fuente |
| --- | --- | --- | --- |
| Referencia de API, manuales de procedimiento, notas de arquitectura | Markdown en el repositorio | Página HTML, o un PDF para una auditoría | Ingenieros, en pull requests |
| Manual del empleado, políticas | Markdown en el repositorio | Un `.docx` o PDF para imprimir y para acuses de recibo | RRHH, mediante el editor web del alojador |
| Contratos, propuestas de trabajo | Word | PDF para firma; Markdown solo si hay que publicarlo | Legal, con cambios controlados |
| Propuestas e informes con diseño | Word, desde la plantilla de casa | PDF | Quien sea dueño del trato |
| Notas de reunión, registros de decisiones | Markdown | Ninguna | Cualquiera |
| Presentaciones regulatorias y cualquier cosa con maquetación especificada | Word | PDF | La persona dueña de la presentación |

Tres prácticas mantienen el arreglo honesto, y las tres son baratas:

1. **Estampa cada exportación.** Un archivo generado lo dice, en su primera página: generado a partir de esta fuente, en esta fecha, desde este commit. Quien abra la exportación y quiera cambiar una palabra sabe entonces adónde ir. Sin el sello, la exportación es indistinguible de un original y se va a editar como tal.
2. **Regenera en vez de reparar.** Cuando una exportación está mal, el arreglo va a la fuente y la exportación se reconstruye. Si un arreglo alguna vez va directo a la exportación, ya tienes dos fuentes y el reloj ha empezado.
3. **Nombra un propietario por tipo de documento, no por documento.** «Todas las políticas son Markdown, RRHH es su propietario» es una regla que la gente puede seguir. «Este en concreto es Word porque a Priya le gusta así» es como vuelves a tener tres respuestas sobre dónde vive la documentación.

### Migrar un patrimonio de Word a Markdown

No empieces convirtiendo. Empieza listando lo que tienes y decidiendo, por documento, si debería existir siquiera — un proyecto de conversión que empieza con una conversión masiva produce doscientos archivos Markdown de los cuales sesenta están obsoletos y cuarenta nunca fueron documentos, y nadie los va a clasificar nunca después.

Luego convierte los que sobreviven, en lotes pequeños, y lee cada resultado contra el original. Los títulos que se hicieron grandes y en negrita en vez de con estilo llegan como párrafos; las listas numeradas llegan como texto llano cuando las definiciones de numeración no se resuelven; las imágenes caen como archivos separados o desaparecen; los pies de foto se vuelven frases normales que ya no pertenecen a nada. Las vías de conversión y la lista de comprobación para detectar exactamente esos fallos están en [cómo convertir un .docx a Markdown](/blog/convert-docx-to-markdown), y para un documento único sin nada que instalar, [la conversión de Word a Markdown de TransformPipe](/word-to-markdown) corre en el navegador — sin iniciar sesión, el archivo no se sube a ninguna parte, lo cual importa cuando el documento es un borrador de política y no un README público.

Dos reglas para la migración misma. Deja en paz los documentos con diseño: un folleto convertido a Markdown es un folleto destruido, y la respuesta correcta para él es conservar el archivo de Word y dejar de fingir que es documentación. Y conserva los archivos `.docx` originales en algún sitio de solo lectura hasta que la migración tenga suficiente edad como para que nadie esté preguntando qué se perdió en la conversión.

### Yendo en la otra dirección, para una ronda de revisión

La dirección contraria es una rutina, no una migración. Un revisor necesita un archivo de Word; la fuente se queda en Markdown. Convierte a `.docx` con un documento de referencia para que la salida llegue con la plantilla de casa, envíalo, y vuelve a leer a mano los cambios controlados devueltos hacia el Markdown. Ese último paso es manual y no se automatiza: la capa de revisión vive en partes del archivo que los conversores o descartan o aplanan a texto normal, así que lo que recuperas es o el documento con todos los cambios aceptados o un lío. [Conseguir un .docx que alguien pueda editar de verdad](/blog/markdown-to-word) cubre la mecánica de la plantilla.

Presupuesta la relectura manual y son un par de horas por ronda. Asume que va a convertir limpiamente en los dos sentidos y al final vas a publicar una versión con la redacción rechazada de un revisor todavía dentro.

## Cómo decidir

Seis criterios, cada uno con la consecuencia adjunta, en el orden que resuelve más casos primero.

1. **Nombra el artefacto en el que tiene que convertirse el documento.** Una página web, una página en un repositorio, un folleto impreso, un PDF firmado, una presentación. Si se imprime o se firma, la fuente es Word y la discusión se acaba; si es una página web o un archivo que la gente lee como texto, la fuente es Markdown y aplica lo mismo.
2. **Nombra a la persona menos técnica que tenga que cambiar una frase con poco margen.** Si esa persona está en ventas, RRHH o legal, o el formato es Word o le debes una superficie de edición que de verdad vaya a usar — y si no le das ninguna de las dos, el documento se queda desactualizado entre peticiones y la decisión de formato se tomó por defecto.
3. **Cuenta con qué frecuencia cambia, y por cuánta gente.** Con un puñado de ediciones al año de un solo propietario, Word no cuesta nada. Ediciones semanales de una docena de personas necesitan fusiones, y Word no tiene operación de fusión, así que el coste cae sobre quien consolide las copias.
4. **Pregúntate si alguna vez vas a tener que cambiar una frase en todas partes.** Si la respuesta es sí —nombres de producto, endpoints, direcciones, redacción legal— Markdown es el único de los dos donde el cambio es una unidad revisable en vez de un acto de diligencia que tienes que confiar a ciegas.
5. **Pregúntate si alguien va a necesitar saber por qué una frase dice lo que dice.** Para controles de seguridad, compromisos de servicio y cualquier cosa que lea un auditor, la procedencia es parte del trabajo del documento, y solo el control de versiones la registra al nivel de la frase.
6. **Decide quién es dueño de la cadena antes de construir una.** Un repositorio, una costumbre de revisión y un build necesitan un propietario con nombre; si no puedes nombrar a uno, elige el formato que no necesita cadena y revísalo cuando puedas.

## Conclusión

La documentación debería vivir en el formato que coincide con lo que tiene que hacer, y para la mayor parte de la documentación que mantiene una organización técnica ese formato es Markdown en control de versiones — porque lo que mantiene la documentación fiel es revisión, historial, búsqueda y la capacidad de cambiar una frase en todas partes a la vez, y esas son las cuatro cosas que un texto en un repositorio hace mejor. Word sigue siendo la respuesta correcta, de forma permanente y sin disculpas, para documentos cuyo trabajo es maquetarse, imprimirse, firmarse, o negociarse cláusula por cláusula con alguien cuya herramienta son los cambios controlados. Usa los dos, decide por tipo de documento cuál es la fuente, genera el otro, y estampa el archivo generado para que nadie lo edite por error — entonces el único trabajo que queda es la conversión en el límite, que es un trabajo de un solo paso en cualquier dirección y la única parte de esto que una herramienta puede resolver por ti.

## Preguntas frecuentes

### ¿Markdown es mejor que Word para documentación?

Para documentación que cambia con frecuencia, la mantienen varias personas y termina en una página web, sí — por la revisión, el historial, la búsqueda y la edición en bloque más que por nada de la sintaxis. Para un documento que hay que imprimir con una plantilla, firmar, o revisar cláusula por cláusula, Word es mejor y la diferencia no es reñida.

### ¿Los compañeros no técnicos pueden escribir documentación en Markdown de verdad?

La sintaxis no es el obstáculo; la mayoría aprende las almohadillas y los guiones en diez minutos. El obstáculo es el flujo de trabajo alrededor de ella —ramas, commits, revisiones— así que dales el editor web del alojador de código con vista previa, o un sistema de contenido que escriba Markdown de vuelta al repositorio. Pedirles que usen una terminal es cómo un programa de docs as code falla en silencio.

### ¿Qué pasa con los cambios controlados y los comentarios al convertir un documento de Word a Markdown?

Son lo primero que se pierde. Las inserciones y eliminaciones pendientes se aceptan en silencio o se descartan, y los hilos de comentarios no tienen ningún equivalente en Markdown, así que suelen desaparecer sin aviso. Resuelve la capa de revisión en Word antes de convertir, y lee a mano lo que necesites conservar.

### ¿Cómo imprimo un documento Markdown o saco un PDF de él?

Convierte a HTML e imprímelo desde un navegador, que usa los propios estilos de la página, o convierte a `.docx` con una plantilla de casa e imprime desde ahí. En cualquier caso la paginación la decide la plantilla y no el documento, así que si la maquetación importa, la plantilla es lo que hay que construir.

### ¿Deberíamos conservar el .docx original después de convertirlo?

Consérvalo de solo lectura hasta que el Markdown se haya leído, revisado y usado un tiempo. Las conversiones descartan cosas en silencio —pies de foto, numeración, contenido flotante— y el original es la única forma de descubrir qué se perdió, que es una pregunta que alguien siempre hace unos tres meses después.

### ¿Word deja nuestra documentación cautiva?

No a nivel de formato: `.docx` es Office Open XML, un estándar documentado publicado como ECMA-376 y como ISO/IEC 29500, que varias aplicaciones leen y escriben. La dependencia es de comportamiento —la plantilla, las macros, las costumbres de revisión, y la suposición de que cada documento tiene páginas— y eso es lo que hace caro mover un patrimonio de documentos de Word, no los archivos en sí.

### ¿Qué formato es mejor para accesibilidad?

Word puede expresar más, incluido un atributo de idioma, filas de cabecera de tabla y un comprobador de accesibilidad, pero cada documento hay que redactarlo correctamente y auditarlo uno a uno. Markdown es semántico por construcción y hereda el resto de su plantilla, así que auditas el tema una vez y cada página se beneficia — que suele ser el camino más barato hacia un conjunto de documentos que son todos accesibles en vez de solo algunos.
