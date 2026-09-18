---
title: "¿Es seguro un conversor de Markdown online? Cómo comprobarlo en vez de confiar"
description: "Si un conversor online es seguro se reduce a cuatro cosas comprobables: si sube el archivo, cuánto tiempo lo guarda, quién lo lee y qué dicen sus términos"
date: 2026-08-16
tag: Seguridad
keywords: es seguro un conversor de markdown, privacidad de conversores online, el conversor sube mi archivo, política de retención de documentos, convertir documentos sin subirlos, términos de servicio de un conversor online, conversor basado en el navegador
---

Nadie lee la política de privacidad de un conversor de archivos. El documento está abierto, el plazo es ahora, la página dice gratis y sin registro, y treinta segundos después hay un archivo HTML en la carpeta de descargas y ningún recuerdo de haber tomado una decisión. Se tomó una decisión de todos modos: sobre si ese documento salió del edificio, quién tiene ahora una copia, durante cuánto tiempo, y bajo qué licencia.

### Resumen rápido

Un conversor es seguro para un documento concreto cuando puedes responder cuatro preguntas sobre él — si el archivo se sube siquiera, cuánto tiempo se guarda una copia, quién más está en el camino, y si la salida está saneada. Tres de esas se pueden observar en un navegador en unos cinco minutos: abre la pestaña de red, convierte un archivo de prueba, y mira qué sale; después lee los términos buscando una cláusula de licencia y no el titular de privacidad. La conversión en el navegador no sube nada y se puede verificar apagando la red, la conversión del lado del servidor tiene que leer tu texto en claro para hacer el trabajo siquiera, y una herramienta sin conexión no involucra ninguna red pero te cuesta una instalación y una cadena de suministro. Para contratos, notas de pacientes, credenciales, cifras financieras sin anunciar y cualquier cosa cubierta por un acuerdo que nombra a los subprocesadores permitidos, subir el archivo no es un riesgo que pesar — es una divulgación.

«¿Es seguro?» es la pregunta con la forma equivocada, porque la seguridad no es una propiedad que tenga un conversor. Lo que tiene un conversor es un conjunto de comportamientos, la mayoría de los cuales puedes observar, y un conjunto de promesas, todas las cuales puedes leer. Son dos tipos de evidencia distintos y fallan de formas distintas: el comportamiento puede cambiar en el próximo despliegue, y una promesa puede ser cierta y aun así no cubrir lo que a ti te importa.

La fricción es que comprobarlo tarda cinco minutos y convertir tarda treinta segundos, así que la comprobación nunca llega a pasar. También se siente como paranoia hasta la única vez que no lo es — la nota de lanzamiento que nombra a un cliente sin anunciar, el postmortem con los nombres de host internos, el README cuya muestra de configuración todavía tiene un token activo. Son archivos normales. Pasan por conversores normales todos los días.

Lo que sigue es la versión honesta más corta: qué deja fuera la frase «conversor online», cómo averiguarlo en vez de adivinar, para qué sirven en realidad los tres tipos de conversor, y los documentos concretos donde subir el archivo no es ni siquiera una decisión que valga la pena sopesar.

## Lo que la gente comprueba, y lo que debería comprobar

Observa a alguien elegir un conversor y lo vas a ver evaluar cuatro cosas, ninguna de las cuales tiene relación con la pregunta.

**El candado.** HTTPS es una afirmación sobre el transporte. Dice que los bytes se cifraron entre tu navegador y ese servidor, y no dice nada sobre si esos bytes deberían haberse enviado, qué hizo el servidor con ellos, cuánto tiempo los guardó, o a quién se los pasó. Cualquier conversor alojado que sube tu archivo lo sube sobre HTTPS. También lo hace cualquiera que lo guarde para siempre.

**Lo profesional que se ve el sitio.** La calidad del diseño correlaciona con el presupuesto, no con el manejo de datos. Un área de arrastrar y soltar prolija con una animación de progreso es una interfaz; lo interesante es la petición detrás de ella. A la inversa, una página sencilla sin ningún estilo puede estar haciendo todo el trabajo localmente.

**«No requiere registro».** Esto significa que no hay cuenta. No significa que no haya subida. Las dos cosas se confunden constantemente, porque registrarse se siente como el momento en que entregas algo, y para entonces el archivo por lo general ya se fue.

**Una cifra de uso.** La popularidad no es un control. Un servicio que usa mucha gente tiene una superficie de incidentes más grande, no más pequeña, y el número en la página de inicio no dice nada sobre la retención, los subprocesadores ni lo que dicen los términos sobre tu contenido.

Las cuatro preguntas que sí tienen relación con esto son aburridas y respondibles:

