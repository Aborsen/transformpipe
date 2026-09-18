---
title: "HTML autocontenido explicado: qué es en realidad un documento HTML de un solo archivo"
description: Qué contiene un documento HTML de un solo archivo, cuánto cuesta en bytes incrustar imágenes, cómo probar que no pide nada a la red y cuándo es el formato equivocado
date: 2026-08-14
tag: Publicación
keywords: html autocontenido, html de un solo archivo, css incrustado en html, imagenes en base64 html, documento html sin conexion, adjuntar html en un correo, archivar una pagina web
---

Un colega te manda un archivo HTML. Lo abres en un tren, o en un portátil que lleva desde el viernes sin red, y pasa una de dos cosas. O te encuentras el documento — encabezados, tablas, imágenes, todo — o te encuentras un Times New Roman negro a todo lo ancho de la ventana, con tres iconos de imagen rota donde iban los diagramas. Los dos archivos son HTML válido. Solo uno de ellos es un documento.

La diferencia está en si el archivo necesita algo más para ser él mismo. Una página en la web es normalmente un índice: nombra una hoja de estilos, algunas fuentes, un puñado de imágenes, y el navegador va a buscar cada una por turno. Eso funciona de maravilla cuando la página vive en una dirección y el lector tiene conexión. Falla por completo cuando la página es un adjunto en un buzón, un archivo dentro de un archivo comprimido, o una prueba en una carpeta que alguien va a abrir dentro de cuatro años.

### Resumen rápido

Un documento HTML de un solo archivo es un archivo `.html` que se renderiza correctamente con la red desconectada, porque todo lo que necesita está dentro: la hoja de estilos es un bloque `<style>` inline en vez de un `<link>`, las imágenes son data URIs en vez de rutas, y no se pide ninguna fuente, script ni rastreador desde ningún sitio. Verifícalo desconectando la conexión, abriendo el archivo y comprobando que el panel de red no registra nada — una petición para el propio archivo cuando se sirve, y cero después de eso. Es el formato correcto para archivar, para adjuntar en un correo y para entregar un documento a alguien fuera de tu organización, porque sobrevive al viaje y no le cuenta nada sobre por dónde ha pasado. Los costes son reales y merece la pena decirlos: el archivo es aproximadamente un tercio más grande que sus imágenes, nada dentro de él se puede cachear, y no puedes arreglar una errata sin reenviar el archivo entero.

## Qué significa «HTML de un solo archivo», con precisión

La expresión se usa a la ligera, así que conviene fijarla. Un documento HTML de un solo archivo hace una sola promesa: abierto desde un disco local, sin ningún tipo de red, se renderiza como su autor lo pensó. Esa promesa tiene tres consecuencias, y son la definición completa.

Cada regla de estilo está dentro del documento. No hay ningún `<link rel="stylesheet">` que apunte a `styles.css` en la carpeta de al lado, ni ninguno que apunte a una CDN. Las reglas están en un elemento `<style>` dentro del head, o como atributos `style=` en los elementos, o en ambos.

Cada imagen está dentro del documento. No `src="diagrama.png"`, que es una ruta que se resuelve según dónde haya puesto el lector el archivo, ni `src="https://…/diagrama.png"`, que es una petición. Los bytes en sí se codifican dentro del atributo `src` como una data URI, o la imagen es SVG inline, que es marcado y no una descarga.

No se pide nada más en absoluto. Ninguna fuente web, ningún píxel de analítica, ningún conjunto de iconos, ningún jQuery de una CDN «solo para el índice». Esta es la cláusula que se rompe por accidente, y es la que más importa, porque una sola etiqueta de enlace basta para convertir un documento autocontenido en una página que informa en silencio cada vez que se abre.

Lo que un documento HTML de un solo archivo *no* promete es que sus enlaces funcionen. `<a href="https://ejemplo.com/spec">` sigue siendo una dirección en internet, y así debe ser — un documento que arranca sus propias citas es peor, no mejor. La autocontención es una promesa sobre la presentación, no sobre el mundo exterior al que se refiere tu prosa.

