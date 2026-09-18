---
title: Cómo compartir un archivo Markdown con alguien que no usa Markdown
description: Formas honestas de compartir un archivo Markdown con un lector que no va a instalar nada —adjunto, Gist, repositorio, HTML, enlace— y qué exige revocarlo
date: 2026-09-05
tag: Publicación
keywords: compartir archivo markdown, publicar markdown online, convertir markdown en enlace, alojar un archivo markdown, enlace de solo lectura, mandar markdown a un cliente
---

Tienes un archivo `.md`. Lo escribiste tú, o guardaste [una respuesta que te dio un asistente de chat en Markdown](/blog/ai-output-to-a-shareable-page); a partir de aquí no cambia nada. Alguien necesita leerlo: un cliente, un jefe, un abogado, el albañil que te está haciendo un presupuesto. No va a instalar un editor de Markdown, no va a clonar un repositorio, y no debería tener que hacerlo. Cada forma de poner el documento delante de esa persona falla en algún punto, y el truco está en saber dónde, antes de pulsar enviar.

### Resumen rápido

Elige según qué le pase al archivo después de que llegue, no según qué sea más rápido para ti. Si el lector lo va a editar y devolvértelo, adjunta la fuente y dile qué es. Si necesita leerlo una vez, en el móvil, en una reunión, convierte el archivo en un **HTML autocontenido** y adjúntalo, o publícalo como un **enlace de solo lectura** — de cualquiera de las dos formas recibe un documento y no una fuente. Un enlace vale la pena solo si no le pide nada al lector: sin cuenta, sin instalación, sin script. Y un enlace solo es revocable de verdad si revocarlo mata la dirección misma, de inmediato, sin que el lector tenga que colaborar — algo que ningún adjunto puede lograr nunca, porque un adjunto es una copia.

## Qué hace la máquina del lector con tu archivo

La friccion no es Markdown. Markdown es un archivo de texto con puntuación, y se diseñó para que esa puntuación siguiera siendo legible cuando nada la renderiza. La fricción está en que los sistemas operativos, los clientes de correo y los teléfonos hacen cada uno una suposición distinta sobre una extensión de archivo para la que no tienen ninguna aplicación, y cada una de esas suposiciones se equivoca de una forma que no puedes ver desde tu lado.

Hay tres preguntas distintas escondidas en «¿puedes leer esto?». La primera es si el archivo se abre siquiera. La segunda es si se abre como un documento o como código fuente. La tercera es si lo que se abre es la versión que querías que vieran, hoy y dentro de seis meses. Pegar el texto responde a la primera y falla en la segunda. Adjuntar la fuente puede fallar directamente en la primera. Un enlace a un repositorio responde a las dos primeras y falla en silencio en la tercera, porque la dirección apunta a una rama que se mueve.

La última pregunta importa más de lo que la gente espera. La mayoría de los fallos al compartir ocurren después del momento de enviar. El cliente lo reenvía. El jefe vuelve al enlace tres meses después. Legal pide la versión que estaba vigente el día once. Sea lo que elijas, tiene que sobrevivir a que lo lea alguien a quien no le mandaste nada, en un momento que no elegiste.

## Comparativa rápida: la chuleta

| Opción | Mejor para | Capacidad clave | Precio |
| --- | --- | --- | --- |
| Pegar el texto en el mensaje | Una nota corta sin tablas ni imágenes | Funciona en cualquier cliente; nada que abrir | Gratis |
| Adjuntar el archivo `.md` | Un lector que lo va a editar y devolver | Sin pérdidas — exactamente los bytes que tienes | Gratis |
| Un Gist | Un fragmento o nota para alguien técnico | Renderiza GFM en una URL, conserva revisiones | Gratis, hace falta una cuenta de GitHub para crearlo |
| Un archivo en un repositorio | Un documento que vive junto al código | Se renderiza en su sitio, versionado con el proyecto | Gratis para repositorios públicos |
| Un enlace de almacenamiento en la nube | Un archivo que ya guardas en Drive, Dropbox u OneDrive | Un enlace, con acceso controlado por cuenta | Nivel gratis; planes de pago según almacenamiento |
| Un adjunto HTML autocontenido | Un documento terminado que debe abrirse sin conexión | Un archivo, estilos inline, no pide nada a la red | Gratis |
| Un enlace publicado de solo lectura | Alguien que lee una vez, en el móvil, sin cuenta | Una dirección sin instalación, y que se puede retirar | Gratis |
| Un PDF | Impresión, firma, un registro fijo | Cada lector ve páginas idénticas | Gratis desde el diálogo de impresión del navegador |
| Alojamiento estático o Pages | Un conjunto de documentos enlazados entre sí | Navegación, dominio propio, búsqueda | Gratis para repositorios públicos; hay que mantener un paso de build |

