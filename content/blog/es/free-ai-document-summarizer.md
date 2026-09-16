---
title: "Resumidor de IA gratis para Markdown, HTML y otros documentos"
description: "Formas gratuitas de resumir con IA un documento Markdown, HTML, Word o CSV: un resumen integrado, un chat gratis, y lo que cuesta cada uno en tiempo o en privacidad"
date: 2026-09-14
tag: Workflow
keywords: resumidor de ia gratis, resumen de documentos con ia, resumir archivo markdown, resumir archivo html, herramienta gratis para resumir documentos, resumen con ia sin subir archivos, resumir un archivo con ia gratis
---

Un documento aterriza en tu historial con un nombre y un tamaño, y ninguna de las dos cosas te dice si merece la pena abrirlo. Un resumen sí lo diría: tres frases que cuentan qué es esa cosa en realidad, antes de que te comprometas a leerla. Conseguirlo solía significar copiar el texto a algún sitio que tuviera un modelo de IA detrás, y eso es un coste real para un documento que precisamente estabas intentando no leer.

### Resumen rápido

**Un conversor con resumidor integrado** es el camino con menos fricción: conviertes o guardas el documento, pulsas Resumen y vuelve un resultado en caché — sin copiar nada, sin una cuenta aparte, sin nada que pegar. [El resumen de TransformPipe](/) usa el modelo Gemini Flash de Google directamente, de tres a cinco frases llanas, guardadas en caché sobre el documento para calcularlas una vez y leerlas muchas, gratis hasta 20 resúmenes al día por cuenta. **Un modelo de chat gratuito** —ChatGPT o la app de Gemini, las dos de uso gratuito y sin tarjeta— sirve para cualquier documento que estés dispuesto a pegar a mano, sin tope diario en la conversación misma, pero sin caché, sin API y sin ningún recuerdo del asunto una vez que el chat desaparece. **Notion AI** resume páginas de forma nativa, pero solo en el plan de pago Business, a 20 $ por miembro y mes (consultado en notion.com, 14 de septiembre de 2026): los espacios gratuitos y Plus reciben una prueba limitada, no la cosa de verdad. Elijas lo que elijas, la pregunta honesta es adónde va el texto antes de que pegues un contrato o la nota clínica de un paciente en cualquiera de ellos.

## Qué significa «gratis» aquí, en realidad

Todas las opciones de abajo son gratuitas en el sentido corriente —no hace falta tarjeta para probarlas—, pero «gratis» esconde diferencias reales en cuanto miras lo que pasa después. Un resumen que generas una vez y no vuelves a ver te cuesta el tiempo de volver a pegar el texto dentro de una semana. Un resumen guardado en caché sobre el documento está ahí cuando lo abres, sin volver a pedirlo. Y un resumen generado por un servicio que se queda con lo que le das para entrenar es un tipo de «gratis» distinto de uno que no lo hace, diga lo que diga la etiqueta del precio.

## Comparativa rápida: la chuleta

| Herramienta | Mejor para | Capacidad principal | Precio |
| --- | --- | --- | --- |
| El resumen integrado de TransformPipe | Un documento que ya está en tu historial | En caché sobre el documento, se regenera a petición, sin pegar nada aparte | Gratis, 20 al día por cuenta |
| ChatGPT (plan gratuito) | Un documento que tienes abierto y puedes pegar | Chat de texto gratis sin límite desde agosto de 2026 | Gratis |
| Google Gemini (app, plan gratuito) | Lo mismo, sobre la familia de modelos de Google | Modelos Flash y Flash-Lite, topes diarios de peticiones | Gratis |
| Notion AI | Una página que ya vive dentro de Notion | Resume y redacta dentro de la propia página | Solo plan Business, 20 $/miembro/mes |
| Un modelo local de código abierto | Cualquier cosa que no puede salir de tu máquina | Funciona del todo sin conexión, sin ninguna cuenta | Gratis, requiere configuración |
| Copiar en cualquier chat de asistente | Algo puntual, allí donde ya tengas una ventana de chat | Ninguna herramienta nueva que aprender | Gratis, la calidad varía según el modelo |