## Comparativa rápida: la chuleta

| Formato | Qué es | Necesita la red | El lector puede editar | Coste principal |
| --- | --- | --- | --- | --- |
| HTML de un solo archivo | Un archivo `.html`, estilos inline, imágenes como data URIs | No | Solo editando el marcado | Archivo más grande, nada cacheable |
| HTML con una carpeta de recursos | Un archivo `.html` junto a `styles.css` y un directorio `images/` | No, si la carpeta viaja con él | Solo editando el marcado | Se rompe en cuanto se mueve o se manda por correo un solo archivo |
| HTML que enlaza una CDN | Un archivo `.html` que descarga fuentes y CSS al abrirse | Sí | Solo editando el marcado | Se ve mal sin conexión; filtra información en cada apertura |
| MHTML (`.mhtml`) | Una página y sus recursos en un contenedor MIME | No | No | Chrome y Edge lo escriben; Firefox no lo abre sin un complemento |
| Archivo web de Safari (`.webarchive`) | El contenedor equivalente de Apple | No | No | Prácticamente solo para Safari |
| PDF | Un maquetado fijo con las fuentes incrustadas | No | No, sin un editor de PDF | Se reajusta mal en un teléfono; la extracción de texto varía |
| Word (`.docx`) | Un zip de XML, con los estilos incluidos | No | Sí, completamente | Se renderiza distinto entre versiones y visores de Word |
| Fuente Markdown (`.md`) | Texto plano con puntuación | No | Sí, en cualquier editor | La mayoría de lectores ven la fuente en vez de un documento |
| Enlace alojado | Una página servida desde una dirección | Sí, siempre | No | Necesita alojamiento, y la dirección se puede pudrir o revocar |
| Captura de pantalla (`.png`) | Una foto del documento | No | No | Sin texto seleccionable, sin enlaces, sin búsqueda |

Las dos filas que merece la pena comparar con cuidado son la primera y la segunda, porque parecen equivalentes y no lo son. Un archivo HTML con un `styles.css` hermano se renderiza perfectamente desde `file://` — el CSS carga desde un disco local sin quejarse. Se renderiza perfectamente hasta el momento en que alguien saca el `.html` de la carpeta y lo adjunta a un correo, que es exactamente lo que hará un lector que nunca haya pensado en los recursos. La autocontención no es sobre todo una propiedad técnica. Es una propiedad que sobrevive a que la gente la manipule.

## Estilos inline, y las fuentes que en silencio no lo están

### Por qué la hoja de estilos enlazada tiene que desaparecer

Un `<link rel="stylesheet" href="…">` es una segunda petición, y cada petición adicional es una forma de que el documento llegue incompleto. En local, la hoja de estilos tiene que estar en la posición relativa correcta. En remoto, el host tiene que seguir existiendo, seguir sirviendo esa ruta, y seguir siendo alcanzable desde la red del lector — cosa que, dentro de un banco o un hospital, muy a menudo no es el caso.

Incrustar es la solución, y no tiene ningún misterio: toma el CSS que habría estado en el archivo de al lado y ponlo en un bloque `<style>` dentro del head. Toda la tipografía de un documento, los bordes de las tablas, los fondos de los bloques de código y las reglas de impresión son unos pocos kilobytes de texto, que comprimen bien y no cuestan nada que valga la pena medir.

Hay un beneficio de segundo orden que la gente solo nota después de que le haya pasado. Una hoja de estilos inline no se puede cambiar por debajo del documento. Si tu CSS de casa está versionado en una URL y alguien reescribe la escala de encabezados el próximo trimestre, cada documento antiguo que la enlazara se vuelve a renderizar con la escala nueva — incluido el que está adjunto a un contrato. Un documento con sus estilos dentro se renderiza en diciembre exactamente igual que se renderizó en agosto, porque las reglas y la prosa son el mismo artefacto.