1. ¿Se sube el archivo siquiera?
2. Si se sube, ¿cuánto tiempo se guarda una copia, y dónde?
3. ¿Quién más puede leerlo — personal, subprocesadores, cualquiera que tenga un enlace al resultado?
4. ¿La salida está saneada, o lleva lo que fuera que había en la entrada directo a un navegador?

La cuarta es la que nadie pregunta. Las primeras tres son sobre la confidencialidad de tu documento. La cuarta es sobre si el archivo que te devuelven puede hacerle daño a quien se lo envíes, y aplica igual de bien a un conversor que corre enteramente en tu propia máquina.

## Cinco cosas que oculta «conversor online»

La frase está haciendo mucho trabajo. Ha llegado a significar «corre en el servidor de alguien», pero un navegador es un entorno de ejecución como cualquier otro, y un conversor escrito para correr ahí hace el trabajo en tu máquina y no sube nada. Los dos son online en el sentido de que llegaste a ellos con una URL. Solo uno de los dos es online en el sentido que la gente quiere decir.

Esto es lo que oculta la frase, y cómo llegar a cada una de esas cosas.

| Qué se oculta | Cómo lo compruebas | Cómo se ve una mala respuesta |
| --- | --- | --- |
| Si el archivo se sube | Pestaña de red abierta, convierte un archivo de prueba, busca una petición saliente con el tamaño de tu archivo | Un `POST` con `multipart/form-data`, o la página fallando al convertir con la red apagada |
| Cuánto tiempo se guarda una copia | Busca en la política de privacidad una duración — horas, días, «hasta que lo borres» | Reafirmación sin ningún número: «nos tomamos tu privacidad muy en serio» |
| Quién más puede leerlo | La lista de subprocesadores, la región, si los resultados se entregan como un enlace adivinable | Ninguna lista en absoluto, o una URL de resultado que se puede compartir sin ninguna credencial |
| Qué dicen los términos sobre tu contenido | Busca en los términos licencia, libre de regalías, sublicenciable, perpetua, obras derivadas | Una licencia de contenido amplia sin límite de propósito ni caducidad |
| Si la salida está saneada | Convierte un documento con una etiqueta de script y lee el HTML que devuelve | `<script>`, `onerror=` o `javascript:` todavía presentes en la salida |

Dos de esas merecen desarrollarse ahora, porque son donde la redacción hace más daño.

**«No guardamos tus archivos» no es «no recibimos tus archivos».** Una afirmación sobre almacenamiento es una afirmación sobre qué pasa después de la subida. Admite la subida. Es también la frase más común en la página de inicio de un conversor, y por lo general es cierta — el archivo de verdad se borra después de procesarlo —, que es justo por lo que funciona como sustituto de la afirmación más fuerte a la que se parece. Si quieres la afirmación más fuerte, la redacción que buscas es sobre la transmisión: el archivo no se envía, la conversión ocurre en tu navegador, nada sale de tu máquina.

**Un conversor del lado del servidor no puede estar cifrado de extremo a extremo.** Esto se sigue del propio trabajo que está haciendo. Para convertir Markdown a HTML, el conversor tiene que analizar el Markdown, lo que significa que tiene que tener el texto en claro, lo que significa que el cifrado termina en su servidor, no en el otro extremo. TLS protege el viaje. No puede proteger el destino de leer lo que llegó, porque leer lo que llegó es el propio servicio. Cualquier conversor que anuncie cifrado de extremo a extremo mientras hace la conversión del lado del servidor, o usa la frase con soltura o no sabe qué significa, y las dos son razones para leer el resto de la página más despacio.

## Comparativa rápida: la chuleta

Hay tres posturas honestas que un conversor puede sostener. Todo lo demás es marketing encima de una de ellas.

| Tipo | Dónde se lee el archivo | Qué se puede retener | Quién más está en el camino | Qué pueden afirmar los términos | Correcto para | Equivocado para |
| --- | --- | --- | --- | --- | --- | --- |
| En el navegador | Tu propia máquina, con el JavaScript que la página ya cargó | Nada — no hay copia que guardar | Quien más tenga un script en esa página | Nada sobre contenido que nunca recibe | Cualquier cosa que no sea ya pública; conversiones puntuales rápidas; trabajo donde importa poder verificar | Archivos muy grandes; formatos que un navegador no puede analizar; lotes desatendidos |
| Del lado del servidor | La máquina del proveedor, en una región que ellos elijan | La subida, la salida, los registros, y cualquier enlace de resultado | El proveedor, su alojamiento, sus subprocesadores, cualquiera con el enlace | Una licencia para alojar, copiar y procesar tu contenido | Formatos exóticos; conversiones pesadas; pipelines por API; documentos públicos | Contratos, datos de salud, credenciales, cualquier cosa bajo un acuerdo de confidencialidad que nombra subprocesadores |
| Sin conexión | Tu propia máquina, con software que instalaste | Lo que la herramienta escriba en disco, bajo tu control | Nadie, una vez instalado — pero la instalación tiene una cadena de suministro | Nada; una licencia rige el software, no tus archivos | Trabajo regulado; pipelines repetibles; entornos aislados de la red; trabajos masivos | Conversiones puntuales donde una instalación es absurda; máquinas donde no puedes instalar nada |