## El resumen integrado de TransformPipe — sin pegar nada aparte

En cuanto un documento se convierte o se guarda, aparece una pestaña Resumen junto a Vista previa y Fuente. Abrirla la primera vez llama al modelo; abrirla otra vez lee el resultado en caché, porque de eso trata la caché: un documento que consultas dos veces no debería pensarse dos veces.

| A favor | En contra |
| --- | --- |
| No hay que copiar el texto a ningún sitio — el documento ya está ahí | 20 resúmenes al día por cuenta, no ilimitados |
| En caché: el modelo se ejecuta una vez y el resultado se lee tantas veces como quieras | De tres a cinco frases por diseño — no sustituye a leer en detalle un documento que de verdad necesitas |
| Un botón «Regenerar» para cuando el documento ha cambiado y el resumen en caché no | Hace falta guardar antes el documento en una cuenta — un archivo convertido pero sin guardar no tiene dónde dejar el resumen |
| Disponible también por la API (`POST /api/v1/documents/:id/summary`), así que un script puede pedir lo mismo | Requiere que el despliegue tenga configurada una clave de Google AI — alojarlo tú mismo exige tu propia clave |

**Precio:** gratis, 20 al día por cuenta. La API y la CLI (`tp summary <id>`) consumen la misma cuota.

**Detalles técnicos.** El modelo es Gemini Flash de Google, llamado directamente contra una clave de Google AI Studio en lugar de a través de una pasarela de pago — una decisión de diseño tomada justamente porque mantiene disponible un plan gratuito de verdad en vez de enrutar por una cuota compartida. La instrucción se limita a los primeros 60.000 caracteres del documento y pide de tres a cinco frases llanas, sin encabezados y sin repetir el título, con el modo de razonamiento extendido del modelo desactivado a propósito: un resumen de tres frases no necesita que un modelo pase el rato decidiendo cómo formularse.

**¿Para quién es?** Para cualquiera que tenga más documentos en su historial de los que le caben en la cabeza, y esté mirando cuál abrir a continuación, o confirmando que un guardado capturó de verdad lo que quería conservar — sin una segunda herramienta, una segunda pestaña ni una segunda cuenta. Si el documento salió de un modelo para empezar, [convertir esa salida en una página que alguien pueda leer](/blog/ai-output-to-a-shareable-page) es el mismo flujo de trabajo un paso antes.

## El plan gratuito de ChatGPT — pégalo, sin límite de cuenta en la conversación

Desde agosto de 2026, OpenAI eliminó por completo el tope de mensajes del chat de texto en el plan gratuito (lo contaron Engadget y otros en su momento): las cuentas gratuitas pueden mantener una conversación tan larga como quieran, aunque siguen aplicándose topes distintos a la generación de imágenes, la subida de archivos y la voz, y el acceso gratuito se limita al modelo más pequeño que OpenAI tenga en catálogo.

| A favor | En contra |
| --- | --- |
| Sin límite diario en la conversación de texto llano | Cada documento es un pegado manual — sin historial, sin caché, sin «abre este documento y mira su resumen» |
| Sin ningún coste de cuenta | El acceso del plan gratuito se limita al modelo más pequeño del catálogo actual |
| Funciona con cualquier cosa que puedas pegar — Markdown, texto llano, una tabla pegada | Sin acceso a la API en el plan gratuito para que un script la llame |
| Interfaz conocida si ya lo usas para otras cosas | Lo que pasa con el texto pegado depende de los ajustes de datos de tu propia cuenta — míralos antes de pegar nada sensible |

**Precio:** gratis para el chat de texto; los planes de pago añaden modelos más grandes, topes de subida más altos y acceso a la API.