### El atributo `style=` no es lo mismo

Dos técnicas se llaman «estilos inline» y se comportan de forma distinta. Un elemento `<style>` en el head guarda CSS de verdad: selectores, media queries, `@media print`, pseudoclases, todo. Un atributo `style=` en un elemento guarda solo declaraciones — sin selectores, sin media queries, sin `:hover`, y sin forma de decir «cada celda de tabla en este documento».

Para un documento que estás archivando o mandando por correo, el bloque `<style>` es lo que quieres. Los estilos por atributo importan en un único contexto, que es el correo HTML: los clientes de correo han eliminado históricamente los bloques `<style>`, y ahí el intercambio consiste en empujar las declaraciones hacia los elementos. Esa es una razón para mantener los dos casos separados en tu cabeza. Un *adjunto* HTML de un solo archivo y el *cuerpo* de un correo HTML son productos distintos con restricciones distintas, y una herramienta que produce uno no está produciendo necesariamente el otro.

### Fuentes: la promesa que rompe una sola etiqueta de enlace

Aquí está la cláusula que se rompe más a menudo, casi siempre con buena intención.

Incrustas el CSS con cuidado. Incrustas cada imagen. Luego, porque el documento debería parecerse al resto de tu material, añades una línea:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">
```

El archivo ha dejado de ser autocontenido. Ábrelo con la red apagada y la tipografía cae a lo que diga después la pila, lo que cambia la longitud de las líneas, los saltos de página y quizá el ancho de las tablas. Ábrelo con la red encendida, y el documento hace una petición a un tercero en el momento de leerlo — desde la IP del lector, en la red corporativa del lector, con el user agent del lector, cada vez que se abre el archivo. Para una nota interna eso es solo descuidado. Para un documento que le has entregado a un cliente, a un regulador o a la parte contraria, es un hecho sobre tu archivo que no tenías intención de crear.

Hay tres salidas honestas, y la primera suele ser la correcta.

**Usa una pila de fuentes del sistema.** `font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` se renderiza en una tipografía que el lector ya tiene, lo que significa que se renderiza al instante, sin conexión, en cualquier plataforma, a coste cero. El documento no se parece a tu marca. Se parece a un documento, que para un memo, una especificación o unas notas de versión es el resultado correcto.

**Incrusta la fuente como una data URI dentro de una regla `@font-face`.** Esto funciona y es caro. Un solo peso de una fuente WOFF2 solo con caracteres latinos suele ser decenas de kilobytes antes de codificar; una familia con regular, negrita y ambas cursivas son cuatro cortes, y base64 añade un tercio más a cada uno. Estás cambiando una parte fija y considerable del archivo por tipografía de marca en un documento que nadie va a juzgar por su tipografía. Revisa también la licencia antes de hacerlo — muchas licencias comerciales de fuentes permiten servirlas desde un dominio que controlas y no dicen nada útil sobre redistribuir el binario dentro de un archivo que le mandas por correo a un desconocido.

**Manda el archivo de la fuente junto al HTML.** Esto es el patrón de la carpeta de recursos con otro nombre, y falla en el mismo sitio: la primera vez que alguien reenvíe el `.html` solo.

## Imágenes como data URIs, y lo que eso cuesta en bytes

Una data URI pone los bytes donde iría la ruta. La sintaxis es un esquema, un tipo de medio, una codificación y la carga:

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..." alt="Deployment topology">
```

Base64 codifica tres bytes de entrada como cuatro caracteres de salida. Eso es un **aumento del 33%** antes de contar el preámbulo `data:image/png;base64,`, y no se recupera por más ingenio que le pongas. Un PNG de 1,5 MB se convierte en unos 2 MB de texto en mitad de tu marcado. Seis capturas de pantalla de ese tamaño, y el documento es un archivo de texto de 12 MB.