La fila que sorprende a la gente es la tercera columna de la primera fila. La conversión en el navegador no tiene política de retención, no porque el proveedor sea generoso sino porque no hay nada sobre lo que tener una política. Esa es una categoría de respuesta distinta a «borrado después de veinticuatro horas», y es la única que no depende de que alguien cumpla una promesa sobre una copia que tiene.

La fila que sorprende a la gente en la otra dirección es la última columna de la tercera fila. Una herramienta sin conexión no es automáticamente la opción más segura, porque instalar software es en sí mismo una decisión de confianza, y un conversor que instalaste corre con el acceso de tu propia cuenta de usuario a cada archivo que posees. La subida que evitaste es una exposición más estrecha que el paquete que añadiste.

## Cómo comprobar en vez de confiar

Todo esto se puede comprobar. Nada de esto necesita herramientas especiales — un navegador y diez minutos van a resolver la duda sobre un conversor que estás a punto de usar, y los mismos diez minutos la resuelven para todo el equipo.

### La pestaña de red

Abre las herramientas de desarrollo antes de convertir nada, no después. En Chrome, Edge o Firefox eso es F12; el panel que quieres es Network. Recarga la página con el panel abierto para capturar también la carga de la página, después convierte un archivo y observa.

Lo que estás buscando es una petición que aparezca en el momento en que conviertes, con un cuerpo de petición más o menos del tamaño de tu documento. Filtra por `Fetch/XHR` para cortar el ruido. Ordena por tamaño si la lista es larga.

```
# Una conversión en el navegador, después de que la página terminó de cargar
(no aparecen filas nuevas cuando pulsas Convertir)

# Una subida, en el mismo panel
POST  /api/convert   xhr   multipart/form-data   1.4 MB   312 ms
GET   /api/result/8f3c1e   xhr   application/json   2.1 kB
```

Dos ajustes vuelven esto una prueba mucho mejor.

Primero, apaga la red y vuelve a intentarlo. Carga el conversor, después desconéctate — modo avión, o la casilla Offline en el panel de red — y convierte. Un conversor en el navegador sigue funcionando, porque el código ya está en la página y el archivo nunca necesitó ir a ningún sitio. Uno del lado del servidor se detiene. Esta es la prueba de cinco segundos más contundente que hay, porque no se puede falsear con una petición que solo parece pequeña.

Segundo, mira con qué más habla la página. Un conversor que no sube tu documento puede seguir enviando su nombre de archivo, su tamaño, o un evento de página a un punto de análisis, y eso puede importar por sí solo: un nombre de archivo como `redundancy-list-final.md` es una divulgación aunque el contenido no lo sea. Ya que estás ahí, cuenta los scripts de terceros. Cada script que carga la página corre en el mismo origen que el conversor, con el mismo acceso a la página y por lo tanto a tu documento. Un conversor en el navegador con un gestor de etiquetas, un widget de chat y dos proveedores de análisis encima está a un proveedor de distancia de una subida que no pretendía.

### La política de privacidad, leída por sus sustantivos

Lee la política buscando tres cosas e ignora el resto: qué se recolecta, cuánto tiempo se guarda, y con quién se comparte. Las palabras de tranquilidad no son una de las tres. Una frase con una duración dentro vale más que tres párrafos sobre cuán en serio se toma alguien cualquier cosa.

Si no encuentras una frase de retención, la conclusión honesta es que el período de retención es desconocido, y un período desconocido no es lo mismo que uno corto. Trata la subida en consecuencia.

### La declaración de retención, en sí misma

Los buenos servicios alojados declaran la retención con claridad, y las declaraciones caen en formas reconocibles: se borra de inmediato tras procesar, se borra tras un número fijo de horas, se guarda hasta que lo borras, se guarda mientras exista tu cuenta. Cada una es defendible. Ninguna es cero.

Dos detalles de la declaración de retención merecen más atención de la que suelen recibir.

El primero es qué pasa cuando una conversión falla. Varios servicios guardan una subida fallida más tiempo que una exitosa para que soporte técnico pueda revisarla, lo cual es del todo razonable y significa que el documento que más quieres olvidar — el que se rompió — es el que se guarda más tiempo.