**¿Para quién es?** Para un resumen puntual de un documento que estás mirando ahora mismo, sin ningún interés en recuperar ese mismo resumen automáticamente la próxima vez que abras el archivo. Si lo que quieres es que el asistente convierta y comparta también, y no solo lea, [un conector es un camino más corto que una ventana de chat](/blog/converting-documents-from-an-assistant).

## La app Gemini de Google, plan gratuito

La misma familia de modelos a la que llama por API el resumen integrado está también disponible directamente, en la interfaz de chat de Google, sin necesidad de tarjeta.

| A favor | En contra |
| --- | --- |
| Gratis y sin tarjeta, en gemini.google.com y en las apps móviles | El plan gratuito está limitado a unas 1.000 peticiones al día con un límite por minuto, no es ilimitado |
| Los modelos Flash y Flash-Lite siguen siendo gratuitos; los de nivel Pro pasaron detrás de un plan de pago en abril de 2026 | La misma forma de pegar y olvidar de cualquier ventana de chat — sin historial de documentos propio |
| La misma calidad de modelo de fondo que te daría una llamada de API de pago | Una ventana de chat, no una herramienta de documentos — sin conversión, sin caché, sin enlace para compartir |

**Precio:** plan gratuito a 0 $; los de pago empiezan en 4,99 $ al mes para más margen.

**¿Para quién es?** Para quien quiere Gemini específicamente, fuera de cualquier conversor, con documentos que no le importa pegar en una ventana de chat de propósito general.

## Notion AI — nativo, pero no en el plan gratuito

Si el documento ya vive en Notion, Notion AI puede resumir la página allí mismo, redactar texto y responder preguntas sobre ella — algo genuinamente cómodo cuando el resumen es una tarea más que hacer sin salir de la página.

| A favor | En contra |
| --- | --- |
| Resume y redacta sin salir de la página en la que ya está el documento | El acceso completo a la IA exige el plan Business, 20 $ por miembro y mes (consultado en notion.com, 14 de septiembre de 2026) |
| Sin herramienta aparte ni pegado — lee la página a la que ya está enganchado | Los espacios gratuitos y Plus solo reciben una prueba limitada de las funciones de IA, no uso continuado |
| Útil más allá de resumir: redactar, autorrellenar bases de datos, actas de reuniones | Solo ayuda con documentos que son páginas de Notion — nada fuera del espacio de trabajo |

**Precio:** incluido en el plan Business; desde 2026 ya no se vende como complemento independiente.

**¿Para quién es?** Para un equipo que ya paga Notion Business y cuyo documento en cuestión es una página, no un archivo que haya que convertir o compartir en otro sitio.

## Un modelo local de código abierto — nada sale de la máquina

Para un documento que de verdad no puede llegar a una red —jurídico, médico, algo sin publicar—, un modelo de código abierto ejecutado en local (Llama, Mistral o similar, a través de un ejecutor como Ollama o LM Studio) elimina la pregunta de adónde va el texto, porque no va a ninguna parte.

| A favor | En contra |
| --- | --- |
| No se envía nada a ningún sitio, nunca — la única respuesta honesta para los documentos más sensibles | Configuración de verdad: una instalación, la descarga de un modelo de varios gigabytes y hardware capaz de moverlo con dignidad |
| Sin cuenta, sin cuota, sin límite de peticiones una vez está en marcha | La calidad del resumen va por detrás de los modelos alojados más grandes, aunque la distancia se ha acortado bastante |
| Funciona sin conexión, indefinidamente y sin coste recurrente | Sin caché ni historial de documentos, salvo que te lo construyas tú |

**Precio:** gratis y de código abierto; el coste es tu tiempo y tu máquina, no una suscripción.

**¿Para quién es?** Para quien tiene como límite real «esto no puede salir de mi máquina» y no «esto tiene que ser rápido» — son dos problemas distintos con respuestas correctas distintas.

## Dónde más se gana un resumen: el documento que antes eran cincuenta documentos