## Las formas de compartir un archivo Markdown

### Pegar el texto en el mensaje

La opción más rápida, y la que funciona en todas partes. Copia el archivo en el correo, en el chat o en el ticket, y el lector lo tiene sin abrir nada.

| A favor | En contra |
| --- | --- |
| Sin adjunto, sin enlace, sin instalar nada — ya está delante de la otra persona | La sintaxis llega como puntuación, no como formato |
| Se puede citar y buscar dentro de su propio cliente de correo | Las tablas, imágenes y código se pierden o se estropean |
| Nada que revocar, porque nada se alojó | Los documentos largos son ilegibles como un muro de texto |
| Funciona cuando un filtro de correo elimina los adjuntos | Cada cliente aplica sus propias reglas parciales de Markdown |

**Precio:** gratis.

**Lo que le pasa de verdad al texto**

- Los encabezados llegan como `## Alcance`, porque ningún cliente de correo parsea los encabezados ATX
- Slack no tiene sintaxis de encabezado ni de tabla, así que ambos llegan como caracteres literales, mientras que `*Alcance*` sale en negrita — un solo asterisco es negrita ahí, no cursiva
- [Las tablas salen peor que nada](/blog/markdown-tables-that-survive-conversion): la fila de guiones que marca la alineación no significa nada para una herramienta que no la parsea, así que el lector recibe un párrafo de barras verticales
- Las imágenes son la línea cruda `![alt](ruta)`, y las rutas relativas nunca iban a resolverse en el cliente de otra persona de todas formas
- Algunos clientes autoformatean mientras pegas, lo que es peor que ninguno: la mitad del documento se renderiza y la mitad no, y no puedes saber cuál desde la carpeta de enviados

**¿Para quién es?** Para cualquiera que mande algo corto, definitivo y casi todo prosa — un párrafo de estado, una decisión, tres puntos. Cualquier cosa más larga que una pantalla, o con una tabla dentro, quiere una de las opciones de abajo.

### Adjuntar el archivo `.md`

Honesto y sin pérdidas. El destinatario recibe exactamente los bytes que tienes, que es la única opción de esta página que le permite cambiar una palabra y devolvértelo.

| A favor | En contra |
| --- | --- |
| Byte por byte, así que va y vuelve por edición sin pérdidas | Nada en una máquina estándar tiene registrada la extensión `.md` |
| Pequeño, texto plano y comparable | En un móvil suele no abrirse en absoluto |
| Sin alojamiento, sin cuenta, sin ningún servicio de por medio | Quien lo abra está leyendo la fuente, no un documento |
| La opción correcta cuando el archivo es la entrega | No puedes retirarlo, nunca |

**Precio:** gratis.

**Lo que pasa de verdad en la máquina del lector**

- Un doble clic en Windows o macOS abre un editor de código, un diálogo de «elegir una aplicación», o nada — la extensión no tiene ningún manejador por defecto
- Los clientes de correo a menudo lo previsualizan en línea como texto plano, que es el mejor resultado posible y queda totalmente fuera de tu control
- Algunos filtros de correo tratan las extensiones desconocidas como sospechosas, así que el adjunto puede quedar en cuarentena sin que ninguno de los dos se entere
- Renombrarlo a `.txt` arregla la apertura y pierde la asociación con Markdown, lo que importa si lo van a editar
- Si lo abren, las imágenes y los enlaces relativos apuntan a archivos que no tienen, así que el documento queda con agujeros

Si el lector tiene ganas pero se queda atascado, [abrir un archivo `.md`](/blog/how-to-open-md-file) cubre lo que funciona en una máquina sin nada especial instalado. Decir qué es el archivo cuando lo mandas evita casi toda la confusión: «esto es un archivo de texto — ábrelo en el Bloc de notas o TextEdit, o simplemente léelo en la vista previa» es una sola frase.