El segundo es qué cubre la declaración. La retención suele describir el archivo subido y la salida convertida. Casi nunca describe los registros, y los registros son donde viven los nombres de archivo, los tamaños, las direcciones IP y las marcas de tiempo. Borrar el documento y quedarse con la línea de registro sobre él es un resultado de ingeniería normal y una respuesta parcial a «¿ya se fue?».

### Los términos, y la cláusula de licencia

Esta es la comprobación que casi nadie hace, y es la que a veces produce una sorpresa genuina. Abre los términos de servicio y busca en el texto estas palabras:

```
licencia   libre de regalías   sublicenciable   perpetua
irrevocable   mundial   obras derivadas   retener   almacenar
terceros   subprocesador   mejorar nuestros servicios   entrenamiento
```

La mayoría de los servicios necesitan alguna licencia sobre tu contenido, y decirlo no es siniestro: para guardar un archivo, copiarlo entre máquinas y devolvértelo, un proveedor necesita tu permiso para almacenarlo, copiarlo y transmitirlo. Lo que estás comprobando es la forma de ese permiso, y hay cuatro cosas que mirar.

¿Está limitada por propósito — «únicamente para prestar el servicio» — o es abierta? ¿Termina cuando borras el archivo y cierras la cuenta, o es perpetua? ¿Es sublicenciable, lo que la extiende a partes que no puedes ver? ¿Y llega más allá de operar el servicio hasta mejorarlo, que en el uso actual a menudo significa entrenar modelos con lo que subiste?

Una licencia limitada por propósito, no sublicenciable, que termina con tu contenido, es normal y está bien. Una licencia perpetua, mundial, sublicenciable para usar, adaptar y crear obras derivadas de cualquier cosa que subas, sin límite de propósito, es una cláusula que alguien escribió a propósito. Que importe depende enteramente de qué documento de quién estás convirtiendo: para tus propias notas, nada en absoluto; para el borrador de un acuerdo de un cliente, es toda la decisión, y puede ser una decisión que contractualmente no tengas permitido tomar.

### Si la salida está saneada

Ahora la otra mitad de la seguridad, la mitad que no tiene nada que ver con adónde fue tu archivo.

Markdown permite HTML crudo por diseño, así que un archivo `.md` puede contener una etiqueta `<script>`, un manejador `onerror` o una URL `javascript:`, y un conversor que renderiza fielmente le pasa las tres al navegador. Eso está bien para un archivo que escribiste tú. No está bien para un README que sacaste de la red, un documento que envió un cliente, o cualquier cosa que generó un modelo a partir de material que no leíste.

Puedes comprobar esto en un minuto. Haz un archivo pequeño con las formas conocidas como peligrosas y convierte:

```markdown
## Sanitiser test

<script>window.__test = 1</script>

<img src=x onerror="window.__test = 2">

[a link](javascript:void 0)

<iframe src="https://example.com"></iframe>

<a href="#" onclick="window.__test = 3">text</a>
```

Después abre el HTML que te dio el conversor en un editor de texto — no en un navegador — y búscalo. Si `<script`, `onerror`, `onclick` o `javascript:` sobrevivieron, el conversor renderiza fielmente y no sanea, y la salida es tan segura como lo era la entrada. Es una decisión de diseño legítima para una herramienta pensada para tus propios archivos, y es la herramienta equivocada para los de cualquier otra persona. [Los vectores, las listas de permitidos y dónde tiene que ocurrir el filtrado](/blog/sanitising-markdown-safely) es la versión larga de esta prueba.

Mientras el archivo esté abierto en el editor, búscale también `http`. Cada URL externa en un documento exportado es una petición que el navegador de quien lo reciba va a hacer cuando lo abra, lo que le dice al otro extremo que el archivo se abrió, cuándo, y desde más o menos dónde. Una exportación autocontenida tiene sus estilos y fuentes en línea y no le pide nada a la red, algo que vale la pena confirmar en vez de asumir — la diferencia entre [un archivo y un enlace](/blog/share-a-markdown-document-as-a-link) es sobre todo esto.

Una cosa más sobre la salida, porque desmonta una intuición: un conversor que corrió enteramente en tu máquina puede seguir entregándote un archivo peligroso. La conversión local protege la confidencialidad de tu documento. No hace nada sobre el contenido, y un archivo HTML abierto desde tu propio disco sigue ejecutando su JavaScript. Un script en un archivo local puede alcanzar la red construyendo una URL de imagen, así que «nunca salió de mi portátil» y «es seguro abrirlo» son afirmaciones sin relación entre sí.

## Los tres tipos de conversor, y para qué sirve cada uno

### En el navegador — para cualquier cosa que no sea ya pública