La compresión recupera menos de lo que la gente espera. Gzip y Brotli hacen un trabajo decente sobre base64 de datos ya comprimidos — pero solo decente, porque un PNG o un JPEG ya tienen mucha entropía; lo que se comprime es la codificación, no la imagen. Y la compresión solo se aplica sobre HTTP. Un archivo sentado en un disco, o adjunto a un correo, tiene el tamaño completo sin comprimir, y ese es el tamaño que choca con los límites.

Esos límites merece la pena nombrarlos, porque son donde el intercambio deja de ser teórico:

| Adónde va el archivo | Qué muerde primero |
| --- | --- |
| Adjunto de correo | El techo de adjuntos más estricto de la cadena, que no es el tuyo |
| Pasarela de correo corporativa | Escáneres que ponen en cuarentena o reescriben adjuntos HTML grandes |
| Un conversor o una API | Un límite de tamaño de petición — TransformPipe limita una conversión a 10 MB, y un documento guardado en una cuenta a 4 MB, porque una función de Vercel rechaza una petición o una respuesta de más de 4,5 MB |
| El navegador de un teléfono | Memoria, y el tiempo que se tarda en decodificar varios megabytes de base64 antes del primer renderizado |
| Una revisión de código | Nada en absoluto, y ese es el problema: el diff es ilegible |

Dos técnicas hacen que el coste sea manejable.

**Redimensiona antes de codificar.** La mayoría de las capturas de pantalla incrustadas son dos o tres veces más grandes que el ancho al que se muestran. Reducir a la mitad las dimensiones en píxeles de una captura recorta el archivo a aproximadamente un cuarto, y el sobrecoste de codificación del 33% se aplica entonces a un número mucho más pequeño. Este único paso hace más que cualquier argumento sobre el formato.

**Usa SVG como marcado, no como base64.** Un diagrama, un logo, un gráfico o un icono dibujado como SVG se puede pegar en el documento como un elemento `<svg>`. No hay sobrecoste de codificación en absoluto, el resultado es texto que comprime extremadamente bien, y se mantiene nítido a cualquier zoom. Si una imagen de tu documento es dibujo lineal, casi nunca debería ser un PNG en base64.

Lo que las data URIs no pueden arreglar es una imagen que apuntaste a otro sitio. `<img src="diagrama.png">` sigue significando `diagrama.png` relativo a la carpeta del lector, y un conversor que incrusta estilos no habrá incrustado necesariamente eso. El conjunto completo de cosas que se rompen cuando un archivo se mueve es un tema aparte — [las rutas relativas, los ids de anclaje y los enlaces por referencia fallan cada uno de forma distinta](/blog/images-and-links-that-still-work) — y el hábito práctico es abrir el código fuente del HTML y leer cada valor `src=` antes de mandar nada.

## Cómo verificar que el archivo es de verdad autocontenido

No confíes en la afirmación, ni siquiera en la nuestra. Verificarlo lleva alrededor de un minuto y es concluyente.

**1. Desconecta la máquina.** Apaga el Wi-Fi, desenchufa el cable, pon el portátil en modo avión. Hazlo primero, porque es el único paso que no se puede engañar con una caché tibia. Un archivo que ya has abierto una vez puede tener cada fuente y hoja de estilos sentada en la caché HTTP del navegador, y se va a renderizar perfectamente mientras depende por completo de la red.

**2. Abre el archivo desde `file://`.** Haz doble clic, o arrástralo a una ventana del navegador. Mira la tipografía, los bordes de las tablas, los fondos de los bloques de código y cada imagen. Una fuente de reemplazo es el indicio habitual: si los encabezados se ven más estrechos o más anchos de lo que recuerdas, algo se estaba descargando.

**3. Abre las herramientas de desarrollador, ve al panel de red, y recarga con él abierto.** Esta es la prueba real. En un documento `file://` el resultado correcto es una lista de peticiones que contiene el documento y nada más — sin CSS, sin fuentes, sin imágenes, sin balizas. Si aparece una fila, haz clic en ella y lee la URL; ahí está tu fuga, nombrada y localizada.