**¿Para quién es?** Para cualquiera cuyo lector vaya a editar el documento, y para cualquiera cuyo lector sea suficientemente técnico como para que la fuente no sea un insulto. Es la opción equivocada para un cliente que pidió ver una propuesta.

### Un Gist

Un Gist es un pequeño documento alojado con una URL. Renderiza GitHub Flavored Markdown, así que la dirección del Gist ya es una página legible, y conserva un historial de revisiones porque un Gist es, por debajo, un repositorio Git.

| A favor | En contra |
| --- | --- |
| Renderiza GFM correctamente — tablas, listas de tareas, código con vallas | El lector aterriza dentro de una interfaz de desarrollador |
| Una URL corta, sin instalar nada para el lector | Crear uno necesita una cuenta de GitHub, aunque leerlo no |
| Se conservan las revisiones, así que puedes señalar una versión concreta | Un Gist secreto no está listado, no es privado: cualquiera con la URL puede leerlo |
| Editable después, en el navegador | Borrarlo es la única forma de retirarlo, y es permanente |

**Precio:** gratis. Leerlo no necesita cuenta; crearlo necesita una cuenta de GitHub, que es gratis.

**Lo que ve alguien que no es desarrollador**

- Una página con tu documento en el centro y una barra de herramientas de Raw, Blame, History y un botón de fork alrededor
- Una caja de «clonar esto» que ofrece una dirección HTTPS y otra SSH, ninguna de las cuales significa nada para esa persona
- Campos de comentario debajo, que parecen una invitación a una conversación que quizá no quieras
- Tu avatar y usuario de GitHub como firma, que está bien para un README y resulta raro en un presupuesto de obra
- En un móvil, el marco de la interfaz se lleva una buena parte de la pantalla antes de que empiece el documento

**¿Para quién es?** Para alguien que manda un fragmento, un archivo de configuración, un reporte de error o una nota a otro desarrollador. Es una buena herramienta que se usa constantemente con el público equivocado: el renderizado es correcto y el entorno está mal para cualquiera que no viva ya en GitHub. Y «secreto» es la palabra que engaña a la gente: significa que la URL no está indexada ni listada, no que el acceso esté controlado.

### Un archivo en un repositorio

Si el documento pertenece a un proyecto, ponlo junto al código. GitHub, GitLab y Bitbucket renderizan Markdown en la vista de archivo, así que la URL del archivo ya es una página.

| A favor | En contra |
| --- | --- |
| Versionado junto con el código que describe | Un repositorio privado le pide al lector que inicie sesión |
| Revisable — los cambios llegan por una pull request | Uno público muestra tu texto dentro de una interfaz pensada para desarrolladores |
| Renderiza GFM, tablas y listas de tareas incluidas | El enlace apunta a una rama, así que se mueve |
| Gratis, y ya forma parte del flujo de trabajo | El historial conserva cada versión anterior, incluida la que te arrepientes |

**Precio:** gratis para repositorios públicos; los repositorios privados están incluidos en los planes gratuitos de los tres, con límites y planes de pago descritos en sus propias páginas de precios.

**Los detalles que deciden esto**

- El enlace por defecto es `/blob/main/doc.md`, que resuelve a lo que diga `main` hoy y no a lo que decía cuando mandaste el enlace
- Pulsar `y` en GitHub reescribe la dirección para fijar el commit, lo que arregla el blanco móvil pero no la interfaz alrededor
- La vista Raw sirve el archivo como texto plano, así que es una descarga o un muro de fuente, no un documento
- Las rutas relativas de imágenes y enlaces sí se resuelven dentro de la vista del repositorio, que es justo por qué se rompen en cuanto el archivo se lee en otro sitio, tanto en un correo como en una página convertida
- Borrar el archivo lo elimina del árbol actual y no del historial, así que no es una retirada en ningún sentido que aceptaría un abogado

**¿Para quién es?** Para equipos. Este es el hogar correcto para [documentación que vive en el repositorio](/blog/documentation-that-lives-in-the-repo), donde el público ya tiene cuenta y el historial de versiones es el objetivo. Es el hogar equivocado para un presupuesto que le mandaste a un cliente el martes pasado.