Un conversor en el navegador te entrega el analizador a ti. La página carga algo de JavaScript, ese JavaScript lee el archivo que elegiste con el selector de archivos, lo convierte en memoria, y te ofrece el resultado como descarga. Ninguna petición lleva el documento, porque ninguna petición lo necesita.

| A favor | En contra |
| --- | --- |
| Nada se sube, y lo puedes probar desconectando el cable de red | La afirmación descansa en código que no leíste, verificado por observación en un solo momento |
| Sin política de retención, porque no hay copia que retener | Los scripts de terceros en la misma página comparten el origen y el acceso |
| Sin cuenta, sin instalación, sin aprobación que obtener | La máquina es el techo: un archivo muy grande va a agotar la pestaña |
| Los términos no pueden decir mucho sobre contenido que nunca llega | Los formatos que necesitan un análisis pesado son más débiles que en un servidor |

**¿Para quién es?** Para cualquiera que convierta un documento que no sea ya público y no necesite una instalación para justificarse: una cláusula de contrato, un borrador de anuncio, el resumen de un incidente, un currículum, el archivo de un cliente que no tienes permitido enviar a ningún lado. Es también la opción por defecto correcta para quien quiere poder demostrar la respuesta en vez de citarla, porque la demostración es un panel de red sin nada dentro.

**Lo que no arregla.** Sanear es una decisión aparte, tomada por la misma herramienta, y vale la pena comprobarla por separado con la prueba de arriba. Igual que si la salida es un documento completo o un fragmento — una pregunta de utilidad y no de seguridad, tratada extensamente en [la comparativa de conversores](/blog/best-markdown-to-html-converters).

### Del lado del servidor — para formatos y volúmenes que un navegador no puede manejar

Un conversor alojado sube el archivo, lo convierte en su infraestructura, y te da la salida o un enlace a ella. Esto es lo que la mayoría entiende por conversor online y es la elección correcta para un conjunto real de trabajos.

| A favor | En contra |
| --- | --- |
| Maneja formatos que un navegador no puede analizar bien, incluidos archivos de oficina antiguos y PDFs | El documento se divulga al proveedor, por definición |
| Convierte archivos mucho más grandes de lo que aguanta una pestaña | La retención es una política, lo que significa una frase que alguien puede reescribir |
| Una API y una cola, así que el trabajo puede ser desatendido y repetible | Subprocesadores, regiones y registros extienden la lista de partes |
| Otra persona mantiene los analizadores, las fuentes y las correcciones | Un resultado entregado como URL es una credencial que se puede reenviar |

**¿Para quién es?** Documentos públicos, documentación publicada, textos de marketing, cualquier cosa ya en la web abierta, y cualquier pipeline donde la conversión tiene que ocurrir sin una persona en una pestaña. Es también la respuesta pragmática cuando el formato de origen es de verdad difícil, algo frecuente al salir de una suite de oficina — las compensaciones específicas de esa dirección están descritas en [lo que pierde un archivo de Word en el camino a Markdown](/blog/convert-docx-to-markdown).

**Las condiciones que lo hacen defendible.** Un período de retención declarado con un número. Una lista de subprocesadores que puedas leer. Una licencia de contenido limitada por propósito. Una región que puedas elegir, si tienes una obligación de transferencia. Un acuerdo de tratamiento de datos, si manejas datos personales de otra persona. Y un mecanismo de entrega de resultados que no sea una URL adivinable. Un servicio que ofrece los seis es un proveedor razonable. Uno que no ofrece ninguno no es más barato; está sin documentar, y [las diferencias de retención y medición entre los conocidos](/blog/best-online-document-converters) son la comparación de verdad.

### Sin conexión — para trabajo regulado y pipelines repetibles

Un conversor sin conexión es software en tu máquina: una herramienta de línea de comandos, una aplicación de escritorio, una biblioteca dentro de un build. La red no participa después de la instalación.

| A favor | En contra |
| --- | --- |
| Sin subida, sin retención, sin terceros, sin política que leer | Una instalación, actualizaciones, y una cadena de suministro de paquetes que confiar |
| Corre en un entorno aislado de la red o aprobado | Corre con el acceso de tu usuario a cada archivo que posees |
| Programable, así que cien archivos cuestan lo mismo que uno | La deriva de versiones entre máquinas produce salidas distintas |
| Auditable: el binario y sus entradas son tuyos | Sigue sin sanear, salvo que la herramienta lo haga o lo añadas tú |

**¿Para quién es?** Trabajo regulado y contractual donde un control documentado importa más que la comodidad, conversión masiva, y cualquier cosa que tenga que correr igual cada vez dentro de un pipeline. Es la única opción en una máquina sin ruta a internet, y la natural una vez que la conversión se repite lo suficiente como para que alguien abriendo una pestaña sea la parte lenta.

