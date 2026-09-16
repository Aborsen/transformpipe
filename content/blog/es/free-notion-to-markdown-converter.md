---
title: "Conversor gratis de Notion a Markdown: todas las opciones y dónde está el truco"
description: "Comparamos las vías gratuitas para pasar páginas de Notion a Markdown: el botón de exportar, un conversor en el navegador, notion-to-md y Obsidian Importer"
date: 2026-09-14
tag: Conversión
keywords: conversor gratis de notion a markdown, convertir notion a markdown, notion a markdown gratis, convertir notion a markdown online, conversor notion markdown gratis, exportar notion a markdown, pasar notion a md
---

Busca un conversor de Notion a Markdown y casi todo lo que vuelve es gratis, que es un resultado raro para una búsqueda con dinero dentro. También es cierto. La exportación de la propia Notion no cuesta nada, los paquetes de código abierto no cuestan nada, los conversores del navegador no cuestan nada, los editores que importan un espacio de trabajo entero no cuestan nada. Nadie cobra por la conversión en sí, porque la conversión no es donde está la dificultad.

La dificultad es que cada una de estas opciones gratuitas lo es de una manera distinta, y cada una te pasa después una factura distinta. Una produce nombres de archivo con un identificador hexadecimal de 32 caracteres soldado al final. Otra necesita un token de integración, un paso de permisos dentro de Notion y un límite de peticiones bien gestionado en el código. Otra manda tu espacio de trabajo a un servidor del que no has oído hablar nunca. Y otra se lleva una tarde de tu propio tiempo, que es lo único genuinamente caro de esta lista.

Así que esta es una comparativa escrita sobre el eje que de verdad las separa: no el precio, sino lo que cuesta lo gratis. Todas las herramientas de abajo son gratuitas de verdad —ni prueba gratuita, ni plan gratuito con un muro detrás— y junto a cada una está la respuesta honesta a «¿y luego qué?». Si lo que buscas es la mecánica de una vía concreta y no elegir entre ellas, [la guía completa recorre cada camino paso a paso](/blog/convert-notion-export-to-markdown).

### Resumen rápido

Todas las opciones serias son gratuitas, así que elige por forma. **La propia exportación «Exportar como Markdown y CSV» de Notion** es de donde parte todo lo demás: Markdown de verdad, pero cada nombre de archivo y cada enlace entre páginas lleva pegado el id de 32 caracteres hexadecimales. **Un conversor de navegador que fusiona la exportación** —[la conversión de Notion a Markdown de aquí](/notion-to-markdown) es uno— coge ese mismo zip y te devuelve un solo documento con índice, sin ids y sin script, sin subir nada cuando no has iniciado sesión; el trato es que las páginas pasan a ser secciones en vez de archivos. **`notion-to-md`** lee las páginas por la API de Notion desde Node y te deja poner tú los nombres de salida: lo correcto para un paso de compilación, lo equivocado para algo puntual, porque un token y una concesión de permisos van antes de la primera línea de código. **Obsidian Importer** es gratuito, con licencia MIT, y es la vía cuando el destino es una bóveda. **Pandoc** convierte en local la exportación HTML, que es más rica. **Copiar y pegar** deja de funcionar hacia la quinta página.

El truco, en todos los casos, es tiempo, configuración, forma o privacidad — nunca dinero.

## Por qué esta conversión es más difícil de lo que parece

Notion identifica una página por un id, no por su título. Los títulos cambian, dos páginas pueden compartir uno y la exportación necesita nombres de archivo únicos, así que escribe el id dentro del nombre de cada archivo y cada carpeta que crea: `Meeting notes 21f4c8a1b2c34d5e8f90123456789abc.md`. Cada enlace de una página exportada a otra apunta a ese nombre de archivo exacto, codificado con porcentajes. Renombra el archivo a algo legible y el enlace se rompe en silencio, porque un enlace relativo muerto no produce ningún error hasta que un lector hace clic en él.

Ese único hecho es lo que separa a las herramientas. Un conversor o te deja a ti con los ids, o los reescribe en una pasada que reescribe también todos los enlaces, o elimina la necesidad de que se resuelvan fusionando las páginas en un solo documento. No hay una cuarta opción, y ninguna cantidad de dinero produciría una.