### Un enlace de almacenamiento en la nube

Ya guardas archivos en Drive, Dropbox o OneDrive, y cada uno te va a dar un enlace para compartir cualquier cosa de la carpeta. Es el camino de menor resistencia, y lo que recibe el lector al otro lado es menos predecible que en las demás opciones de aquí.

| A favor | En contra |
| --- | --- |
| Ninguna herramienta nueva: el archivo ya está ahí | Lo que hace la vista previa con `.md` varía según el proveedor y cambia sin avisar |
| Control de acceso por cuenta, que es control de acceso real | «Cualquiera con el enlace» y «personas concretas» se confunden fácil y se pulsan mal fácil |
| Revocar el enlace funciona de verdad | Un muro de inicio de sesión delante de un documento que querías que leyera cualquiera |
| La caducidad y las contraseñas existen en algunos planes | A menudo el lector solo obtiene un botón de descarga |

**Precio:** nivel gratis con cualquier cuenta de consumidor. Los planes de pago se cobran por almacenamiento, y controles de enlace como la caducidad y las contraseñas están en niveles de pago con algunos proveedores — comprueba la página de precios del proveedor antes de prometerle a un cliente un enlace con caducidad.

**Qué comprobar antes de mandar uno**

- Abre el enlace en una ventana privada. Es la única forma de saber si tu lector se encuentra con un muro de inicio de sesión, porque tu propio navegador ya está autenticado
- Confirma si la vista previa renderiza el Markdown, muestra la fuente como texto plano, u ofrece una descarga — los tres comportamientos existen, y ninguno se anuncia
- Comprueba si el enlace permite editar. Lo predeterminado no siempre es de solo lectura, y la diferencia importa en un documento con un precio dentro
- Recuerda que el archivo sigue viviendo en tu carpeta. Renombrarlo o moverlo puede romper el enlace que ya mandaste

**¿Para quién es?** Para cualquiera que comparte con un grupo con nombre dentro de una organización que ya usa ese proveedor, donde iniciar sesión no es un obstáculo y las listas de acceso son el objetivo. Para un desconocido que va a leer una vez en el móvil, es más fricción de la que necesita el trabajo.

### Un archivo HTML autocontenido como adjunto

Convierte el Markdown en un único archivo HTML con sus estilos inline, y adjunta eso. El lector hace doble clic y obtiene un documento terminado en el navegador que ya tiene, y [lo que tiene que contener un archivo para comportarse así, cuánto cuesta en bytes incrustar y cómo demostrar que no descarga nada](/blog/self-contained-html-explained) merece leerse antes de confiar en el formato.

| A favor | En contra |
| --- | --- |
| Se abre en cualquier máquina, sin instalación y sin cuenta | Sigue siendo un adjunto, así que los filtros de correo siguen aplicando |
| Funciona con la red apagada, en un tren, en un sótano | Más grande que la fuente, porque el estilo viaja con él |
| Se imprime y exporta a PDF con el propio diálogo del navegador | No puedes retirarlo — el lector tiene una copia |
| Nada está alojado, así que nada puede caerse ni ser revocado bajo sus pies | No es editable de una forma que vayan a disfrutar |

**Precio:** gratis.

**Por qué «autocontenido» es la palabra que carga el peso**

- Un documento completo implica doctype, `<head>` y un bloque `<style>` inline — no un fragmento de etiquetas `<h1>` y `<p>`, que se renderiza como texto negro sin estilo a todo lo ancho de la ventana
- Sin peticiones externas: sin hoja de estilos de CDN, sin fuente web, sin analítica. Un archivo que descarga su propio estilo se ve roto sin conexión y le cuenta a quien lo abra algo sobre por dónde ha pasado
- Las imágenes tienen que estar incrustadas y no enlazadas, o el documento llega con agujeros en una máquina que no tiene tu carpeta
- El HTML crudo es legal en Markdown, así que un archivo convertido puede llevar una etiqueta `<script>` que llegó con la fuente. Si el Markdown no lo escribiste tú, [sanitizar no es opcional](/blog/sanitising-markdown-safely) antes de enviarle el resultado a otra persona
- El archivo es el registro completo. Seis meses después se abre exactamente igual que el día que lo mandaste, que es la propiedad que ningún enlace tiene