El caso en que un resumen sirve de menos es el que la gente prueba primero: un documento que escribiste tú la semana pasada. Ya sabes lo que dice; el resumen no te cuenta nada.

El caso en que sirve de verdad es la exportación fusionada: un espacio de trabajo entero de Notion, un espacio de Confluence o una bóveda de Obsidian convertidos en un solo documento Markdown. [Las tres exportaciones llegan como un zip de muchas páginas](/blog/markdown-from-notion-obsidian-and-confluence), y fusionarlas produce un único documento que es exacto, completo y completamente ilegible de un vistazo: cuarenta mil palabras con un índice, donde el índice enumera títulos de página que alguien escribió para un wiki, no para un lector.

Esa es exactamente la forma que arregla un resumen de tres frases. Convierte la exportación, guárdala y el resumen contesta a «qué hay realmente en esta cosa» sin abrirla — que es la pregunta que tienes sobre un espacio de trabajo archivado un año después, y la pregunta que nadie puede responder mirando un nombre de archivo.

| Origen | Tamaño típico ya fusionado | Qué está respondiendo el resumen |
| --- | --- | --- |
| [Una exportación de Notion](/notion-to-markdown) | Todas las páginas del espacio de trabajo, en orden | De qué proyecto o equipo era este espacio, y más o menos cuándo |
| [Una exportación de un espacio de Confluence](/confluence-to-markdown) | Todas las páginas del espacio, con sus macros aplanadas | Si este espacio era documentación, actas de reuniones o un registro de decisiones |
| [Una bóveda de Obsidian](/obsidian-to-markdown) | Todas las notas, con los wikilinks resueltos a palabras llanas | De qué iba realmente la bóveda, bajo una estructura de carpetas que solo entendía su autor |

La cuota importa aquí menos de lo que parece. Veinte resúmenes al día es poquísimo para un script recorriendo una carpeta y de sobra para una persona que decide cuál de las exportaciones archivadas del trimestre pasado abrir — y el resultado queda en caché sobre el documento, así que volver a consultar ese mismo archivo el mes que viene no cuesta absolutamente nada.

## La pregunta honesta: ¿adónde va el texto antes de que lo pegues?

Todas las opciones gratuitas de arriba implican que el texto de tu documento llegue al modelo de otra persona, salvo la local — eso no es una crítica, es el trato que hace toda función de IA alojada, y la única versión deshonesta de este artículo sería la que fingiera lo contrario. Lo que cambia es lo que pasa con ese texto después: si se usa para entrenar algo, cuánto tiempo se conserva y si las condiciones de un plan gratuito difieren de las de uno de pago. Lee la página de ajustes de verdad de la herramienta que uses antes de darle de comer un documento que no querrías ver reutilizado — la nota de privacidad de un conversor es un principio, no un sustituto de la política del proveedor del modelo.

## Cómo elegir

1. **Pregúntate si vas a necesitar el resumen más adelante.** Un resumen en caché sobre un documento que conservas gana a una transcripción de chat que tienes que buscar, siempre que quieras consultar dos veces el mismo documento.
2. **Pregúntate dónde vive ya el documento.** Una página de Notion pide Notion AI si ya lo estás pagando; un archivo pide una herramienta que lea archivos en vez de exigir un pegado manual.
3. **Cuenta con qué frecuencia haces esto.** Veinte al día es mucho para una persona y poco para un script que procesa una carpeta — ten claro cuál de los dos eres antes de darte contra el techo.
4. **Decide qué significa de verdad «no puede salir de la máquina» para este documento.** Si la respuesta honesta es «nada alojado», la vía local es la única que le es fiel de verdad, no la más rápida de montar.
5. **Comprueba los límites reales del plan gratuito antes de depender de ellos.** Un plan gratuito que ha cambiado sus topes en los últimos seis meses es lo bastante común en esta categoría como para que «consultado hoy en la propia página del proveedor» gane a una comparativa de hace un año — incluida esta.

## Conclusión