**El coste que la gente subestima.** Añadir una dependencia es añadir un proveedor. Un conversor traído de un registro de paquetes trae consigo sus dependencias transitivas, y cada una de ellas corre con el mismo acceso que tu shell. Pésalo con honestidad frente a la subida que estabas evitando, sobre todo para un trabajo puntual con un solo archivo, donde la instalación es el cambio más grande a tu máquina.

## Cuándo una subida es inaceptable

Para la mayoría de los documentos, esto es una preferencia. Para algunos no es una decisión de criterio en absoluto, porque la subida es en sí misma el evento: en el momento en que el archivo llega a un tercero, algo se divulgó, y ninguna política de retención lo deshace.

| Documento | Por qué la subida es el problema | Qué hacer en su lugar |
| --- | --- | --- |
| Contratos sin firmar, cartas de intención, ofertas | Nombres, precios y posiciones divulgados a una parte que no está en el trato | En el navegador, o una herramienta sin conexión en una máquina que controlas |
| Información de salud o de pacientes | Procesar los datos de salud de otra persona necesita una base legal y un acuerdo, no un formulario web | Sin conexión, dentro del entorno aprobado |
| Datos personales de personas identificables | Te vuelves responsable de un procesador que no evaluaste, y quizá de una transferencia | En el navegador, o un servicio alojado con un acuerdo firmado |
| Credenciales, tokens, claves privadas, muestras de `.env` | El secreto ya está compartido, pase lo que pase con el archivo | En el navegador o sin conexión, y rota el secreto si ya se fue |
| Cifras financieras, resultados o adquisiciones sin anunciar | Material sensible al mercado entregado a un tercero no evaluado | Sin conexión, bajo los mismos controles que el resto de ese material |
| Trabajo de un cliente bajo un acuerdo de confidencialidad que lista subprocesadores permitidos | Una subida a una parte no listada puede violar el acuerdo directamente | En el navegador o sin conexión, y comprueba la lista antes de elegir |
| Revisiones de seguridad, postmortems, notas de arquitectura | Nombres de host, versiones y debilidades conocidas son exactamente las partes útiles | Sin conexión, o en el navegador sin scripts de terceros en la página |
| Registros de RRHH, notas disciplinarias, listas de despidos | Sensible sobre personas que no dieron su consentimiento, y el propio nombre del archivo puede divulgar | En el navegador o sin conexión; renombra antes de tocar cualquier herramienta |

Tres de esos merecen una frase más.

**El caso de las credenciales es, por mucho, el más común.** El Markdown de desarrollo está lleno de muestras de configuración, y las muestras de configuración están llenas de cosas que parecen marcadores de posición y a veces no lo son. Si un archivo con un token activo llegó a un conversor alojado, la respuesta correcta no es revisar la política de retención; es rotar el token. La retención describe cuándo se borra una copia, no quién la leyó antes de eso.

**El nombre del archivo es un dato.** La gente protege el contenido y pega los nombres sin pensarlo. `q3-layoffs-final.md`, `patient-4412-notes.md` y `acquisition-northwind.md` divulgan cada uno la parte interesante antes de que el archivo se analice siquiera, y los nombres de archivo terminan en los registros, en los eventos de análisis y en los tickets de soporte mucho más a menudo que el contenido.

**Lee el acuerdo, no tu apetito por el riesgo.** Buena parte del trabajo con clientes vive bajo términos que especifican qué terceros pueden procesar el material. Donde esa lista existe, la pregunta deja de ser sobre probabilidad. O el conversor está en la lista o la subida es un incumplimiento, y esa es una pregunta mucho más fácil de responder que si el proveedor es de fiar.

## Dónde falla la respuesta obvia, y qué cuesta

«Usa un conversor en el navegador» es la opción por defecto correcta y no es una respuesta completa. Cuatro cosas están mal en tratarla como si lo fuera.

**Es una afirmación, verificada una vez.** El panel de red mostrando nada es evidencia real sobre el código que estaba corriendo cuando miraste. Un despliegue la semana siguiente lo puede cambiar, y nadie vuelve a comprobar. La conversión en el navegador es verificable de una forma que no lo es una promesa del lado del servidor — esa es una propiedad genuina e inusual —, pero verificable no es lo mismo que verificado, y la comprobación tiene una fecha de caducidad. Para trabajo donde esto de verdad importa, repite la prueba sin conexión de tanto en tanto, y prefiere una herramienta donde funcionar con la red apagada sea una propiedad diseñada y no un accidente.