**¿Para quién es?** Para cualquiera cuyo lector necesite un documento y no una página, y para cualquiera que quiera que el envío sea definitivo. Propuestas, notas de traspaso, actas de reunión, cualquier cosa que se vaya a archivar. También es la respuesta cuando la organización del destinatario bloquea dominios desconocidos y abre adjuntos sin problema.

### Un enlace publicado de solo lectura

Renderiza el Markdown una vez, alójalo, y pasa la dirección. Nada que descargar, nada que instalar, y se lee como un documento en el móvil dentro de un ascensor.

| A favor | En contra |
| --- | --- |
| Fricción cero para el lector: tocar y leer | El documento depende de que un servicio esté funcionando |
| Puedes corregir una errata después de enviarlo | El lector no tiene copia, así que nada sobrevive a la revocación |
| Revocable, si el enlace está construido para eso | Reenviarlo es trivial e invisible para ti |
| Se renderiza bien en pantalla pequeña | El filtro de correo de una organización puede reescribir o bloquear la URL |

**Precio:** gratis.

**Lo que tiene que hacer el mecanismo**

- Servir el documento renderizado, no la fuente Markdown, y no un visor que necesite un plugin
- Llevar un token no adivinable en la dirección, y quedarse fuera de los índices de búsqueda
- Funcionar sin sesión, en la primera visita, en un móvil, en un portátil corporativo con una política de navegador agresiva
- Renderizar en el servidor o entregar el HTML ya terminado, para que un lector con los scripts bloqueados siga viendo el documento
- Dejarte matar la dirección por tu cuenta, sin pedirle nada al lector

TransformPipe cubre las dos formas de esto. Suelta el archivo `.md` en transformpipe.com y descarga un archivo autocontenido; o inicia sesión y publícalo como una página de solo lectura en `/s/<token>`. Revocar retira el token, así que un enlace que ya mandaste deja de funcionar. Desde un terminal es un solo comando:

```bash
node cli/tp.mjs login tp_live_…        # una vez, con una clave de API
node cli/tp.mjs push proposal.md --share link
```

**¿Para quién es?** Para cualquiera que manda un documento a alguien que lo va a leer una vez y nunca lo va a archivar. También para cualquiera que espera revisarlo: la dirección se mantiene mientras el contenido mejora, que es lo único que un adjunto no puede hacer.

### Un PDF

Convierte a HTML, ábrelo, imprime a PDF. Son dos pasos en vez de uno, y compra una propiedad que ninguna otra opción tiene: cada lector ve las mismas páginas en el mismo orden.

| A favor | En contra |
| --- | --- |
| Se abre en cualquier sitio, móviles incluidos | Ancho de página fijo, así que se lee mal en pantalla pequeña |
| Paginación, que importa para firma y citación | El reajuste desaparece: las tablas largas se cortan mal entre páginas |
| Aceptado por procesos que no van a aceptar un enlace | Editarlo es otra herramienta y una experiencia peor |
| Un registro fijo: la página 4 es la página 4 para todos | Más grande que el HTML del que viene |

**Precio:** gratis desde el propio diálogo de impresión del navegador, que incluye cualquier navegador moderno.

**Detalles que conviene saber**

- La hoja de estilos de impresión decide el resultado. Un documento que se ve bien en pantalla puede perder los bordes de los bloques de código y las reglas de las tablas en papel
- Los enlaces sobreviven como anotaciones clicables en la salida PDF de la mayoría de los navegadores, y los pies de página pueden añadir la URL de origen, lo que es útil o ruido según el documento
- Los encabezados suelen convertirse en marcadores de PDF solo si el conversor los emite a propósito; la vía de impresión del navegador, en general, no lo hace
- El texto sigue siendo seleccionable, así que el documento es buscable y citable — una captura de pantalla no es un sustituto

**¿Para quién es?** Para cualquiera que manda algo hacia un proceso: un contrato, una factura, una presentación, cualquier cosa que se vaya a firmar o archivar. No es la respuesta correcta para un documento que esperas revisar dos veces la semana que viene.

### Alojamiento estático o Pages