**4. Busca en la fuente las cuatro cosas que descargan.** Abre el archivo en un editor de texto y busca `<link`, `<script src`, `url(` y `src="http`. Cada resultado es o bien algo que incrustaste a propósito, o una dependencia que no sabías que tenías. `url(` atrapa los casos de fuentes e imágenes de fondo que el panel de red se perderá si la regla nunca coincidió con nada en pantalla.

**5. Pruébalo en un segundo navegador, en una segunda máquina, desde una carpeta distinta.** Copia el archivo a una memoria USB, conéctala a una máquina que nunca lo haya visto, y ábrelo ahí. Esto atrapa de una vez las rutas relativas, los recursos en caché y las diferencias de fuentes entre plataformas. También es, sin querer, un ensayo de lo que tu lector está a punto de hacer.

**6. Imprímelo a PDF mientras estás en ello.** La vista previa de impresión revela si el documento tiene reglas de impresión, y si algo se corta en el borde de la página. Si un PDF es la entrega final, [el propio diálogo de impresión del navegador es una vía razonable para llegar a uno](/blog/markdown-to-pdf), y un documento HTML de un solo archivo es la entrada que quiere.

Una nota sobre scripts. Un archivo autocontenido puede legítimamente llevar JavaScript inline — un botón que despliega el índice, un interruptor de modo oscuro — y un script inline no es una dependencia de red. Es, sin embargo, código ejecutable dentro de un documento que alguien va a abrir con doble clic, lo que es un riesgo distinto. Si el origen del documento fue Markdown que vino de fuera de tu organización, el HTML crudo de la fuente puede llevar `<script>`, `onerror=` y URLs `javascript:` directas a la salida, y [sanitizar contra una lista blanca fija es lo que lo evita](/blog/sanitising-markdown-safely). Busca `<script` en cualquier archivo que no hayas producido tú antes de abrirlo.

## Lo que vale un archivo único

El formato se gana su lugar en tres situaciones. No son la misma situación, y cada una valora una propiedad distinta.

### Archivar

Un documento archivado tiene un único requisito: tiene que seguir renderizándose cuando todo lo que lo rodea haya cambiado. Eso incluye la CDN que servía sus fuentes, el bucket de S3 que guardaba sus imágenes, la empresa que alojaba a ambos, y la versión del navegador que era actual cuando se escribió.

| Propiedad | Por qué le importa a un archivo |
| --- | --- |
| Sin peticiones externas | Los hosts a los que se preguntaría no van a seguir respondiendo todos |
| Estilos congelados en el archivo | El documento no se puede volver a renderizar con el CSS posterior de otra persona |
| Texto plano en disco | Grepable, comparable en principio, y legible por herramientas que aún no existen |
| Un archivo, un objeto | Nada que perder; ninguna carpeta que mantener junta |

HTML es un buen formato de archivo por una razón que no tiene nada que ver con la moda: es texto, su especificación es pública, y los navegadores siguen renderizando documentos antiguos. Un documento HTML de un solo archivo es un objeto de texto que se describe a sí mismo, que es la propiedad que sobrevive a formatos que necesitan una aplicación concreta.

No es un formato de *preservación* en el sentido institucional — para eso existen los contenedores WARC y su tooling, y una biblioteca o un archivo nacional usará esos. Para un equipo que conserva el estado de una decisión, un manual de operaciones tal como estaba durante un incidente, o un informe tal como se firmó, un archivo único es la versión pragmática de la misma idea.

**Para quién es:** para cualquiera que tenga que responder «¿qué decía esto en su momento?» y no pueda depender de un enlace.

### Mandar por correo

El correo es el entorno más hostil que se encuentra un documento, porque nada de él está bajo tu control. El cliente del lector, la pasarela, la conexión y el dispositivo son todas decisiones de otra persona.