Hay una segunda dificultad que no tiene nada que ver con los ids. Una página de Notion no es solo texto: son bases de datos con vistas, columnas de fórmula, bloques sincronizados que se muestran en varios sitios e hilos de comentarios pegados a la página en lugar de escritos dentro de ella. De toda esa lista, Markdown tiene tablas y nada más, así que parte de la pérdida es estructural — ocurre en la exportación, antes de que ningún conversor entre en juego.

Y hay una tercera, que es donde la cuestión de lo gratuito se pone interesante. Un espacio de trabajo de Notion suele ser la colección de documentos más sensible que tiene una empresa pequeña: notas de contratación, sueldos, estrategia, borradores jurídicos a medio hacer. Un conversor online gratuito que sube tu exportación es gratuito porque has pagado en otra moneda — bien para un manual público, una transferencia de datos para todo lo demás, y algo que conviene decidir a propósito y no arrastrando un archivo a la primera página que salió en los resultados.

## Comparativa rápida: la chuleta

| Herramienta | Mejor para | Capacidad principal | Precio |
| --- | --- | --- | --- |
| «Exportar como Markdown y CSV» de Notion | Sacar el contenido, para empezar | Markdown de verdad para cada página, CSV para cada base de datos | Gratis, integrado |
| Un conversor de navegador (el `/notion-to-markdown` de este sitio) | Un documento para leer, archivar o entregar | Fusiona el zip de la exportación en un documento con índice, en el navegador | Gratis |
| La exportación más tu propio script de reescritura | Una carpeta de archivos que deben seguir siendo archivos | Renombra archivos y reescribe enlaces desde un único mapa de ids | Gratis, te cuesta tu tiempo |
| `notion-to-md` | Un paso de compilación o una sincronización programada | Lee las páginas por la API de Notion y escribe archivos con los nombres que tú pongas | Gratis, código abierto |
| Obsidian Importer | Un destino que es una bóveda de Obsidian | Importa una exportación HTML de Notion o lee la API directamente | Gratis, MIT |
| Pandoc sobre la exportación HTML | Una página cada vez, o una cadena documental más larga | HTML dentro, Markdown fuera, más todos los demás formatos que escribe | Gratis, GPL |
| Copiar y pegar | Tres páginas, una vez, hoy | Nada que instalar, nada que aprender | Gratis |

## Las opciones gratuitas, una a una

### La exportación de la propia Notion — mejor para sacar el contenido, para empezar