GitHub Pages, GitLab Pages y cualquier generador de sitios estáticos convierten Markdown a HTML y lo ponen en la web con navegación y un dominio propio. Ninguno de ellos es una forma de compartir un solo archivo.

| A favor | En contra |
| --- | --- |
| Navegación, búsqueda y enlaces cruzados entre muchos documentos | Un archivo de configuración, un tema y un paso de build que mantener |
| Un dominio propio, que se lee como tuyo y no como de un proveedor | Público por defecto: el control de acceso necesita planes de pago o un proxy delante |
| Rápido, cacheado y gratis de servir | Publicar es un despliegue, así que arreglar una errata es un commit y una espera |
| Bien documentado y muy desplegado | Despublicar es otro despliegue, no un interruptor |

**Precio:** gratis para repositorios públicos en los principales proveedores; publicar desde un repositorio privado exige uno de sus planes de pago, descritos en sus propias páginas de precios.

**¿Para quién es?** Para cualquiera que publica un conjunto de documentos que se enlazan entre sí y espera que los encuentren. Si tienes un archivo y una persona a la que mandárselo, la sobrecarga es enorme y el modelo de acceso es el equivocado — un alojamiento estático publica para todo el mundo, y tú querías publicar para un lector.

## Lo que un enlace para compartir debería pedirle al lector, y lo que no

La mayor parte de la decepción al compartir viene de enlaces que le piden algo al lector. Mandas una dirección esperando que aparezca un documento, y lo que aparece es un formulario. Desde tu lado se veía bien, porque tu navegador ya estaba con la sesión iniciada.

Un enlace de solo lectura debería:

- [x] abrirse en cualquier navegador, sin cuenta, sin aplicación y sin extensión
- [x] mostrar el documento renderizado, no la fuente Markdown
- [x] leerse bien en un móvil, a un tamaño sensato, sin necesidad de hacer zoom
- [x] funcionar con los scripts bloqueados, porque muchos navegadores corporativos los bloquean
- [x] ser revocable solo por ti, en cualquier momento, sin la ayuda del lector
- [x] llevar una dirección que no se pueda adivinar y que no esté indexada

No debería:

- [ ] poner un muro de inicio de sesión delante de un documento que querías que leyera cualquiera
- [ ] pedir una dirección de correo antes de mostrar nada
- [ ] exigir un navegador concreto, o una aplicación para una «mejor experiencia»
- [ ] traer fuentes, estilos o analítica de otros hosts, lo que le cuenta a terceros quién está leyendo qué
- [ ] romperse cuando el lector lo reenvía a un compañero, que es justo lo que va a hacer

Hay un caso intermedio que merece nombrarse. Cuando un documento es de verdad confidencial, una lista de destinatarios es el control correcto: solo los lectores nombrados pueden abrirlo, y tienen que iniciar sesión para demostrar quiénes son. Eso es un mecanismo distinto, no un enlace más estricto. Un enlace que cualquiera puede abrir sirve para una propuesta, una especificación o las actas de una reunión; una lista de destinatarios sirve para cualquier cosa que te disgustaría ver reenviada. Decidir cuál necesitas lleva diez segundos y evita el fallo donde un enlace «privado» resulta ser un enlace público que nadie ha encontrado todavía.

## Lo que tiene que hacer revocar para merecer llamarse revocar

Todo servicio con un botón de compartir dice que el enlace se puede revocar. La mayoría dice algo más débil de lo que asumes. Revocar solo es revocar si se cumple todo lo siguiente.

**Mata la dirección, no el listado.** Quitar un documento de tu propia lista de elementos compartidos mientras la URL sigue resolviendo es limpieza, no revocación. Pruébalo abriendo la dirección en una ventana privada después de revocar; si el documento aparece, no ha pasado nada.

**Hace efecto ahora.** Una copia en caché servida durante otra hora es un documento todavía legible durante otra hora. Pregunta cuál es el tiempo de vida de la caché, y trata «con el tiempo» como una función distinta.

**No necesita nada del lector.** Cualquier mecanismo que dependa de que el destinatario borre un archivo, vacíe una carpeta o pulse «quitar acceso» no es revocación — es una petición.