Un adjunto HTML de un solo archivo se comporta bien en ese entorno por una razón sencilla: no hay nada que se pueda perder. Espera que el lector lo descargue en vez de verlo en un panel de vista previa, y espera que algunos sistemas de correo sean recelosos con los adjuntos `.html` en general — un zip, o un enlace al archivo, es el rodeo habitual cuando una pasarela pone objeciones. Lo que evitas es el fallo mucho más común de mandar un `.html` dejándose atrás su carpeta `images/`, que produce un documento lleno de iconos de imagen rota y un correo de seguimiento.

| Propiedad | Por qué le importa al correo |
| --- | --- |
| Un solo adjunto | Nada que comprimir, nada que el lector tenga que recomponer |
| Se renderiza sin conexión | El lector puede abrirlo en un avión, en un tren, o en un portátil bloqueado |
| Sin descargas | El documento no informa de cuándo, dónde o con qué frecuencia se leyó |
| Texto, no un contenedor | Se abre en un navegador que el lector ya tiene |

**Para quién es:** para cualquiera que manda un documento terminado a una persona concreta, sobre todo una fuera de sus propios sistemas. Las alternativas — y dónde falla cada una — [merecen leerse antes de elegir](/blog/share-a-markdown-document-as-a-link).

### Entregarlo a alguien fuera de tu empresa

Este es el caso donde la autocontención deja de ser una comodidad y se convierte en una cuestión de higiene. Cuando un documento sale de tu organización, lo inspeccionan personas y sistemas que no te deben nada.

Un archivo que descarga desde una CDN es un archivo que hace peticiones desde dentro de la red del destinatario. Su equipo de seguridad puede darse cuenta; su proxy puede bloquearlo; su auditor puede preguntar para qué era la petición. Un archivo que no descarga nada no plantea ninguna de esas preguntas, y se puede revisar leyéndolo — que es exactamente lo que va a hacer un destinatario cauteloso.

Hay un reverso que conviene decir, porque te aplica a ti como lector. Un documento HTML autocontenido que recibes es más fácil de revisar que una página, pero no es automáticamente seguro: el script inline se ejecuta cuando lo abres, y `file://` es un contexto permisivo. Lee el código fuente, o abre el archivo con JavaScript desactivado, si tienes algún motivo para ser cauteloso con quien lo envía.

| Propiedad | Por qué le importa a una entrega externa |
| --- | --- |
| Sin peticiones a terceros | Nada que un proxy pueda bloquear ni que una revisión de seguridad pueda cuestionar |
| Sin seguimiento | El documento no puede contarte que se abrió, que es justo el objetivo |
| Auditable | Todo se puede leer en un editor de texto |
| Sin cuenta, sin instalación | El destinatario lo abre en el navegador que ya tiene |

**Para quién es:** para cualquiera que manda un documento a través de una frontera empresarial — propuestas, especificaciones, informes de incidentes, entregables, cualquier cosa que un abogado pueda tener que enseñar más adelante.

## Dónde un archivo único es la respuesta equivocada, y qué cuesta

El formato tiene inconvenientes reales. Una página que solo enumera los beneficios está vendiendo algo.

**El archivo es más grande, y el aumento no es marginal.** Base64 añade un tercio a cada imagen incrustada, e incrustar recursos compartidos significa que cada documento lleva su propia copia de ellos. Diez informes que incrustan cada uno el mismo logo y los mismos dos diagramas llevan diez copias de cada uno. Si produces documentos en volumen, el coste agregado es real, y la deduplicación que obtendrías con recursos compartidos es exactamente lo que has renunciado a tener.

**Nada dentro puede cachearse.** Una página alojada descarga su hoja de estilos una vez y la reutiliza en cada página del sitio; la segunda página es casi gratis. Un archivo único no tiene segunda página. Cada documento paga por sus propios estilos, sus propias fuentes y sus propias imágenes, cada vez que se transfiere. Es el intercambio correcto para un documento que viaja solo, y el incorrecto para un sitio con navegación.

