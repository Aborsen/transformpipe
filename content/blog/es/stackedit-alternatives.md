---
title: "Alternativas a StackEdit en 2026: sincronización, archivos, escritorio y una exportación puntual"
description: Alternativas a StackEdit según el motivo de tu búsqueda —sincronización rota, documentos como archivos, una aplicación de escritorio o una exportación puntual—
date: 2026-09-07
tag: Workflow
keywords: alternativa a stackedit, alternativas stackedit, stackedit sin conexion, editor markdown navegador, sincronizar markdown con google drive, editor markdown autoalojado, pasar espacio de trabajo markdown a archivos, exportar html desde stackedit
---

En algún punto de un documento, el indicador de sincronización deja de estar de acuerdo consigo mismo. La copia de la pestaña tiene un párrafo que la copia de Google Drive no tiene. La conexión con GitHub pide autorizarse otra vez. Un portátil que lleva un mes sin abrirse despierta con una versión más antigua del mismo archivo y ofrece, muy contento, conservarla. Normalmente no se pierde nada. Pero se han ido veinte minutos en la fontanería del documento en vez de en el documento, y ese es el momento en el que la mayoría empieza a buscar.

La otra vía que lleva a esta página es más silenciosa. No se ha roto nada. Simplemente has notado que tu escritura vive dentro de una pestaña del navegador, en un almacenamiento que no puedes ver, en una máquina donde borrar los datos del sitio es un acto normal de mantenimiento, y preferirías que viviera en una carpeta que puedes listar.

### Resumen rápido

Si lo que se rompió fue la sincronización, el arreglo duradero suele ser dejar de tener un espacio de trabajo y empezar a tener una carpeta: un repositorio Git, o Syncthing, o un cliente de una nube, con cualquier editor encima. Si quieres archivos en vez de un espacio de trabajo, Obsidian, VS Code y Zettlr funcionan directamente sobre archivos `.md` en disco y no añaden nada que no puedas ver. Si quieres una aplicación que esté ahí tanto si hay navegador como si no, Mark Text es gratis con licencia MIT y Typora es una compra única y pequeña. Y si lo único que querías de verdad era un documento convertido en una página web que puedas mandar, ahí no hay ningún espacio de trabajo en juego — es una conversión, y lleva más o menos un minuto.

## StackEdit en sus propios términos

Merece la pena ser preciso sobre lo que estarías sustituyendo, porque StackEdit no es una sola función. Su propia página describe un editor que te deja «escribir sin conexión igual que cualquier aplicación de escritorio», sincroniza archivos con Google Drive, Dropbox y GitHub, los publica como entradas de blog en Blogger, WordPress y Zendesk, y te deja elegir si la salida sale como Markdown, como HTML, o formateada mediante el motor de plantillas Handlebars. La sintaxis que maneja se describe como GitHub Flavored Markdown, Markdown Extra y CommonMark, más expresiones matemáticas LaTeX, diagramas UML, partituras en notación ABC y emojis. La página indica que tiene licencia Apache (comprobado en stackedit.io, el 9 de septiembre de 2026).

El repositorio completa el resto. El proyecto tiene licencia Apache-2.0 y se describe como un editor de Markdown de código abierto y con todas las funciones, basado en PageDown, la biblioteca de Markdown que usa Stack Overflow. Hay una app de Chrome y una extensión de Chrome, un `stackedit.js` incrustable para meter el editor en tu propio sitio, un chart de Helm para desplegarlo en Kubernetes con credenciales de Dropbox, Google, GitHub y WordPress configuradas, y un foro comunitario en community.stackedit.io (comprobado en github.com, el 9 de septiembre de 2026).

Así que hay cuatro productos separados empaquetados en una sola pestaña: un editor, un espacio de trabajo, un cliente de sincronización y un publicador. Ese empaquetado es exactamente lo que hace confuso sustituir StackEdit. La gente dice «necesito una alternativa a StackEdit» y quiere decir cuatro cosas distintas, y la alternativa que responde a una suele ser inútil para las demás. Un editor de escritorio sustituye al editor y a nada más. Un repositorio sustituye al espacio de trabajo y a la sincronización, y no te da ningún editor. Un conversor no sustituye nada y termina el trabajo que de verdad estabas intentando terminar.