**No se puede desactivar por otra persona.** Si un compañero con acceso a la misma carpeta puede volver a compartir el archivo, la dirección que mataste vuelve bajo otro nombre.

**Dice qué no cubre.** Revocar no puede recuperar una copia. Cualquier cosa descargada, impresa, capturada en pantalla, reenviada como adjunto o indexada en un buscador queda fuera de alcance para siempre. Un enlace revocado ayer todavía puede existir en un proxy de caché dentro de la empresa de alguien.

Ese último punto es el límite honesto de toda la idea. La revocación controla las lecturas futuras de quien conservó el enlace; no controla nada sobre quien conservó el documento. Si el requisito es «esto tiene que dejar de existir», ningún mecanismo para compartir de esta página lo entrega, y no deberías decirle a un cliente lo contrario.

## Dónde falla la opción obvia y qué cuesta

La opción obvia, en cuanto sabes que un enlace es posible, es mandar siempre un enlace. Es un toque para el lector y se puede corregir después de enviarlo. Esto es lo que cuesta.

**Un enlace es una dependencia.** El documento es legible mientras un servicio esté en pie, un dominio esté renovado y una cuenta esté al día. Un adjunto no tiene ninguna condición así. Para cualquier cosa con vida larga — un contrato, una especificación que alguien vaya a citar dentro de dos años — la copia es el artefacto más seguro, y el enlace es la comodidad.

**Un enlace convierte el documento en un blanco móvil.** La capacidad de corregir una errata después de enviarlo es la misma capacidad de cambiar un número después de un acuerdo. Si el documento es un registro, eso es un defecto y no una función, y el arreglo es una versión fijada o un adjunto.

**Un enlace falla dentro de la infraestructura de otros.** Los sistemas de correo corporativos reescriben URLs para escanearlas, los clientes de chat las despliegan en vistas previas que no pediste, y algunos filtros simplemente rechazan dominios desconocidos. Nada de eso es visible desde el lado del envío. Los adjuntos tienen sus propios problemas de filtro, pero fallan de forma ruidosa.

**Un enlace filtra la lectura.** Cualquier documento alojado puede contarle a su propietario cuándo se abrió. Eso a veces es exactamente lo que quieres y a veces es algo que no te gustaría que te hicieran a ti. Si el servicio también carga fuentes o analítica de otro sitio, la visita del lector se revela a terceros que ninguno de los dos elegisteis.

**Un enlace no es un documento para el lector.** No lo puede archivar, anotar, ni encontrar en tres meses buscando en su correo. Bastantes lectores, dado un enlace, intentan de inmediato guardar la página como archivo — mal. Manda el archivo si eso es lo que van a hacer con él.

El fallo simétrico también merece nombrarse. Adjuntar siempre un archivo convertido significa que cada corrección es un correo nuevo, ningún lector está nunca seguro de cuál es la versión actual, y el documento se te va de las manos en cuanto llega. Los dos modos de fallo son simétricos, y por eso la respuesta está en mirar el documento y no en elegir un favorito.

## Cómo elegir

1. **Parte de lo que pasa después de que llegue.** Si lo van a editar, adjunta la fuente; cualquier otra cosa y estarán editando una vista renderizada, que van a hacer mal y a devolver. Si lo van a archivar, manda un archivo. Si lo van a leer una vez, manda un enlace.
2. **Cuenta lo que tiene que hacer el lector.** Cada instalación, cuenta y diálogo entre la dirección y el documento pierde una fracción de tus lectores, y esa fracción es la más alta precisamente entre quienes no querían leerlo desde el principio. Cero pasos es alcanzable, así que trata un paso como un coste.
3. **Decide si el documento tiene permitido cambiar.** Un enlace que se mantiene actualizado es correcto para un documento vivo y equivocado para un registro. Si alguien puede necesitar demostrar qué decía en una fecha determinada, manda un adjunto o fija una versión, porque «lo actualicé desde entonces» no es una respuesta.
4. **Comprueba si te disgustaría verlo reenviado.** Si la respuesta es sí, una URL no adivinable no es el control que necesitas — una lista de destinatarios lo es. Decidir esto bien al principio es mucho más barato que descubrirlo con una captura de pantalla en el hilo de otra persona.
5. **Abre tu propio enlace compartido en una ventana privada antes de mandarlo.** Esto atrapa el muro de inicio de sesión, la vista previa que solo descarga, la imagen que falta y el enlace relativo roto, todo en menos de un minuto, y es la única forma de ver lo que ve tu lector en vez de lo que muestra tu sesión autenticada.