Un resumen gratuito de un documento hecho con IA está genuinamente disponible por varias vías honestas, y las diferencias que importan no van de la calidad del resumen: los modelos de fondo están lo bastante cerca, para tres frases, como para que la mayoría no sepa distinguirlos. Lo que cambia es la fricción: si el resumen está ahí cuando vuelves a abrir el documento, si hizo falta un pegado manual y si al documento se le permitió salir de tu máquina siquiera. Para un documento que ya está en [TransformPipe](/), el resumen integrado responde a las dos primeras sin preguntar; para todo lo demás, un modelo de chat gratuito está a un pegado de distancia, y un modelo local es la única respuesta a la tercera pregunta que no exige fiarse de nadie.

## Preguntas frecuentes

### ¿Hay alguna forma verdaderamente gratuita de resumir un documento con IA?

Sí, varias. Un conversor con resumidor integrado que funcione sobre un modelo de plan gratuito, una cuenta de chat gratuita como ChatGPT o la app de Gemini en la que pegas el texto, y un modelo de código abierto ejecutado en local son todas gratuitas y sin tarjeta — se diferencian en la comodidad y en si tu texto llega a un servidor siquiera.

### ¿Un resumidor de IA gratuito se queda con mi documento?

Depende por completo de la herramienta. Un resumen en caché sobre un documento que ya habías guardado vive con ese documento bajo las reglas de tu propia cuenta; el historial de una ventana de chat depende de los ajustes de retención de ese servicio, que merece la pena leer antes de pegar nada sensible. Un modelo local no se queda con nada en ninguna parte, porque nada salió de tu máquina.

### ¿Cuánto debería durar un resumen de IA de un documento?

De tres a cinco frases llanas bastan para decidir si abrir el documento completo — que es el trabajo que hace de verdad un resumen. Los resúmenes más largos empiezan a competir por tu atención con el propio documento, y llegados a ese punto ya puedes leer la fuente.

### ¿Puedo obtener un resumen de IA sin subir mi archivo a ningún sitio?

Sí, con un modelo local: el archivo y el modelo se quedan los dos en tu máquina, así que por definición no se sube nada. A falta de eso, una herramienta que funcione en el navegador y solo envíe el texto extraído a una API de resumen, en vez de almacenar el archivo original en otro sitio, es la siguiente opción más próxima.

### ¿Notion AI está incluido en el plan gratuito de Notion?

No — los espacios de trabajo de Notion gratuitos y Plus reciben una prueba limitada de las funciones de IA, y el acceso completo y continuado exige el plan Business a 20 $ por miembro y mes, según 2026. Si resumir es la única función de IA que quieres y el documento no es ya una página de Notion, un resumidor independiente y gratuito es la vía más barata.

### ¿Puedo resumir de una vez una exportación entera de Notion o de Confluence?

Sí, si antes la fusionas en un solo documento: un zip de exportación con muchas páginas se convierte en un documento Markdown con índice, y el resumen describe entonces el conjunto y no una de sus páginas. Ese es el caso en que más vale un resumen, porque una exportación fusionada de cuarenta mil palabras es exactamente el documento que nadie abre para averiguar qué era.

### ¿El resumen se vuelve a ejecutar cada vez que abro el documento?

No debería, y una herramienta que lo reejecuta está gastándote la cuota a la chita callando. Un resumen en caché se calcula una vez, se guarda con el documento y se lee en cada apertura posterior — con un control para regenerarlo en el caso de que el documento haya cambiado y las frases guardadas ya no lo describan.

### ¿Qué diferencia hay entre el plan gratuito de ChatGPT y pagar por él?

Desde agosto de 2026, el chat de texto del plan gratuito no tiene tope de mensajes, pero las cuentas gratuitas están limitadas al modelo más pequeño que OpenAI tiene en catálogo y tienen topes aparte, más estrechos, en generación de imágenes, subida de archivos y voz — y ningún acceso a la API, lo cual importa si quieres que resuma un script y no una ventana de chat.