El otro hecho estructural importa más que cualquier función: un documento de StackEdit es un registro dentro de un espacio de trabajo, y el espacio de trabajo es lo principal. Los archivos en Drive o en un repositorio son a lo que sincroniza el espacio de trabajo, no donde vive el documento. Todas las demás opciones de esta página invierten eso — el archivo es lo principal y las herramientas son intercambiables por encima. Casi toda razón para marcharse se reduce a querer esa inversión.

## Comparativa rápida: la chuleta

| Opción | El motivo al que responde | Qué es | Dónde viven los documentos | Precio |
| --- | --- | --- | --- | --- |
| StackEdit | Lo que tienes ahora | Espacio de trabajo en el navegador con sincronización y publicación | Almacenamiento del navegador, replicado a un proveedor | Gratis, licencia Apache |
| Repositorio Git, cualquier editor | Sincronización que puedes inspeccionar y deshacer | Control de versiones, no sincronización | Archivos en disco, historial en el repositorio | Gratis |
| Syncthing | Sincronización sin ningún intermediario | Sincronización continua de archivos entre tus propios dispositivos | Archivos en disco, en cada dispositivo | Gratis, MPL-2.0 |
| Un cliente de una nube | Sincronización que ya pagas | Sincronización de carpetas a nivel del sistema operativo | Archivos en una carpeta sincronizada | Incluido con la cuenta de almacenamiento |
| Obsidian | Archivos, con una aplicación real encima | Aplicación de escritorio y móvil sobre una carpeta | Archivos `.md` planos en una bóveda | Gratis para cualquier uso |
| VS Code | Archivos, junto al código que documentan | Editor con vista previa de Markdown integrada | Archivos en la carpeta que abriste | Gratis |
| Zettlr | Archivos, con referencias adjuntas | Un banco de trabajo de escritura y publicación | Archivos en disco | Gratis, sostenido por donaciones |
| Mark Text | Una aplicación de escritorio gratis | Editor de un solo panel, salida en HTML y PDF | Archivos en disco | Gratis, MIT |
| Typora | Una aplicación de escritorio en la que vivir | Editor de un solo panel con exportación amplia | Archivos en disco | 14,99 $, hasta tres dispositivos |
| HedgeDoc | La pestaña del navegador, en un servidor que controlas | Notas de Markdown colaborativas en tiempo real | Tu servidor | Gratis, AGPLv3 |
| Un conversor en el navegador | Un documento a una página, sin espacio de trabajo | Markdown a HTML, convertido en local | En ningún sitio — el archivo se queda contigo | Gratis |
| Pandoc | Muchos documentos, muchos formatos, con script | Conversor de documentos de línea de comandos | Archivos en disco | Gratis, GPL |

Lee la tabla como cuatro grupos y no como doce opciones. Las filas dos a cuatro sustituyen la sincronización. Las filas cinco a siete sustituyen el espacio de trabajo por archivos. Las filas ocho y nueve sustituyen la pestaña por una aplicación. La fila diez mantiene la pestaña y cambia el servidor con el que habla. Las filas once y doce no sustituyen nada y terminan un documento. Dónde acabes depende por completo de cuál de las cuatro cosas se rompió.

## Motivo uno: lo que se rompió es la sincronización

Este es el más común, y los fallos tienen una forma. Un espacio de trabajo está atado a una cuenta de un proveedor, así que un documento escrito con la sesión iniciada en la cuenta de Google equivocada aterriza en un sitio donde no lo vas a buscar. Los tokens de autorización caducan o se revocan cuando un administrador endurece una política del espacio de trabajo, y la pestaña te sigue dejando escribir mientras la conexión con el proveedor está muerta. Dos navegadores, o un navegador y un teléfono, guardan cada uno una copia, y un conflicto se tiene que resolver con una persona leyendo dos versiones del mismo párrafo. Y cuando un documento existe solo en el almacenamiento de un navegador porque nunca se conectó la sincronización, borrar los datos del sitio es un evento de pérdida de datos disfrazado de mantenimiento.

Nada de eso es exclusivo de StackEdit. Es lo que pasa cuando la sincronización es una función dentro de una aplicación en vez de una capa por debajo de ella. Las alternativas de abajo la trasladan hacia abajo.

### Git como capa de sincronización