## Conclusión

Compartir un archivo Markdown no es un problema de conversión, es una pregunta sobre el lector. Cuando la respuesta es «quieren imprimirlo», [las rutas de PDF están aquí](/blog/markdown-to-pdf). La pregunta: qué va a hacer su máquina con lo que le mandas, y qué va a hacer esa persona con ello después. Corto y definitivo, pégalo. Pensado para editarse, adjunta la fuente y di qué es. Parte de un proyecto, guárdalo junto al código. Pensado para leerse una vez por alguien que nunca ha oído hablar de Markdown, conviértelo en un archivo HTML autocontenido y adjúntalo, o publícalo como un enlace de solo lectura y sé honesto contigo mismo sobre lo que esa revocación puede y no puede deshacer. [TransformPipe convierte Markdown en un documento HTML completo en el navegador](/), gratis, sin subir nada mientras no tengas la sesión iniciada — y luego, con el enlace o el archivo en la mano, ábrelo en una ventana privada y léelo como lo va a leer tu lector.

## Preguntas frecuentes

### ¿Cómo comparto un archivo Markdown con alguien que no tiene un editor de Markdown?

No le mandes Markdown. Convierte el archivo en un HTML autocontenido y adjúntalo, o publícalo como un enlace de solo lectura — las dos opciones le dan un documento renderizado en el navegador que ya tiene. Manda la fuente `.md` solo cuando necesite editarla y devolvértela.

### ¿Puedo compartir un archivo `.md` como enlace sin crear una cuenta?

Puedes convertirlo sin cuenta, y alojarlo en general necesita una. La conversión en el navegador produce el archivo HTML sin ningún registro, y ese archivo se puede adjuntar a un correo de inmediato. Publicar una URL implica que algo tiene que alojarla, que es donde entra una cuenta — pero el lector sigue sin necesitar ninguna.

### ¿Es un Gist una buena forma de compartir un documento con alguien que no es desarrollador?

Renderiza el Markdown correctamente y lo rodea de una interfaz de desarrollador: Raw, Blame, History, una caja de clonado y campos de comentario. Para un compañero que usa GitHub todos los días eso es invisible; para un cliente resulta confuso. Recuerda también que un Gist secreto está sin listar y no es privado, así que cualquiera con la URL puede leerlo.

### ¿Es seguro mandarle a alguien un archivo HTML convertido?

Lo es, siempre que la conversión haya sanitizado la fuente. Markdown permite HTML crudo, así que un archivo `.md` que no escribiste tú puede llevar una etiqueta `<script>` o un manejador `onerror` directo hasta la página convertida. Para tus propias notas no importa; para un archivo que llegó de otro sitio, comprueba que el conversor sanitiza antes de reenviar el resultado.

### ¿Qué pasa de verdad cuando revoco un enlace para compartir?

Como mínimo, la dirección debería dejar de resolver de inmediato, para todos, sin que el lector tenga que hacer nada. No recupera copias: cualquier cosa descargada, impresa, capturada en pantalla o guardada en caché por un intermediario sigue siendo legible. La revocación controla las visitas futuras de quien conservó el enlace, y nada sobre quien conservó el documento.

### ¿Debería mandar un PDF en vez de un enlace?

Si el documento va hacia un proceso — firma, presentación, archivo — sí, porque un PDF es un registro fijo que todos ven igual. Si se va a leer una vez en el móvil y posiblemente se va a revisar la semana siguiente, no: las páginas fijas se leen mal en pantalla pequeña y cada revisión es un archivo nuevo.

### ¿Sobrevivirán mis tablas e imágenes al compartirlas?

Las tablas sobreviven si el renderizador hace GitHub Flavored Markdown, y no sobreviven al pegarse en un mensaje, donde la fila de alineación se convierte en una línea de guiones. Las imágenes sobreviven solo si están incrustadas en la salida o alojadas en una dirección absoluta, porque una ruta relativa apunta a una carpeta que el lector no tiene.