**El origen es compartido.** Un conversor en el navegador no es una zona aislada frente a su propia página. Cualquier script que la página cargue — análisis, un gestor de etiquetas, un widget de soporte, un anuncio — corre con acceso total al modelo de documento y por lo tanto a lo que el conversor tenga en memoria. Este es el fallo más probable en la práctica, porque no necesita que quien escribió el conversor sea deshonesto, solo que haya añadido un proveedor. Cuenta los terceros en el panel de red; un conversor sin ninguno hace una afirmación más fuerte que uno con cinco.

**No te da nada que mostrarle a un auditor.** Este es el coste que atrapa a la gente. Si tienes que evidenciar cómo se manejó un documento, «se convirtió localmente en un navegador y no se subió nada» es una afirmación cierta sin ningún artefacto detrás. Un procesador alojado con un acuerdo de tratamiento de datos, una región nombrada, un calendario de retención y registros de acceso es, desde el punto de vista del cumplimiento, un control mejor documentado que una afirmación que nadie puede sustentar con un registro. A veces la respuesta correcta es la subida, precisamente porque viene con papeleo.

**Iniciar sesión cambia el modelo, y vale la pena decirlo con claridad.** Un conversor en el navegador que también ofrece cuentas, historial y compartir son dos productos. Sin iniciar sesión, el archivo se queda en tu máquina. En el momento en que guardas un documento en una cuenta, se almacena en un servidor, y todo lo de la fila del lado del servidor de la tabla de arriba se le aplica: retención, región, subprocesadores, y un enlace que es una credencial. Los límites también suelen cambiar. En el caso de esta herramienta la conversión está limitada a 10 MB, mientras que un documento guardado en una cuenta está limitado a 4 MB, porque la función que lo sirve rechaza una petición o una respuesta por encima de 4,5 MB. Esos números son una restricción de alojamiento y no una política, y son un buen recordatorio de que un documento guardado es una cosa distinta de uno convertido.

Hay un fallo más pequeño que también vale la pena nombrar. Las herramientas en el navegador son más débiles en formatos que necesitan un análisis de verdad — archivos binarios de oficina antiguos, PDFs cuya estructura hay que inferir, hojas de cálculo con fórmulas. Insistir en una conversión local para esos produce una mala conversión, y una mala conversión que después tienes que arreglar a mano tiene su propio coste. Mejor conocer el límite que discutir con él.

## Las comprobaciones, en orden

1. **Decide cómo se leería el documento en una filtración antes de comparar ninguna herramienta.** Si es contractual, regulado, sensible al mercado o de otra persona, la conversión tiene que ocurrir en tu máquina, y todo el mercado alojado es irrelevante hasta que eso esté resuelto — lo que te ahorra leer niveles de servicio que nunca vas a comprar.
2. **Convierte un archivo de prueba con el panel de red abierto, y después otra vez con la red apagada.** Que no aparezca nada en el panel y que la conversión siga funcionando sin conexión es la única evidencia positiva disponible; si deja de funcionar sin conexión, el archivo iba a algún sitio, sin importar lo que dijera la página de inicio.
3. **Cuenta los scripts de terceros en la página.** Cada uno corre en el origen del conversor con acceso a tu documento, así que una página con varios proveedores tiene un límite de confianza más amplio del que describe su declaración de privacidad, y ninguna cantidad de procesamiento local lo estrecha.
4. **Encuentra la frase de retención y comprueba si tiene un número dentro.** Una duración declarada es una política a la que puedes hacer responsable a alguien; la tranquilidad sin duración significa que el período es desconocido, y un período desconocido debería tratarse como indefinido.
5. **Busca en los términos una licencia de contenido y lee sus cuatro calificadores — propósito, duración, sublicencia, mejora.** Una licencia limitada por propósito que termina con tu contenido es normal; una perpetua y sublicenciable es una decisión que quizá no tengas permitido tomar en nombre de un cliente.
6. **Prueba el saneador con un documento que contenga una etiqueta de script y un manejador `onerror`.** Si sobreviven hasta la salida, el conversor es tan seguro como su entrada, lo que está bien para tus propios archivos y mal para cualquier cosa que llegó de fuera.
7. **Abre el archivo exportado en un editor de texto y búscale `http`.** Cada URL externa es una petición que va a hacer el navegador de quien lo reciba, lo que reporta que el documento se abrió; una exportación autocontenida no tiene ninguna y se comporta igual en un tren que en tu escritorio.
8. **Anota qué conversor aprobaste, para qué clase de documento, y cuándo lo comprobaste por última vez.** Dos líneas en un documento del equipo previenen el fallo habitual, que no es elegir mal sino elegir bien una vez y después nunca notar que la herramienta, los términos o el trabajo cambiaron.

## Conclusión