Un repositorio no es un servicio de sincronización, y ese es justo el punto. No pasa nada hasta que haces commit, lo que significa que la versión que tienes es la versión que hiciste, y los conflictos de fusión son explícitos en vez de un diálogo preguntando cuál de los dos párrafos querías. Tienes historial, así que un párrafo que borraste hace tres semanas es recuperable, algo que ningún cliente de nube ni ningún espacio de trabajo en el navegador te va a dar.

| A favor | En contra |
| --- | --- |
| Cada versión es recuperable, con un mensaje que dice por qué | Tienes que hacer commit, y se te va a olvidar |
| Los conflictos son visibles y resolubles línea por línea | Los conflictos de fusión en prosa son desagradables de leer |
| Funciona con cualquier editor de esta lista, y con ninguno | Sin historia para el móvil salvo una app que hable Git |
| El remoto es también el disparador de publicación | Un repositorio es un hábito, no un ajuste |

**Para quién es:** para cualquiera cuyos documentos ya viven cerca del código, y para cualquiera que haya perdido trabajo una vez y no piense repetirlo. También convierte la publicación de un botón en un build, lo que es una ganancia y no una pérdida: subir una rama puede renderizar y desplegar el documento, y [publicar directamente desde un repositorio](/blog/publish-markdown-from-github-actions) es un camino muy transitado.

### Syncthing — sincronización sin nada en el medio