Todas las demás vías de aquí o parten de esta exportación o la sustituyen por la API. La exportación de Notion vive en el menú de la página o del espacio de trabajo y ofrece PDF, HTML y Markdown y CSV; la opción de Markdown escribe un `.md` por página y un `.csv` por cada base de datos de página completa, con las imágenes y demás recursos guardados en carpetas al lado (consultado en notion.com, 14 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| Genuinamente gratis, integrado, sin más cuenta que la que ya tienes | Cada nombre de archivo y cada enlace entre páginas lleva el id de 32 caracteres hexadecimales |
| La salida es Markdown de verdad, que abre cualquier editor | Solo se exporta la vista actual o la predeterminada de una base de datos |
| Las bases de datos salen como CSV, que al menos es legible por una máquina | Una vista de formulario no se puede exportar en absoluto |
| Los recursos vienen incluidos en vez de quedarse como URLs que caducan | Una exportación grande llega como un enlace por correo, y el enlace caduca |

**Precio:** gratis. Una función cercana no lo es: «Incluir subpáginas» para una exportación a **PDF** aparece descrita en la propia página de ayuda de Notion como una función de los planes Business o Enterprise (consultado en notion.com, 14 de septiembre de 2026). La vía de Markdown y CSV no está limitada así, lo cual conviene saber si alguien de tu equipo ha concluido que exportar un espacio de trabajo exige subir de plan.

**Detalles técnicos.** El sufijo del id son 32 caracteres hexadecimales en minúscula, separados del título por un espacio o un guion bajo según la versión del cliente que produjera la exportación. «Crear carpetas para las subpáginas» se puede desactivar para acortar las rutas, cosa que importa en Windows, donde un espacio de trabajo muy anidado produce rutas más largas de lo que acepta el sistema operativo. Las exportaciones muy grandes no se descargan al momento: Notion manda un enlace por correo, caduca a los siete días y el procesamiento está documentado como algo que puede tardar hasta treinta horas — así que una exportación lanzada la tarde de una migración puede no llegar a tiempo para ella.

**¿Para quién es?** Para todo el mundo, lo primero. Elijas la vía que elijas después, esta es la forma oficial de sacar una copia de tu contenido de un producto alojado, y hacerlo una vez antes de necesitarlo es un seguro barato.

### Un conversor de navegador que fusiona la exportación — mejor para un solo documento

Suelta ese mismo zip en [la conversión de Notion a Markdown de TransformPipe](/notion-to-markdown) y cada página se convierte en una sección de un único documento, en el orden de la propia exportación, bajo un índice generado. Un enlace entre páginas conserva las palabras que mostraba y suelta la dirección, porque una vez que dos páginas son secciones de un mismo documento ya no hay una dirección aparte a la que apuntar. Las bases de datos llegan como tablas de Markdown en vez de como archivos CSV apartados en un rincón.

| A favor | En contra |
| --- | --- |
| Sin mapa de ids, sin renombrar, sin script, sin instalar nada | Produce un solo documento, así que las páginas no siguen siendo archivos separados con su propia URL |
| Se genera un índice a partir de los títulos de las páginas | Un enlace entre páginas conserva su texto, no su destino |
| Funciona en el navegador: sin sesión iniciada, el zip no se sube a ninguna parte | Un zip cada vez, no una tarea programada |
| Las bases de datos llegan como tablas en el mismo documento que las páginas | Los comentarios y las vistas no predeterminadas siguen faltando, porque la exportación nunca los tuvo |

**Precio:** gratis en el sentido más llano — la conversión se ejecuta localmente en la página, así que no hay coste de servidor que recuperar ni cuota por archivo con la que chocar. Una cuenta añade historial, compartir y una API, también gratis.

**Detalles técnicos.** El zip se lee en el navegador con un descompresor de JavaScript puro, con las entradas ordenadas por su ruta dentro del archivo para que la misma exportación se convierta igual dos veces, y el título de cada sección es el nombre del archivo con el sufijo del id quitado. Una página cuya primera línea ya repite su título como encabezado no recibe ese encabezado dos veces, y las páginas se separan con una línea horizontal — la convención que usa en cualquier otro sitio [fusionar muchos archivos Markdown en uno](/blog/merging-many-markdown-files).

**¿Para quién es?** Para cualquiera cuyo objetivo real era un documento y no una carpeta: un espacio de trabajo archivado como un único archivo legible, un wiki de proyecto entregado a un cliente, una base de conocimiento pegada en un repositorio. Si el destino necesita una URL por página, esta es la forma equivocada y las dos opciones siguientes son las correctas.

### La exportación más tu propio script de reescritura — mejor para archivos que siguen siendo archivos

Si el destino es un sitio de documentación, una importación a un wiki o cualquier cosa donde cada página necesite su propia dirección, los ids tienen que salir como es debido: construye un mapa del id de cada archivo al nombre que quieres, y luego reescribe cada nombre de archivo y cada enlace desde ese único mapa, en una sola pasada. Hacer el renombrado sin la reescritura de enlaces es lo que produce una carpeta que parece correcta y está llena de enlaces muertos.

| A favor | En contra |
| --- | --- |
| Sin dependencias, sin token, sin cuenta, sin subir nada | La opción más cara de aquí, medida en tu propio tiempo |
| La salida son archivos de verdad con nombres de verdad, que es lo que quiere un sitio de documentación | Medio trabajo rompe todos los enlaces internos, en silencio |
| Funciona sin conexión, sobre la exportación que ya tienes | El CSV de la base de datos no se vuelve a unir con la página a la que pertenecía |
| Repetible una vez escrito, y revisable porque lo escribiste tú | Diez páginas a mano son una tarde; mil a mano no es realista |

**Precio:** gratis, si no cuentas la tarde. Que deberías contarla: a cualquier tarifa por hora, un script cuidadoso más sus pruebas es la línea más cara de esta página, y la única cuyo coste permanece invisible hasta que llevas tres horas metido en él.

**Detalles técnicos.** La extracción del id tiene que ejecutarse sobre el destino del enlace ya decodificado, no sobre el crudo con codificación de porcentajes, o el espacio de `Meeting%20notes` no encajará con un patrón escrito para un espacio literal. El resto —la expresión regular, la unión del CSV, el aplanado de carpetas— está expuesto en [la guía paso a paso](/blog/convert-notion-export-to-markdown) y no aquí.

**¿Para quién es?** Para equipos que migran un conjunto de documentación a un sistema que espera un archivo por URL, donde los nombres de archivo y los enlaces entre ellos son parte del entregable y no algo accesorio.

### `notion-to-md` — mejor para un paso de compilación

Leer el espacio de trabajo por la API oficial de Notion en lugar de por el botón de exportar evita el problema de los ids por completo, porque nada obliga a meter un id en un nombre de archivo cuando el que escribe el archivo eres tú. `notion-to-md` es el paquete de Node que se usa habitualmente para esto: recorre el árbol de bloques de una página a través de la API y lo convierte a Markdown, con un enganche para tratar los tipos de bloque que no cubre de serie.

| A favor | En contra |
| --- | --- |
| Nunca hay sufijo de id, porque eliges tú cada nombre de archivo | Necesita un token de integración y que esa integración esté compartida con cada página — un paso de permisos, no de código |
| Encaja en un script de compilación, un sitio estático o un espejo programado hacia git | Una página o una consulta de base de datos cada vez; recorrer un espacio de trabajo es recursión tuya |
| Se ejecuta en CI sin navegador y sin darle a exportar a mano | Los bloques de imagen vuelven como URLs temporales de la propia Notion, que caducan salvo que las descargues |
| Extensible: los tipos de bloque no soportados se pueden tratar con tu propio transformador | La API tiene límite de peticiones, y un script que lo ignora parece colgado |

**Precio:** gratis, código abierto. La licencia merece enunciarse con cuidado: el paquete publicado declara ISC en sus metadatos de npm, mientras que el archivo `LICENSE` del propio repositorio —y la línea 4.0 alfa— llevan MIT (consultado en registry.npmjs.org y github.com/souvikinator/notion-to-md, 14 de septiembre de 2026). Las dos son permisivas; si tu organización registra licencias formalmente, registra cuál de los dos artefactos cogiste.

**Detalles técnicos.** La API de Notion está limitada a una media de tres peticiones por segundo y por integración, con un límite aparte para todo el espacio de trabajo por encima (consultado en developers.notion.com, 14 de septiembre de 2026). Pasado el límite, una petición devuelve `429` con una cabecera `Retry-After` en lugar de datos, así que un bucle de esperar y reintentar pertenece a la primera versión del script y no a la que se escribe después del primer fallo — para un espacio de trabajo grande, esa es la diferencia entre una tarea que termina y una que matas dando por hecho que se ha caído.

**¿Para quién es?** Para cualquiera para quien esto no sea algo puntual: un sitio que construye sus páginas desde Notion, un espejo nocturno de un manual hacia un repositorio, una cadena donde «alguien lo exporta a mano cada mes» es el paso que acabará saltándose.

### Obsidian Importer — mejor cuando el destino es una bóveda

Si el Markdown va a acabar en Obsidian, el camino gratuito más corto es el propio plugin Importer de Obsidian y no un conversor general. Maneja una lista larga de orígenes —Evernote, OneNote, Roam, Bear, Apple Notes, carpetas de HTML y de Markdown a secas, entre otros— y ofrece Notion en dos sabores distintos.

| A favor | En contra |
| --- | --- |
| Gratis y con licencia MIT, mantenido por el propio equipo de Obsidian (consultado en github.com/obsidianmd/obsidian-importer, 14 de septiembre de 2026) | Solo sirve si el destino es una bóveda; no es un conversor de propósito general |
| Dos vías: leer el espacio de trabajo por la API, o importar el zip de la exportación sin conexión | Su propia documentación desaconseja la exportación a Markdown de Notion y recomienda la de HTML |
| La vía de la API convierte las bases de datos y las fórmulas en los propios archivos de base de datos de Obsidian | La vía del zip no conserva las bases de datos, y a cambio no necesita ningún token |
| Un paso de vista previa antes de escribir nada en la bóveda | La vía de la API está sujeta a los mismos límites de peticiones de Notion, así que un espacio de trabajo grande tarda lo suyo |

**Precio:** gratis, con licencia MIT.

**Detalles técnicos.** Los límites documentados son lo bastante concretos como para planificar alrededor de ellos: por la vía de la API solo se importa la vista principal de cada base de datos, las fuentes de datos enlazadas no, y un puñado de funciones de fórmula relativas a personas y a estilos de texto no tienen equivalente. La vía del zip cambia las bases de datos por independencia — sin token, sin internet, sin límite de peticiones. La recomendación de exportar HTML en vez de Markdown es lo interesante aquí, porque es un fabricante diciendo con todas las letras que la exportación a Markdown de Notion pierde información que la exportación a HTML conserva (consultado en obsidian.md, 14 de septiembre de 2026).

**¿Para quién es?** Para quien esté moviendo un espacio de trabajo a Obsidian, el destino más habitual de esta conversión. La pregunta más amplia de [qué sobrevive a un traslado entre Notion, Obsidian y Confluence](/blog/markdown-from-notion-obsidian-and-confluence) conviene leerla antes de la importación y no después.

### Pandoc sobre la exportación HTML — mejor para una página, o para una cadena más larga

Pandoc es un conversor de documentos de línea de comandos que lee HTML y escribe Markdown, entre una larga lista en ambas direcciones. Apuntado a la exportación HTML de Notion en lugar de a la de Markdown, es un conversor gratuito, local y programable que parte de la más rica de las dos exportaciones.

| A favor | En contra |
| --- | --- |
| Gratis y local: no se sube nada, y corre en CI igual de fácil que en un portátil | Convierte archivos, no archivadores: el zip, el recorrido de carpetas y los nombres son problema tuyo |
| Parte de la exportación HTML, que lleva más cosas que la de Markdown | Una instalación grande para una sola página |
| El mismo comando escribe DOCX, PDF o LaTeX cambiando una opción | El HTML exportado por Notion está generado por una máquina, así que el Markdown pide una pasada de limpieza |
| Control fino sobre el dialecto de Markdown que escribe | Ninguna noción de espacio de trabajo, árbol de páginas ni base de datos |

**Precio:** gratis, con licencia GPL (consultado en pandoc.org, 14 de septiembre de 2026).

**Detalles técnicos.** El dato relevante es que la exportación HTML de Notion y su exportación Markdown no son el mismo contenido con dos disfraces: la de HTML lleva formato y estructura que el escritor de Markdown tuvo que soltar, que es justo por lo que el importador de Obsidian pide HTML. Pandoc te deja empezar ahí y elegir tú el sabor de Markdown a la salida, y las diferencias entre [los sabores de Markdown](/blog/commonmark-gfm-and-the-flavours) deciden cuánto de ese marcado sobrevive.

**¿Para quién es?** Para quien ya tenga Pandoc dentro de una compilación, o para cualquiera que convierta un puñado de páginas importantes y prefiera partir de la exportación que perdió menos.

### Copiar y pegar — mejor para tres páginas, una vez

Selecciona la página en Notion, copia, pega en un editor de Markdown y arregla lo que se haya roto. Está en esta lista porque, para un puñado de páginas, es genuinamente la opción gratuita más rápida.

| A favor | En contra |
| --- | --- |
| Nada que instalar, configurar ni aprender | No escala más allá de unas pocas páginas, y el muro llega de golpe |
| Ves cada página, así que nada se destroza en silencio | Las imágenes no vienen; cada una se vuelve a descargar a mano |
| Sin cuenta, sin token, sin subir nada | Ni repetible, ni revisable |

**Precio:** gratis.

**¿Para quién es?** Para alguien con tres páginas y una fecha de entrega. Para cualquier cosa con subpáginas, bases de datos o imágenes en cantidad, el coste de tiempo adelanta rápido a todas las demás opciones, y sin avisar — la quinta página se siente como la primera, y la cuadragésima es cuando te das cuenta de que deberías haber exportado.

## Dónde lo gratis tiene truco

Nada de lo de arriba cuesta dinero. Cada cosa cuesta algo, y los costes difieren lo bastante como para que «son todas gratis» sea lo menos útil que puedes saber sobre ellas.

**El truco es una cuota.** Las vías de la API —`notion-to-md` y el modo API de Obsidian Importer— están limitadas por el propio límite de peticiones de Notion, no por la página de precios de nadie. Tres peticiones por segundo y por integración suena generoso hasta que caes en que una página con bloques anidados son varias peticiones. La parte gratuita es real; la parte ilimitada no se prometió nunca.

**El truco es la configuración.** Un token de integración es gratis; crearlo, compartirlo con las páginas correctas, guardarlo donde una compilación pueda leerlo y acordarse de rotarlo no es nada. Para una conversión que harás exactamente una vez, ese es un mal trato frente a pulsar Exportar, y por eso el orden se invierte con la frecuencia.

**El truco es un plan.** La página de ayuda de Notion indica que «Incluir subpáginas» para una exportación a PDF requiere un plan Business o Enterprise (consultado en notion.com, 14 de septiembre de 2026). Esa no es la vía de Markdown, pero sí es un recordatorio de que «la exportación es gratis» vale por formato y no en general.

**El truco es tu contenido.** Un conversor alojado gratuito funciona sobre un servidor que alguien paga. Eso no es siniestro por sí solo, pero significa que «¿adónde va mi exportación?» tiene una respuesta real que no siempre está en la página. La conversión en el navegador la responde por construcción: abre el panel de red, ejecuta la conversión, mira cómo no sale nada. Si [un conversor online es seguro](/blog/is-an-online-converter-safe) para un archivo dado es tanto una pregunta sobre el archivo como sobre la herramienta.

**El truco es tu tarde.** La vía del script no tiene fabricante, ni cuota, ni pregunta de privacidad, y sigue siendo la opción más cara de aquí. El software libre no es mano de obra gratis, y un conversor que escribes es un conversor que mantienes la próxima vez que la exportación de Notion cambie de forma.

## Lo que no recupera ninguna herramienta gratuita

Tres cosas no salen de Notion en absoluto, en ningún formato ni por ninguna vía, así que ninguna comparativa de conversores puede arreglarlas.

**Los comentarios.** Un hilo de comentarios va pegado a la página como discusión en vez de guardado como contenido de la página, así que no llega a ninguno de los formatos de exportación. Si una decisión existe solo como respuesta en un hilo, pásala al cuerpo de la página antes de exportar; después ya no está desaparecida sin convertir, sino desaparecida a secas.

**Las vistas de base de datos no predeterminadas.** Notion exporta la vista que estás mirando o la predeterminada, no todas. Una base de datos filtrada de tres maneras para tres públicos se exporta como una de las tres; las otras hay que reconstruirlas a partir de las filas.

**Los bloques sincronizados.** Un bloque sincronizado es un bloque mostrado en varios sitios, y una exportación no tiene forma de decir eso: cada ubicación recibe su propia copia, sin ninguna marca de que alguna vez estuvieron enlazadas.

Una base de datos, por su parte, llega como una instantánea de filas —una tabla de Markdown no tiene fórmulas, relaciones ni resúmenes—, así que si esos números son calculados y no escritos a mano, revisa [la tabla que ha salido](/blog/markdown-tables-that-survive-conversion) antes de borrar nada en Notion.

## Cómo elegir

1. **Decide la forma de la salida antes de mirar ninguna herramienta.** Un documento, una carpeta de archivos con sus propias URLs, o una bóveda. Todas las recomendaciones de aquí se derivan de esa respuesta, y elegirla después de convertir significa hacer la conversión dos veces.
2. **Cuenta cuántas veces va a pasar esto.** Una vez, y la opción sin configuración gana solo por tiempo — pulsar Exportar, soltar el zip en un conversor de navegador, listo en minutos. Cada semana o en cada despliegue, y el coste de montar la vía de la API se amortiza a cero en un mes.
3. **Pregúntate si el contenido puede salir de tu máquina.** Un espacio de trabajo con sueldos, notas de contratación o cualquier cosa sin publicar elimina los conversores alojados de la lista antes de que empiece ninguna comparación de funciones, y deja la conversión en el navegador y las herramientas locales de línea de comandos.
4. **Comprueba lo que estás a punto de perder mientras aún lo puedes ver.** Los comentarios, las vistas extra de base de datos y los bloques sincronizados faltan en la salida sin ningún error que lo señale, así que la única comprobación fiable es mirar antes el origen en Notion.
5. **Cuenta las páginas con honestidad.** Tres es copiar y pegar. Treinta es una exportación y un conversor. Tres mil es un script de API con reintentos, y además una exportación que a Notion puede llevarle casi un día producir — así que empiézala antes de necesitarla.

## Conclusión

Aquí no hay ningún plan de pago que comparar, lo que convierte esto en un mercado inusualmente fácil en el que comprar y en uno inusualmente fácil en el que elegir mal. Las opciones difieren por forma, no por precio: la exportación de Notion saca el contenido y te entrega los ids; un conversor de navegador convierte ese zip en un documento legible y no sube nada; un script de reescritura mantiene los archivos como archivos a cambio de tu tarde; `notion-to-md` y Obsidian Importer leen la API como es debido, para cadenas de compilación y para bóvedas respectivamente; Pandoc convierte en local la exportación HTML, más rica. Elige según adónde va el Markdown y cada cuánto vas a hacer esto, prueba con una página que lleve una tabla, una imagen y un enlace a otra página, y recuerda que la única factura que mandan estas herramientas se paga en tiempo.

## Preguntas frecuentes

### ¿Existe un conversor de Notion a Markdown genuinamente gratis, sin prueba y sin cuota?

Sí, varios. La propia exportación a Markdown y CSV de Notion es gratis y viene integrada, un conversor de navegador que fusiona la exportación funciona localmente sin límite por archivo, y `notion-to-md`, Obsidian Importer y Pandoc son todos software libre y gratuito. Los límites con los que te vas a encontrar son el límite de peticiones de la API de Notion y tu propia máquina, no una página de precios.

### ¿Cuál es la forma gratuita más rápida de convertir un espacio de trabajo entero de Notion?

Expórtalo una vez como Markdown y CSV, y luego convierte el zip de una sola vez en lugar de página por página. Un conversor de navegador que fusiona produce un único documento con índice, sin renombrar ni programar nada; si las páginas deben seguir siendo archivos separados, reserva tiempo para la reescritura de los ids, porque esa es la parte que ninguna herramienta gratuita hace por ti automáticamente.

### ¿Por qué los nombres de mis archivos exportados llevan códigos largos y aleatorios?

Son ids de página: 32 caracteres hexadecimales que Notion usa para identificar una página, porque los títulos cambian y no son únicos. La exportación escribe el id en cada nombre de archivo y en cada enlace entre páginas, así que quitarlo significa reescribir ambas cosas a la vez desde un único mapa — o fusionar las páginas en un solo documento, donde ya nada necesita resolverse a un nombre de archivo.

### ¿Puedo convertir una exportación de Notion sin subirla a ninguna parte?

Sí. Un conversor que funciona en el navegador lee el zip con la propia API de archivos de la página y no lo envía nunca, cosa que puedes verificar abriendo el panel de red y viendo que no pasa nada. Las herramientas locales de línea de comandos como Pandoc, y el modo zip de Obsidian Importer, no tocan la red en absoluto.

### ¿Convertir Notion a Markdown requiere un plan de pago de Notion?

No para la exportación a Markdown y CSV. La página de ayuda de Notion sí indica que «Incluir subpáginas» para una exportación a **PDF** requiere un plan Business o Enterprise (consultado en notion.com, 14 de septiembre de 2026), así que comprueba el formato que necesitas en vez de dar por hecho que todo el menú de exportación se comporta igual.

### ¿Debería exportar como Markdown o como HTML?

Depende de lo que pase después. Markdown es el camino más corto si tu conversor lo acepta directamente. La documentación de Obsidian recomienda HTML en su lugar, con el argumento de que la exportación a Markdown de Notion omite información — así que si la fidelidad importa más que la comodidad, exporta HTML y conviértelo con Pandoc o con un importador que lo espere.

### ¿Los conversores gratuitos conservan mis bases de datos de Notion?

En parte, y las diferencias importan. La exportación a Markdown de Notion escribe cada base de datos de página completa como un CSV junto a las páginas; un conversor de navegador que fusiona convierte esas filas en una tabla dentro del mismo documento; Obsidian Importer conserva las bases de datos por su vía de API pero no por la del zip. Ninguno conserva fórmulas, relaciones, resúmenes ni ninguna vista que no sea la exportada.