Seguro no es algo que un conversor sea; es algo que puedes establecer sobre un conversor en diez minutos, para un documento concreto, y las comprobaciones son lo bastante aburridas como para que escribirlas una vez cubra a todo un equipo. Lo importante es que la respuesta más fuerte es observable en vez de prometida: un conversor que hace el trabajo en tu navegador no tiene ninguna copia de tu archivo que guardar, ninguna política que confiar, y ninguna historia que contar si lo vulneran, y puedes confirmar las tres apagando la red y viendo que sigue funcionando. Eso es lo que hace [la conversión de Markdown a HTML de TransformPipe](/): sin iniciar sesión, el archivo se lee y se convierte en tu propia máquina, no se sube nada, y el HTML crudo de tu documento pasa por un saneador antes de llegar a la página. Cuando el formato de verdad necesita un servidor, elige el servicio alojado por su frase de retención y su lista de subprocesadores, no por su número de formatos, y cuando el trabajo se repite, instala algo y deja de hacerte la pregunta cada semana. Lo que no deberías hacer es convertir un contrato en una pestaña porque la página era rápida y el candado estaba en verde.

## Preguntas frecuentes

### ¿Es seguro usar un conversor online de Markdown a HTML?

Depende de si el conversor sube el archivo, y eso se puede comprobar en vez de darlo por sentado: abre el panel de red del navegador, convierte un documento de prueba, y mira si algo sale. Un conversor que corre en tu navegador procesa el archivo en tu propia máquina y no tiene nada que retener, lo que lo vuelve una opción razonable por defecto para documentos que todavía no son públicos. Un conversor alojado está bien para material público y para formatos que un navegador no puede analizar, siempre que hayas leído su declaración de retención.

### ¿De verdad no sube mi archivo un conversor basado en el navegador?

Puedes probarlo en vez de creerlo. Carga la página, desconéctate de la red, y convierte: si la conversión sigue funcionando, el analizador está corriendo localmente, porque no había nada a lo que enviarlo. Observa también el panel de red durante una conversión normal, y toma nota de cuántos scripts de terceros carga la página, porque cada uno comparte el acceso de la página a tu documento.

### ¿Cuánto tiempo guardan mis documentos los conversores online?

Los servicios alojados honestos declaran un período — borrado tras procesar, borrado tras un número fijo de horas, o guardado hasta que lo borres — y el período suele ser corto. Dos detalles se pasan por alto: una conversión fallida a menudo se guarda más tiempo que una exitosa para que soporte pueda investigarla, y las declaraciones de retención suelen cubrir el archivo y no los registros, donde viven los nombres de archivo y las marcas de tiempo. Si no encuentras una frase con una duración, trata el período como desconocido.

### ¿Los conversores online reclaman la propiedad de mi contenido?

Casi nunca la propiedad, pero la mayoría de los términos incluyen una licencia, porque un servicio que almacena y devuelve un archivo necesita permiso para almacenarlo y devolverlo. Lee esa cláusula buscando cuatro calificadores: si está limitada a prestar el servicio, si termina cuando borras tu contenido, si se puede sublicenciar, y si se extiende a mejorar el servicio o entrenar modelos. Una licencia limitada por propósito que caduca con tu contenido es normal; una perpetua y sublicenciable merece una segunda mirada, sobre todo si el documento es de un cliente.

### ¿Basta con HTTPS para que un conversor sea seguro?

No. HTTPS protege los bytes en tránsito y no dice nada sobre si deberían haberse enviado, qué hace el servidor con ellos, ni cuánto tiempo los guarda. Tampoco puede volver de extremo a extremo el cifrado de una conversión del lado del servidor, porque el servidor tiene que leer el texto en claro para convertirlo. Trata el candado como un requisito mínimo, no como evidencia de nada más.

### Ya subí algo confidencial. ¿Qué debería hacer?

Ocúpate primero del contenido, no de la política. Si el archivo contenía un token, una clave o una contraseña, rótalo ahora, porque la retención te dice cuándo se borra una copia y no quién la leyó antes. Después usa lo que sea que el servicio ofrezca para borrar, guarda una nota de qué se subió y cuándo por si tienes que reportarlo, y comprueba si el material estaba cubierto por un acuerdo que limita qué terceros pueden procesarlo.

### ¿Es siempre más seguro un conversor sin conexión que uno online?

No automáticamente. Elimina la subida, la retención y el tercero, y añade una instalación, una ruta de actualización y una cadena de suministro de paquetes que corre con el acceso de tu usuario a cada archivo que posees. Para trabajo regulado, conversión masiva y pipelines repetibles es la respuesta correcta. Para un solo archivo en una máquina en la que preferirías no instalar nada, una conversión en el navegador es el cambio más pequeño.