**Editarlo significa reenviarlo todo.** Una errata en una página alojada es un arreglo de una línea que ve cada lector en su siguiente visita. Una errata en un adjunto es un adjunto nuevo, un correo de disculpa, y dos versiones del documento en el buzón del destinatario sin ninguna indicación de cuál es la actual. Los archivos únicos no tienen ninguna vía de actualización; eso es intrínseco, no una función que falte.

**No hay analítica, por construcción.** Si necesitas saber si se leyó la propuesta, necesitas un enlace, y un enlace es lo contrario de un archivo autocontenido. No puedes tener las dos propiedades en el mismo artefacto.

**Los archivos muy grandes se comportan mal.** Varios megabytes de base64 hay que decodificarlos antes de que el navegador pueda pintar las imágenes, y en un teléfono con memoria modesta eso es una pausa visible o algo peor. Hay un tamaño a partir del cual un archivo único es una mala experiencia aunque sea técnicamente correcto, y los documentos llenos de capturas de pantalla lo alcanzan rápido.

**No es un sitio web.** Sin navegación entre documentos, sin búsqueda, sin feeds, sin enlaces cruzados que se resuelvan. Un conjunto de documentos que se referencian entre sí quiere alojamiento, y pretender lo contrario produce una carpeta de archivos con enlaces muertos entre ellos.

**Algunos visores no van a cooperar.** Pasarelas de correo que ponen en cuarentena adjuntos HTML, sistemas de gestión documental que no indexan HTML, herramientas de revisión que no renderizan nada — estos son problemas de política, no técnicos, y en algunas organizaciones cierran el debate independientemente de los méritos. Cuando pasa eso, un PDF es el formato que acepta la institución, y un documento HTML de un solo archivo es la mejor entrada posible para producir uno.

## Cómo elegir

1. **Parte de dónde se va a abrir el archivo, no de lo que sea cómodo producir.** Un documento abierto desde un buzón en un portátil desconectado tiene que ser autocontenido; una página abierta desde una URL con caché tibia no debería serlo, porque estarías tirando el cacheo sin razón.
2. **Cuenta las peticiones, no las funciones.** Abre el panel de red sobre la salida y mira el número de filas. Cualquier número por encima de uno significa que el archivo tiene dependencias, y cada dependencia es un sitio donde el documento puede llegar incompleto.
3. **Redimensiona las imágenes antes de incrustarlas, porque el sobrecoste de codificación del 33% multiplica lo que le metas.** Una captura al doble de su ancho de visualización cuesta cuatro veces los bytes que necesita, y ese desperdicio es el mayor contribuyente a un archivo único inflado.
4. **Decide sobre las fuentes web una vez, por escrito.** O el documento usa una pila de fuentes del sistema y se mantiene honesto, o incrusta cortes que has comprobado que la licencia permite; una fuente enlazada es una decisión de hacer una petición desde la máquina del lector, y no debería pasar por accidente.
5. **Si el documento va a cambiar, no mandes un archivo.** Los adjuntos no tienen vía de actualización, así que cualquier cosa que siga en borrador quiere un enlace, y cualquier cosa final quiere un archivo. Mandar un archivo de algo sin terminar garantiza una segunda versión en circulación.
6. **Pruébalo como lo va a abrir tu lector, en una máquina que nunca lo haya visto, sin conexión.** Cada fallo descrito en esta página — la fuente de reemplazo, la imagen rota, la hoja de estilos que falta, la petición sorpresa — aparece en esa única prueba, y ninguno de ellos aparece en la vista previa de la propia herramienta.

## Conclusión