Syncthing se describe como un programa de sincronización continua de archivos que sincroniza archivos entre dos o más ordenadores en tiempo real. Su página es directa sobre la arquitectura: ninguno de tus datos se guarda nunca en ningún sitio que no sean tus propios ordenadores, y no hay ningún servidor central que se pueda comprometer. Corre en macOS, Windows, Linux, FreeBSD, Solaris, OpenBSD y otras plataformas, y se administra mediante una interfaz web (comprobado en syncthing.net, el 9 de septiembre de 2026). El código tiene licencia MPL-2.0 (comprobado en github.com, el 9 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| Sin cuenta, sin proveedor, sin cuota | Los dos dispositivos tienen que estar despiertos para sincronizar |
| Los archivos se quedan como archivos normales en una carpeta normal | La configuración es por dispositivo, y el primero se lleva una tarde |
| Nada que volver a autorizar en seis meses | Sin historial: un mal cambio se propaga tan rápido como uno bueno |
| Funciona con una carpeta de cualquier cosa, no solo Markdown | Un teléfono es posible pero no es el caso fácil |

**Para quién es:** para alguien que quiere sus documentos en tres máquinas y no quiere ninguna empresa en el medio. Combínalo con un repositorio si además quieres historial, porque Syncthing es muy bueno haciendo que cada dispositivo esté de acuerdo y no tiene ninguna opinión sobre cuál versión era la correcta.

### HedgeDoc — la misma pestaña, en un servidor que controlas

Si lo que te gustaba de StackEdit era que fuera una pestaña del navegador, y lo que no te gustaba era de quién era esa pestaña, la opción autoalojada es HedgeDoc. Te deja crear notas de Markdown colaborativas en tiempo real, tiene licencia AGPLv3, cuenta con una guía de instalación para autoalojarlo y una instancia de demostración, y hay una alfa de HedgeDoc 2 (comprobado en github.com, el 9 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| Varias personas en un documento a la vez | Ahora administras un servidor, con copias de seguridad |
| Nada que instalar para quien lo use | Las notas viven en tu base de datos, así que exportar es un trabajo |
| La URL es tuya y no se va a ir a ningún sitio | Solo, es más infraestructura de la que necesita una persona sola |
| Un espacio de trabajo en el navegador cuyo almacenamiento puedes respaldar | No es una carpeta de archivos, salvo que lo exportes a una |

**Para quién es:** para un equipo que quiere redacción compartida más que archivos, y que tiene a alguien que ya administra cosas. Para una sola persona, esto cambia un problema de sincronización por uno de operaciones, y el segundo es más grande.

## Motivo dos: quieres los documentos como archivos

El segundo motivo no tiene nada que ver con que algo se haya roto. Es la incomodidad de no poder señalar tu trabajo. Una carpeta de archivos `.md` se puede listar, grepear, comprimir, copiar a una memoria y abrir con cualquier cosa, y leer dentro de cincuenta años. Un espacio de trabajo se puede exportar, y exportar es algo que tienes que acordarte de hacer.

Las tres opciones de abajo son aplicaciones normales sobre una carpeta normal, y cambiar entre ellas es gratis porque ninguna es dueña de los archivos. El intercambio es que ninguna sincroniza nada por su cuenta, que es el tema de la sección honesta más adelante. Para la experiencia de escritura en sí — cómo se distribuyen los paneles, qué se siente al escribir — la [comparación de editores de Markdown](/blog/best-markdown-editors) entra en más detalle del que sirve aquí; lo que sigue trata sobre almacenamiento.

### Obsidian — una carpeta, con una aplicación encima

Obsidian abre un directorio de archivos Markdown, lo llama bóveda, y añade enlaces, búsqueda y un sistema de plugins. Los archivos siguen siendo los archivos; borra Obsidian y la carpeta queda intacta. Su sitio indica que guarda tus notas localmente como archivos de texto plano en Markdown, que usa formatos de archivo abiertos para que nunca quedes atado, y que hay aplicaciones móviles junto a la de escritorio. Su página de licencia indica que Obsidian es gratis para cualquier uso, incluido personal, comercial y sin ánimo de lucro, y que las licencias comerciales son opcionales y ayudan a mantener el proyecto con apoyo de los usuarios (comprobado en obsidian.md, el 9 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| Archivos planos en disco, sin base de datos, sin paso de exportación | Su sintaxis de enlaces es propia, y no viaja bien a todos lados |
| Gratis para uso comercial, sin cuenta que crear | El ecosistema de plugins es una forma de perder una tarde |
| Escritorio y móvil, sobre la carpeta que le indiques | La sincronización es una decisión aparte que ahora es tuya |
| Búsqueda en todo lo que has escrito | Quiere ser tu sistema de notas entero, no un documento |

**Para quién es:** para alguien con un cuerpo de trabajo y no un documento — la persona que tiene doscientos documentos de StackEdit y ha empezado a notar que encontrar uno es más difícil que escribirlo.

### VS Code — la carpeta que ya tienes abierta

Si tus documentos viven junto al código, el editor ya está corriendo. Su documentación indica que VS Code soporta archivos Markdown de fábrica y que puedes alternar entre la fuente y una vista previa del archivo (comprobado en code.visualstudio.com, el 9 de septiembre de 2026), y su integración con Git responde la pregunta de la sincronización y la de las versiones a la vez, con la misma herramienta.

| A favor | En contra |
| --- | --- |
| Ya instalado, para casi cualquier desarrollador | Es un IDE, y se ve como uno mientras escribes prosa |
| Git, terminal y archivos en la misma ventana | Exportar necesita una extensión, y las extensiones varían |
| Gratis, e igual en Windows, macOS y Linux | Sin móvil |
| Las extensiones cubren linting, tablas y corrección ortográfica | El estilo de la vista previa no es el estilo de la exportación |

**Para quién es:** para desarrolladores, y para cualquiera cuyos documentos sean documentación. El README y las notas de versión pertenecen junto a lo que describen, que es un argumento que no tiene nada que ver con editores.

### Zettlr — archivos, con referencias adjuntas

Zettlr se define como un banco de trabajo de publicación integral, que cubre el proceso desde las notas iniciales hasta el envío a una revista o un manuscrito de libro, con integración de gestores de referencias y soporte de citas. Su página indica que es software libre y de código abierto, sostenido por donaciones, sin sincronización en la nube forzada y sin telemetría, y está disponible para Windows, macOS y Linux (comprobado en zettlr.com, el 9 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| Citas y bibliografías como función de primera clase | Orientado a la escritura académica, y hecho a su medida |
| Gratis, sin ningún componente en la nube del que optar por salir | Más pesado que un editor de notas si solo escribes notas |
| Archivos planos en disco, carpetas de proyecto, exportaciones | Su cadena de exportación espera que aprendas algo de Pandoc |
| Documentos largos y manuscritos son el caso de diseño | No es una herramienta para móvil |

**Para quién es:** para cualquiera cuyos documentos tengan fuentes. Si tu espacio de trabajo de StackEdit está lleno de expresiones LaTeX y citas a medio terminar, esto es lo más cercano a un hogar que también sea simplemente una carpeta.

## Motivo tres: quieres una aplicación, no una pestaña, y la quieres sin conexión

StackEdit anuncia escritura sin conexión, y la afirmación es cierta en el sentido concreto de que un navegador puede cachear una aplicación y dejarla correr sin red. Lo que la gente quiere decir con «sin conexión» suele ser más amplio que eso, y ahí es donde vive la frustración.

Un espacio de trabajo en el navegador puede funcionar sin conexión pero no es «local primero». La aplicación tiene que haberse cargado en ese navegador, en ese perfil, al menos una vez. Una ventana privada empieza sin nada. Un navegador distinto es una instalación distinta con un almacén distinto. Los datos del sitio borrados por ti, por una política, o por una extensión de privacidad bien intencionada, se llevan los documentos por delante salvo que ya hubiera un proveedor de sincronización conectado. Y una pestaña que no está abierta no es una aplicación: cerrarla por accidente es una sola pulsación, y restaurar la sesión es una operación distinta de abrir un archivo. Nada de esto es un defecto de StackEdit. Es lo que es el almacenamiento del navegador.

Una aplicación en disco cambia todo eso de un golpe. El documento es un archivo con una ruta. El editor está en el dock. Las copias de seguridad ya lo cubren, porque las copias de seguridad cubren el disco. Vale la pena nombrar dos opciones, y se colocan a los dos lados de un precio muy pequeño.

### Mark Text — gratis, MIT, y renderiza mientras escribes

Mark Text se describe como un editor de Markdown de código abierto simple, centrado en velocidad y usabilidad. Tiene modos de código fuente, máquina de escribir y foco, exporta a HTML y PDF, tiene licencia MIT, y corre en Linux, macOS y Windows (comprobado en github.com, el 9 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| Gratis bajo licencia MIT, sin cuenta | Comprueba la actividad reciente del repositorio antes de comprometerte con él |
| Renderiza mientras escribes, así que la sintaxis se queda al margen | Solo salida en HTML y PDF |
| Archivos locales, nada subido, nada que autorizar | Sin sincronización propia |
| Tres modos de escritura, incluida una vista de fuente pura | Sin versión móvil |

**Para quién es:** para alguien que sustituye la mitad de editor de StackEdit sin coste, en una máquina que administra.

### Typora — la de pago, y el menú de exportación es el motivo

Typora sustituye el Markdown por su renderizado mientras escribes, y su lista de exportación es la más amplia de cualquier editor de aquí. Su página indica un precio de 14,99 $ sin impuestos, una licencia que cubre hasta tres dispositivos, y una prueba gratuita de 15 días, y menciona exportación a PDF con marcadores además de docx, OpenOffice, LaTeX, MediaWiki y EPUB (comprobado en typora.io, el 9 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| Exporta a formatos que ningún editor de navegador alcanza | De pago, y solo para escritorio |
| Un solo panel: sin fuente y vista previa que mantener alineados | Ocultar la sintaxis le va bien a algunos escritores y a otros no |
| Archivos locales; la prueba dura lo bastante para decidir | No es un espacio de trabajo, ni un sincronizador |
| Los temas controlan el aspecto del HTML exportado | Un documento a la vez, por diseño |

**Para quién es:** para alguien que escribe casi todos los días y necesita que el documento salga como algo distinto de Markdown. Si la tarea recurrente es «manda esto como un archivo de Word», el menú de exportación se paga solo de inmediato.

También está la opción más pequeña en el navegador. Dillinger es el otro editor conocido dentro de una pestaña, y está pensado alrededor de un documento y no de un espacio de trabajo: un editor, una vista previa y un menú de exportación. Como sustituto de StackEdit solo tiene sentido si lo que querías era menos piezas móviles en vez de piezas distintas, y [la misma pregunta de cuatro vías se aplica a dejarlo](/blog/dillinger-alternatives).

## Motivo cuatro: querías una conversión, y la exportación es todo el trabajo

Aquí está el caso que no es una pregunta de editor en absoluto. Alguien te pidió el documento como una página web. Buscaste una alternativa a StackEdit porque StackEdit es donde está el documento, pero lo que necesitas no es un sitio nuevo para escribir — es un archivo que se abra correctamente en la máquina de otra persona. Eso es trabajo de un conversor, y es un minuto de trabajo en vez de una migración.

### Lo que en realidad es la salida en HTML de StackEdit

La página de StackEdit describe la salida como Markdown, HTML, o formateada mediante el motor de plantillas Handlebars (comprobado en stackedit.io, el 9 de septiembre de 2026). La parte de Handlebars es la que se le pasa a la gente: el envoltorio alrededor del documento renderizado lo defines tú, así que puedes producir el marcado que espere cualquier destino de publicación. También es una plantilla que tienes que escribir, y hasta que la escribas, lo que obtienes es lo predeterminado de la herramienta en vez de un documento diseñado para un destinatario.

Ese valor predeterminado es donde fallan tres cosas concretas, y las tres merece la pena comprobarlas antes de mandar nada:

1. **¿Es un documento o un fragmento?** Un renderizado de tu Markdown — encabezados, párrafos, tablas — no es lo mismo que un archivo con un doctype, un head y estilos. Abierto por su cuenta, un fragmento se renderiza como texto negro en la fuente predeterminada del navegador y a todo el ancho de la ventana, lo que es HTML válido y se ve roto para cualquiera que lo reciba.
2. **¿Le pide algo a la red?** Una hoja de estilos enlazada o una fuente web desde una CDN se ve bien en tu máquina, donde el navegador ya la tiene en caché, y se ve mal en un tren. También le dice al navegador del destinatario que haga una petición a otro sitio, algo que algunos destinatarios notan.
3. **¿Sobreviven las partes ingeniosas?** Las expresiones LaTeX, los diagramas UML y las partituras ABC se renderizan dentro del editor mediante bibliotecas que corren en la página. Si llegan al archivo exportado como imágenes, como marcado, o como el texto fuente que escribiste no es algo que se pueda asumir. Exporta un documento con cada uno y mira.

La propiedad que quieres es un archivo autocontenido: un documento, estilos inline, sin peticiones externas, así que se renderiza igual en un portátil sin conexión. [Lo que eso significa en detalle, y cómo verificarlo](/blog/self-contained-html-explained) es un tema aparte, y es la diferencia entre mandarle a alguien un documento y mandarle un documento más instrucciones.

### Un conversor, sin ningún espacio de trabajo atado

Para el caso de un solo documento, un conversor en el navegador es el camino más corto. Copia el Markdown fuera del editor, o descarga el archivo `.md`, y [convértelo en un archivo HTML autocontenido](/) — TransformPipe lo hace en el navegador, y sin sesión iniciada no se sube nada a ningún sitio, que para un documento que todavía no has publicado es justo el punto. No hay cuenta, ni espacio de trabajo, ni nada que sincronizar, porque la herramienta no intenta guardar nada.

La misma forma cubre los trabajos incómodos alrededor de los bordes de dejar un espacio de trabajo: un documento que hoy tiene que convertirse en una página para un compañero, una exportación que quieres comprobar antes de confiar en el resto, un archivo de otra persona que necesitas leer y renderizar sin adoptar su herramienta.

### Pandoc, cuando hay doscientos

Si la respuesta a «cuántos documentos» es un número en vez de «este solo», el trabajo se muda a la línea de comandos. Pandoc lee y escribe alrededor de cuarenta formatos, es gratis con licencia GPL, y va a envolver la salida en un documento completo en vez de en un fragmento cuando se lo pidas. Tampoco tiene ninguna opinión sobre tu espacio de trabajo, que es lo que quieres cuando la tarea es recorrer un directorio que salió de una exportación y convertirlo todo en otra cosa. [Convertir Markdown a HTML desde un terminal](/blog/markdown-to-html-from-the-command-line) es una pregunta más estrecha que todo el rango de Pandoc, y para algo puntual suele ser más herramienta de la que necesita el trabajo — pero para una migración es justo la cantidad correcta.

## Lo que de verdad vale un espacio de trabajo en el navegador con sincronización

Todas las opciones de arriba tienen un coste, y la versión honesta de este artículo dice con claridad que la forma de StackEdit es una buena forma. Es cómoda de una manera que «simplemente usa archivos» no lo es, y fingir lo contrario prepara a la gente para cambiar y luego arrepentirse en silencio.

**Otra persona resolvió la sincronización por ti.** Google Drive, Dropbox y GitHub, conectados y funcionando, son una pieza de ingeniería real que no tuviste que hacer. Muévete a una carpeta de archivos y eso se convierte en tu trabajo. Las opciones son un repositorio al que tienes que acordarte de hacer commit, una herramienta entre iguales que necesita dos dispositivos despiertos a la vez, o un cliente de nube sin historial que va a propagar felizmente un error a todas las máquinas que tengas. Cada una funciona. Ninguna está libre de esfuerzo, y el esfuerzo se repite.

**Sin instalación, en cualquier máquina.** Un portátil de trabajo bloqueado, un escritorio prestado, un ordenador de biblioteca: un espacio de trabajo en el navegador está disponible en todos ellos y un editor de escritorio no está disponible en ninguno. Si parte de por qué usas StackEdit es que no puedes instalar software, todo el grupo de escritorio de arriba deja de ser una opción, y las alternativas honestas son otra herramienta de navegador o una autoalojada.

**Un teléfono que funciona.** Los editores en el navegador se usan bien en un móvil de una forma que las aplicaciones de escritorio basadas en carpetas no logran, salvo que la aplicación tenga su propia app móvil y hayas resuelto por separado cómo llevar la carpeta al teléfono.

**Publicar era un solo botón.** StackEdit publica en Blogger, WordPress y Zendesk. Los archivos y un repositorio sustituyen eso por un pipeline que construyes tú. Mejor, con el tiempo — versionado, revisable, automatizado — y no es gratis. Es una tarde, y luego una superficie de mantenimiento.

**Marcharse también cuesta algo.** Un espacio de trabajo se tiene que vaciar documento a documento, o por cualquier vía masiva que exista, y los documentos que salen pueden no ser los documentos que recuerdas. La lista de sintaxis de StackEdit incluye Markdown Extra y CommonMark junto a GitHub Flavored Markdown, más LaTeX, UML y notación ABC. Parte de eso es estándar, parte es extensión, y las extensiones son justo lo que otra herramienta no va a reconocer: un diagrama se convierte en un bloque de código, una fórmula se convierte en signos de dólar y texto literal. Eso no es corrupción, es [la diferencia entre sabores](/blog/commonmark-gfm-and-the-flavours), y es la parte de una migración que lleva más tiempo del esperado. Convierte primero dos o tres de tus documentos más complicados, y decide con esos delante.

**Y lo que no cambia.** Tu Markdown es tu Markdown. Toda herramienta de aquí lee los mismos archivos, así que la decisión es reversible de una forma en que dejar un formato de documento propietario no lo es. Vale la pena decirlo porque rebaja lo que está en juego: estás eligiendo dónde viven los documentos y quién los mueve, no si vas a poder leerlos el año que viene.

## Cómo elegir

1. **Nombra en una frase lo que se rompió.** «Falló la sincronización», «quiero archivos», «quiero una aplicación», «necesito un archivo HTML» llevan a cuatro respuestas distintas, y elegir una herramienta antes de nombrar el motivo es la forma en que la gente termina migrando dos veces.
2. **Decide quién es responsable de la sincronización antes de decidir el editor.** Si la respuesta es «yo, con un repositorio», puedes usar cualquier editor de esta página; si la respuesta es «el servicio de otro», tus opciones realistas son un espacio de trabajo en el navegador o una aplicación que vende sincronización, y esa restricción conviene conocerla pronto.
3. **Comprueba si puedes instalar software siquiera.** En una máquina administrada, todo el grupo de escritorio no está disponible, y la comparación útil es entre herramientas de navegador y una autoalojada, no entre editores.
4. **Exporta primero tus tres documentos peores.** El que tiene una tabla, el que tiene una fórmula, el que tiene un diagrama. Si esos tres sobreviven, el resto también; si no sobreviven, lo has aprendido en diez minutos en vez de después de mover doscientos archivos.
5. **Abre el HTML exportado en otro sitio, con la red apagada.** Otro navegador, idealmente otra máquina. Esa única prueba atrapa fragmentos, estilos que faltan, fuentes de CDN y diagramas que no viajaron, y es la única prueba que refleja lo que ve el destinatario.
6. **Cuenta el trabajo recurrente, no la configuración.** Un repositorio cuesta un commit por sesión para siempre. Un cliente de nube no cuesta nada por sesión y no te da historial. Un espacio de trabajo cuesta una autorización cada pocos meses. Elige el coste que de verdad vas a seguir pagando.

## Conclusión

No hay una única alternativa a StackEdit porque StackEdit son cuatro herramientas en una pestaña, y casi nadie quiere sustituir las cuatro. Si lo que se rompió fue la sincronización, ponla por debajo de tus archivos con un repositorio o Syncthing y usa el editor que prefieras. Si quieres los documentos como archivos, Obsidian, VS Code y Zettlr son todos aplicaciones sobre una carpeta y no te cuestan nada probar en cualquier dirección. Si quieres algo en disco que se abra sin navegador, Mark Text es gratis y el menú de exportación de Typora vale su pequeño precio. Y si todo el asunto era un documento que alguien necesitaba como página web, no migres nada — convierte el archivo, comprueba que se abre con la red apagada, y [mándalo como una sola página autocontenida](/blog/share-a-markdown-document-as-a-link). La pregunta del espacio de trabajo puede esperar a una semana en la que no tengas nada urgente.

## Preguntas frecuentes

### ¿Cuál es la mejor alternativa a StackEdit?

Depende de qué parte de StackEdit estés sustituyendo. Para la mitad de espacio de trabajo más archivos, Obsidian sobre una carpeta sincronizada es la respuesta única más cercana; para la mitad de editor en escritorio, Mark Text es la opción gratis y Typora la de pago; para la pestaña del navegador en sí, un HedgeDoc autoalojado mantiene la forma y traslada el almacenamiento a un servidor que controlas.

### ¿Es StackEdit gratis y de código abierto?

Sí. Su sitio indica que tiene licencia Apache, y el repositorio tiene licencia Apache-2.0, descrito como un editor de Markdown de código abierto con todas las funciones basado en PageDown (comprobado en stackedit.io y github.com, el 9 de septiembre de 2026). Ser de código abierto es también la razón por la que existe la vía de autoalojarlo.

### ¿Puedo autoalojar StackEdit en vez de dejarlo?

El repositorio incluye un chart de Helm para desplegarlo en Kubernetes, con configuración para credenciales de Dropbox, Google, GitHub y WordPress, y un `stackedit.js` incrustable para meter el editor en tus propias páginas (comprobado en github.com, el 9 de septiembre de 2026). Si tu objeción es a la instancia alojada y no a la herramienta, ese es un cambio más pequeño que cambiar de editor.

### ¿Por qué mi documento de StackEdit dejó de sincronizarse con Google Drive?

Las causas habituales son una autorización que caducó o se revocó, un espacio de trabajo atado a una cuenta de proveedor distinta de la que tienes iniciada, o dos copias que se han separado y necesitan que una persona las reconcilie. El arreglo duradero no es un botón distinto sino una organización distinta: guarda el documento como archivo y deja que un repositorio o una herramienta de sincronización lo mueva.

### ¿Hay alguna alternativa a StackEdit que funcione sin conexión?

Cualquier editor de escritorio funciona sin conexión en el sentido completo, porque el archivo está en el disco y la aplicación no necesita red para abrirlo. Los editores de navegador funcionan sin conexión pero no son «local primero»: necesitan haberse cargado en ese perfil del navegador una vez, y borrar los datos del sitio elimina lo que no se haya sincronizado.

### ¿Cambiarán mis documentos si los saco de StackEdit?

El Markdown plano no. Las extensiones puede que sí: las expresiones LaTeX, los diagramas UML y la notación ABC están entre la sintaxis que maneja StackEdit, y una herramienta que no las implemente va a mostrar el texto fuente en vez de un renderizado. Mueve primero tu documento más complicado y mira cómo queda en la herramienta nueva antes de mover el resto.

### ¿Necesito un editor si solo quiero un archivo HTML?

No, y este es el error más habitual de toda esta búsqueda. Si la tarea es «convertir este Markdown en una página que pueda mandar», un conversor lo hace sin cuenta, sin espacio de trabajo y sin nada que sincronizar, y lo único que merece la pena comprobar después es que el archivo que te devuelve se abre correctamente con la red apagada.