Un documento HTML de un solo archivo es una idea pequeña con un beneficio concreto: se renderiza igual en todas partes porque no pide nada, lo que lo convierte en el formato correcto para archivos, adjuntos y cualquier cosa que cruce una frontera empresarial. Los costes son igual de concretos — un tercio más de bytes en cada imagen, sin caché, y sin forma de corregir un error sin reenviar todo — así que es el formato equivocado para un sitio, para un borrador, o para cualquier cosa sobre la que necesites confirmaciones de lectura. Si tienes un archivo Markdown y una persona esperando un documento, [convertirlo en el navegador](/) produce exactamente esto: un archivo HTML con sus estilos inline, nada descargado y, sin sesión iniciada, nada subido a ningún sitio durante el proceso. Luego desconecta la máquina y ábrelo, porque una afirmación de autocontención que no has probado es solo una afirmación.

## Preguntas frecuentes

### ¿Qué es un documento HTML de un solo archivo?

Es un único archivo `.html` que se renderiza correctamente sin conexión de red, porque su hoja de estilos es un bloque `<style>` inline, sus imágenes están incrustadas como data URIs o SVG inline, y no descarga ninguna fuente, script ni rastreador. Abierto desde un disco local no hace ninguna petición. Los enlaces de la prosa siguen apuntando a internet, y así debe ser — la autocontención va sobre la presentación, no sobre las citas.

### ¿Cómo compruebo si un archivo HTML es de verdad autocontenido?

Desconecta la máquina primero, para que ningún recurso en caché falsee el resultado, luego abre el archivo y recárgalo con el panel de red de las herramientas de desarrollador abierto. El resultado correcto es una lista de peticiones con el documento y nada más. Buscar en la fuente `<link`, `<script src`, `url(` y `src="http` atrapa cualquier cosa que el panel de red se haya perdido porque la regla nunca coincidió con nada.

### ¿Cuánto más grande hace el archivo incrustar las imágenes?

Base64 codifica tres bytes como cuatro caracteres, así que cada imagen incrustada crece alrededor de un 33% antes de contar el preámbulo del tipo de medio, y la compresión solo recupera parte de eso porque los datos fotográficos y PNG ya son densos. Redimensionar una captura al ancho al que de verdad se muestra suele ahorrar mucho más que cualquier decisión de formato. El dibujo lineal debería ser SVG inline, que no tiene ningún sobrecoste de codificación.

### ¿Puedo usar una fuente web en un archivo autocontenido?

No desde una CDN — eso es una petición de red, y cambia la tipografía cuando el lector está sin conexión y además informa de cada apertura a un tercero. Puedes incrustar un corte como base64 dentro de una regla `@font-face` si la licencia permite redistribuirlo, a un coste de decenas de kilobytes por peso. Para la mayoría de documentos, una pila de fuentes del sistema es el mejor intercambio: instantánea, gratis y disponible en cualquier plataforma.

### ¿Es mejor el HTML de un solo archivo que un PDF para enviar un documento?

Optimizan cosas distintas. El HTML se reajusta a la pantalla del lector, mantiene el texto seleccionable y buscable, y se puede leer en cualquier navegador sin una aplicación adicional; un PDF fija el maquetado de la página, lo que importa cuando la paginación es parte del contenido o cuando una institución solo acepta PDF. Una respuesta práctica es producir primero el HTML e imprimirlo a PDF cuando se necesite un PDF de forma específica.

### ¿Es seguro abrir un archivo HTML autocontenido que me envió alguien?

Más seguro que una página alojada en un aspecto, y no en otro. No descarga nada, así que no puede llamar a casa ni cargar código remoto, pero el JavaScript inline dentro sigue ejecutándose cuando lo abres. Si tienes motivos para ser cauteloso con quien lo envía, lee primero el código fuente buscando `<script`, o abre el archivo con JavaScript desactivado.

### ¿Por qué un archivo HTML que recibí se ve sin estilo?

Casi siempre porque no era autocontenido: enlazaba una hoja de estilos que ya no está a su lado, o una en un host al que tu red no puede llegar. Un navegador al que se le da HTML sin ningún CSS aplicable lo renderiza en su fuente serif por defecto a todo lo ancho de la ventana, por lo que el archivo parece un borrador de texto plano en vez de un documento. Pide a quien lo envió una versión con los estilos inline.
