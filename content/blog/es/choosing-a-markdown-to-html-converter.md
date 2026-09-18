---
title: Cómo juzgar un conversor de Markdown en cinco minutos
description: Escribe primero qué exige tu situación, y luego pasa un documento de prueba incómodo por los candidatos. Siete comprobaciones y una hoja de puntuación para copiar.
updated: 2026-09-09
date: 2026-06-23
tag: Conversión
keywords: mejor conversor markdown a html, comparativa de conversores markdown, editor markdown online, herramienta markdown gratis, conversor markdown sin registro, conversor markdown con api, conversor markdown de codigo abierto, como elegir un conversor markdown, requisitos de un conversor markdown, probar un conversor markdown
---

Las páginas de aterrizaje de los conversores prometen casi lo mismo: rápido, gratis, HTML limpio. Nada de eso se puede comprobar desde la página, y las diferencias que te cuestan una tarde permanecen invisibles hasta que pegas algo dentro. Así que pega algo. Un documento y cinco comprobaciones separan a las herramientas que aguantan de las que te sorprenden una semana después.

### Resumen rápido

Escribe qué exige tu situación antes de abrir ninguna herramienta: un documento que le envías a una persona, un sitio de documentación, contenido de usuario renderizado dentro de una aplicación, un paso de CI y un archivo a largo plazo quieren cosas distintas, y la herramienta correcta para uno es la incorrecta para el siguiente. Luego pasa un documento de prueba deliberadamente incómodo por cada candidato en la misma sesión, y lee el código HTML fuente en vez de la vista previa. Cinco comprobaciones —qué dialecto habla, qué hace con una etiqueta script, si el archivo se sostiene solo, adónde fue tu archivo, y qué dicen realmente la API y sus límites— resuelven la mayor parte en unos cinco minutos. Dos más, imprimir e ids de encabezado, tardan treinta segundos cada una y atrapan las quejas que llegan un mes después.

La razón por la que las listas de funciones no ayudan es que la lista de todo conversor es la misma lista. Tablas, resaltado de código, vista previa en vivo, exportación. Lo que los separa es el comportamiento bajo presión: un archivo con algo que el analizador nunca ha visto, un archivo que escribió otra persona, un archivo que tiene que abrirse en una máquina sin red. Nada de eso está en la página, y nada de eso es caro de averiguar.

Esta pieza trata sobre los criterios y las pruebas. Si lo que quieres son las herramientas en sí, unas contra otras, [la comparativa es un artículo aparte](/blog/best-markdown-to-html-converters); lo que sigue es el método que usarías para revisar cualquier cosa de esa lista, incluidas las que se añadan después de escribirla.

## Los requisitos primero: qué exige realmente tu situación

El error más común no es elegir la herramienta equivocada. Es elegir una herramienta antes de decidir qué tiene que ser verdad. Cinco situaciones cubren casi todo para lo que la gente convierte Markdown, y cada una exige algo que las demás pueden ignorar por completo.

| La situación | Qué debes exigir | Qué puedes ignorar sin riesgo | La comprobación que lo resuelve |
| --- | --- | --- | --- |
| Un documento para enviar a una persona | Un archivo HTML completo con estilos en línea e imágenes incrustadas, sin peticiones externas, y el dialecto que ya usa tu archivo | Saneado, porque tú escribiste el archivo; una API; conversión por lotes; anclas de encabezado | Descárgalo, apaga la red, ábrelo en otra máquina |
| Un sitio de documentación | Ids de encabezado estables, un dialecto que coincida con lo que escribe tu equipo, una compilación que corra sola y falle con claridad | Salida autocontenida — el sitio ya trae su propia hoja de estilos— y la privacidad del origen, que ya es público | Compila dos veces desde la misma entrada y compara los dos HTML |
| Renderizar contenido de usuario dentro de una aplicación | Un saneador con lista de permitidos, aplicado donde el usuario no pueda alcanzarlo, y un valor por defecto documentado para el HTML crudo | Documentos autocontenidos, estilos de impresión, botones de descarga, temas | Pega los cinco vectores de ataque de abajo e inspecciona el DOM renderizado |
| Un paso de CI | Sin instalación, o una instalación fijada; un código de salida que signifique algo; límites de tasa publicados; un cuerpo de error que un script pueda analizar | Una interfaz de usuario, historial, compartir, comodidad de edición | Pásale un archivo malformado y lee el código de salida y el stderr |
| Un archivo que tienes que abrir en diez años | Un archivo por documento, sin recursos externos, un formato abierto, y una licencia que te deje seguir corriendo la herramienta | Una API, compartir, velocidad, sincronización en la nube | Abre hoy la exportación del año pasado, sin conexión, en un navegador que no usabas entonces |

Lee la segunda columna y la tercera, y el conflicto es obvio. La herramienta que gana la primera fila — un conversor que incrusta todo en un archivo pesado— es un mal ajuste para la segunda, donde incrustar la misma hoja de estilos en cuatrocientas páginas es desperdicio. La herramienta que gana la tercera fila es una librería, no un sitio web, y no tiene ningún botón de exportar porque nunca estuvo pensada para darte un archivo.

Vale la pena hacer una distinción más antes de empezar. Un conversor convierte un documento en un documento. Un generador convierte un directorio en un sitio. Si tu respuesta a «¿adónde va la salida?» es una URL con navegación, búsqueda y enlaces cruzados, estás comprando en la categoría equivocada, y ninguna cantidad de pruebas sobre conversores lo va a arreglar.

Así que los primeros cinco minutos no se gastan en una herramienta. Se gastan escribiendo tres líneas: qué tiene que ser la salida, quién escribió la entrada, y dónde tiene que correr la conversión. Todo lo que viene después es verificación.

## El documento de prueba

Este es deliberadamente incómodo. Lleva GitHub Flavored Markdown que el CommonMark puro no reconoce, cinco formas distintas de meter un script en una página, una imagen que no existe, y un puñado de construcciones que separan en silencio a un analizador cuidadoso de uno descuidado.

````markdown
---
title: Converter test
draft: true
---

# Converter test

| Feature    | Status | Notes    |
| ---------- | :----: | -------- |
| Tables     |   ok   | GFM only |
| Task lists |   ok   | GFM only |

- [x] Ticked box
- [ ] Empty box
  - Nested item
    continued on a lazy line

~~Struck through~~, and a bare URL: https://example.com

A line that ends in two spaces,  
and the line that follows it.

A footnote reference.[^1]

[^1]: The footnote body.

```js
const clean = sanitise(rendered);
```

## A heading with punctuation & a "quote"

<script>alert('script tag')</script>

[A link](javascript:alert('href'))

<img src=x onerror="alert('handler')">

<iframe src="https://example.com"></iframe>

<svg onload="alert('svg')"><circle r="10" /></svg>

![Broken image](does-not-exist.png)

Unicode: an em dash — and a ligature: ﬁ
````

Pégalo, convierte, y lee el resultado — y luego lee el código HTML fuente, no solo la vista previa. Una vista previa puede verse bien mientras el archivo detrás es un desastre, porque la vista previa la renderiza la propia página de la herramienta, con su propia hoja de estilos, en un navegador que ya ha cargado lo que la herramienta cargue.

Cada línea de ese documento está ahí por una razón. Esto es lo que pregunta cada una, y cómo se ve que la pasó.

| La línea | Qué comprueba | Cómo se ve que la pasó |
| --- | --- | --- |
| El bloque `---` de arriba | El manejo del front matter | Desaparece, o se convierte en tabla. Un párrafo de líneas `clave: valor` al principio del documento es un fallo |
| `# Converter test` | Si la herramienta asume un título | Un `<h1>`, o el título llevado a `<title>`. Las dos son defendibles; descartarlo en silencio no lo es |
| La tabla de pipes | Tablas GFM | Un `<table>` real con celdas `<th>` y la columna central alineada |
| `- [x]` y `- [ ]` | Listas de tareas GFM | `<input type="checkbox" disabled>` dentro de los elementos de lista, no corchetes literales |
| El elemento anidado con continuación perezosa | Análisis de listas bajo presión | Un `<li>` anidado cuyo texto continúa. Dos elementos de lista separados es un fallo |
| `~~Struck through~~` | Tachado GFM | Un elemento `<del>` o `<s>`, no virgulillas visibles |
| La URL sin marcar | Autoenlaces GFM | Un `<a href>`. Texto plano es comportamiento de CommonMark, no un fallo |
| Dos espacios al final | Saltos de línea forzados | Un `<br>` entre las dos líneas |
| `[^1]` y su cuerpo | Notas al pie, que no están en ninguna especificación | Un enlace en superíndice y una lista al pie, o el `[^1]` crudo visible. Eliminarlo en silencio pierde tu texto |
| El bloque `js` | Código con cercas y cadenas de información | `<pre><code class="language-js">`, con el código escapado |
| El encabezado con `&` y comillas | Escapado, e ids de encabezado | `&amp;` en la salida, e idealmente un `id` al que puedas enlazar |
| `<script>` | Paso de HTML crudo | Escapado, o eliminado. Presente e intacto es un fallo |
| El enlace `javascript:` | Filtrado de esquemas de URL | El `href` desaparecido, o reescrito. Un enlace `javascript:` vivo es un fallo |
| `onerror=` en una imagen | Filtrado de atributos | El atributo eliminado. La imagen puede quedarse; el manejador no |
| `<iframe>` | Documentos incrustados | Eliminado, o escapado. Un iframe en un documento que envías por correo es la página de otro dentro de la tuya |
| `<svg onload>` | El vector que la gente olvida | El elemento eliminado o el manejador retirado. SVG es marcación, y la marcación lleva manejadores |
| La imagen rota | Manejo de rutas | El `src` copiado tal cual, o el archivo incrustado. Cualquiera de las dos está bien mientras sepas cuál es |
| El guion largo y la ligadura | Codificación | Los dos caracteres intactos, con un `<meta charset>` en el head. Que se rompan aquí es que se rompen en todas partes |

Dieciocho líneas, un solo pegado. Conserva el archivo: es corto, va bien al lado de tu documentación, y volver a pasarlo lleva un minuto cuando una herramienta cambia su saneador o su hoja de estilos.

## Comprobación uno: qué dialecto habla

Mira primero la tabla y las dos casillas. Si la tabla salió como un párrafo de caracteres de pipe y las casillas como corchetes literales, el conversor corre CommonMark puro o algo muy cercano. No es un fallo: las tablas y las listas de tareas son extensiones de GitHub Flavored Markdown, y [los dialectos difieren de verdad](/blog/commonmark-gfm-and-the-flavours) en lo que reconocen.

Solo importa si tus documentos usan esas funciones. Un README con una tabla comparativa y una lista de tareas pendientes usa las dos. El tachado y la URL sin marcar también son extensiones GFM, así que comprueba las cuatro de una vez.

Estas son las construcciones que separan a los dos dialectos, y cómo se ve cada fallo en la página en vez de en la especificación.

| Construcción | Se escribe como | CommonMark | GFM | Qué ves cuando falta |
| --- | --- | --- | --- | --- |
| Tablas | Pipes y una fila delimitadora | No | Sí | Un párrafo de pipes y guiones, envuelto por el navegador |
| Listas de tareas | `- [x]` al principio de un elemento | No | Sí | `[x]` y `[ ]` literales como primeros caracteres de cada viñeta |
| Tachado | `~~texto~~` | No | Sí | Virgulillas visibles alrededor de las palabras |
| Autoenlaces | Una URL `https://` sin marcar | No | Sí | La URL como texto plano, no clicable |
| Código con cercas | Triple acento grave | Sí | Sí | Nada — las dos lo gestionan |
| Cadenas de información | Un nombre de lenguaje tras la cerca | Sí | Sí | La clase puede variar; busca `language-js` |
| Notas al pie | `[^1]` y una definición | No | No | `[^1]` crudo en el texto, o un párrafo que falta en silencio |
| Ids de encabezado | Nada — se infieren | No | Los añade el renderizador, no el analizador | Encabezados sin `id`, y por tanto sin ancla |
| HTML crudo | Una etiqueta HTML en el origen | Pasa tal cual | Pasa tal cual, filtrado por GitHub | Depende por completo de la herramienta; ver la siguiente comprobación |
| Saltos de línea | Dos espacios al final | Sí | Sí | Las dos líneas se juntan si la herramienta recorta los espacios primero |

De esa tabla salen dos cosas. Las notas al pie no están en ninguna especificación, así que cualquier herramienta que las soporte lo hace como extensión, y cualquiera que no las soporte puede descartar el texto en vez de dejar la marca — comprueba la referencia y el cuerpo por separado. Y los ids de encabezado no son en absoluto una función de análisis: GitHub los añade al renderizar, por lo que un ancla de encabezado que funciona en github.com puede simplemente no existir en el HTML que produce tu conversor.

Si tus documentos viven en GitHub y se renderizan bien ahí, GFM es tu requisito y una herramienta solo CommonMark va a perder cuatro cosas en silencio. Si tus documentos son prosa con encabezados y enlaces, el CommonMark puro es suficiente y la pregunta del dialecto se resuelve en diez segundos.

## Comprobación dos: qué hace con la etiqueta script

Markdown permite HTML crudo, y la mayoría de analizadores lo pasan directamente a la salida; unos pocos lo escapan por defecto y solo lo dejan pasar si se lo pides. En cualquier caso, sanear es una decisión aparte que tomó la herramienta, con tres resultados posibles.

| Resultado en el código HTML | Qué significa |
| --- | --- |
| `&lt;script&gt;` y la etiqueta visible en la página | El HTML crudo se escapa. Seguro, y bien para tus propios archivos |
| Ni rastro del script, de `onerror`, ni del enlace `javascript:` | Corrió un saneador con lista de permitidos |
| `<script>` intacto, o `onerror=` sigue en la imagen | Nada lo filtró |

El tercer resultado solo muerde cuando el Markdown vino de algún sitio distinto de tu propia máquina — la descripción de una pull request, un ticket de soporte, la salida de un modelo de lenguaje. En la prueba la alerta es inofensiva; con el Markdown de un desconocido no lo es, y corre en cualquier página en la que pegues el resultado.

No te conformes con probar un solo vector. Una herramienta puede quitar `<script>` y no tocar nada más, porque eliminar una etiqueta por nombre es fácil y razonar sobre atributos y esquemas de URL no lo es. Busca en la salida cada uno de estos, uno por uno.

| Vector | Qué hace si sobrevive | Qué devuelve una herramienta segura |
| --- | --- | --- |
| `<script>alert('script tag')</script>` | Ejecuta código arbitrario en el momento en que carga la página | El elemento desaparecido por completo, o todo escapado a texto `&lt;script&gt;` |
| `<img src=x onerror="alert('handler')">` | Ejecuta código cuando la imagen deliberadamente rota falla al cargar, que es inmediato | El `<img>` puede quedarse; `onerror` se retira de él. Cualquier atributo `on*` es un manejador |
| `[A link](javascript:alert('href'))` | Ejecuta código cuando el lector hace clic en algo que parece un enlace normal | El `href` eliminado, vaciado o reescrito. Los esquemas permitidos suelen ser `http`, `https`, `mailto` y `#` |
| `<iframe src="https://example.com"></iframe>` | Carga la página de un tercero dentro de la tuya, con sus scripts y sus cookies | El elemento eliminado. Un iframe es algo que rara vez necesita un documento Markdown |
| `<svg onload="alert('svg')">…</svg>` | Ejecuta código a través de marcación que la gente olvida que es marcación. SVG también puede llevar su propio `<script>` | El elemento eliminado, o el manejador y cualquier script anidado retirados de él |

Una herramienta que elimina las cinco corre una lista de permitidos: conserva los elementos y atributos que conoce y descarta todo lo demás. Una que elimina algunas y no otras corre una lista de bloqueados, una posición perdedora — la lista de cosas peligrosas crece y la de cosas seguras no. [Los detalles de hacer esto bien](/blog/sanitising-markdown-safely) importan aunque nunca escribas un saneador tú mismo, porque te dicen cuál de las dos estás mirando.

Una cosa más que comprobar mientras estás aquí: dónde ocurre el saneado. Un conversor que sanea en el navegador y no en el servidor ha protegido su propia vista previa y nada más, porque un script puede publicar directamente al endpoint y saltarse la página. Si la herramienta tiene una API, pasa los mismos vectores por ella y compara las dos salidas.

## Comprobación tres: si la salida se sostiene sola

Descarga el archivo, apaga tu red, y ábrelo. Luego busca en el código fuente `<link`, `<script` y `http`.

Un fragmento desnudo te da `<h1>` y `<p>` y nada más: HTML correcto, que abre como texto sin estilo. Un documento completo que trae su hoja de estilos o su resaltador desde un CDN se ve bien hoy y se rompe en un avión, en una intranet, o cuando el CDN se mude. Un archivo autocontenido tiene sus estilos en línea, sin scripts y sin peticiones. Ese es el que puedes mandar por correo a alguien.

Merece la pena hacer las búsquedas de una en una, porque cada una responde una pregunta distinta.

| Busca en el código fuente | Si lo encuentras | Qué te cuesta |
| --- | --- | --- |
| `<!DOCTYPE` | Bien — esto es un documento, no un fragmento | Sin él tienes `<h1>…</h1><p>…</p>` y un navegador renderizando a su ancho por defecto |
| `<meta charset` | Bien — la codificación está declarada | Sin él, el guion largo y la ligadura se vuelven mojibake en la máquina de otra persona |
| `<link rel="stylesheet"` | Los estilos viven en otro sitio | El archivo queda sin estilo en el momento en que ese otro sitio deja de ser accesible |
| `<style>` | Bien — los estilos están en el archivo | Nada; esto es lo que quieres para un documento que envías |
| `<script` | Algo quiere ejecutarse | En el mejor caso un resaltador, en el peor un rastreador. De cualquier forma el archivo ya no es inerte |
| `http://` o `https://` en un `src` o `href` | Se pide un recurso al abrir el archivo | Fuentes, imágenes y resaltadores que desaparecen sin conexión, y un registro de que el archivo se abrió |
| `data:image` | Una imagen incrustada en el archivo | Un archivo más grande, y uno que abre en cualquier parte. Suele ser el trato que quieres |

[Lo que significa realmente «autocontenido»](/blog/self-contained-html-explained) merece leerse antes de exigirlo, porque las herramientas usan la frase con soltura: algunas quieren decir «un documento completo» y otras «no le pide nada a la red», y solo la segunda sobrevive al avión.

La imagen rota está en la prueba por la misma razón. Un conversor copia un `src` de imagen tal cual salvo que le pidas incrustar el archivo, así que una ruta relativa se resuelve contra donde cae el HTML, no donde vivía el Markdown. Mueve el HTML un directorio arriba y cada imagen relativa se rompe — sin error, sin aviso, y normalmente sin que nadie se dé cuenta hasta que el destinatario lo menciona.

## Comprobación cuatro: adónde va tu archivo, y si se queda ahí

Abre la pestaña de red del navegador antes de convertir. O el archivo se sube o no se sube, y la lista de peticiones lo resuelve. Convertir en el navegador significa que el documento nunca sale de tu máquina; también significa que no hay nada a lo que volver mañana.

Esta es la comprobación que más merece hacerse en vez de creerse, porque es sobre la que toda herramienta hace la misma afirmación. Cuatro pasos, en orden, ninguno de más de un minuto.

1. **Observa la pestaña de red.** Ábrela, límpiala, convierte el documento de prueba, y lee la lista. Una conversión que pasa en tu máquina no muestra ninguna petición con tu archivo. Una que sube muestra un `POST` con tu contenido dentro, y puedes abrir esa petición y leer exactamente qué se envió.
2. **Convierte con la red apagada.** Carga la página, luego desconéctate, luego convierte. Una herramienta de navegador sigue funcionando. Una del lado del servidor falla, lo que no es una crítica — es una respuesta, y definitiva.
3. **Encuentra la frase de retención.** No la línea de marketing sobre privacidad: la frase que dice cuánto tiempo se guarda un archivo subido y qué lo borra. Si la política de privacidad no contiene ninguna duración, la lectura honesta es que no hay política.
4. **Lee los términos por la cláusula de licencia.** Muchas herramientas alojadas se quedan con una licencia para guardar y procesar lo que subes, algo que necesitan para funcionar siquiera. Lo que importa es el alcance: si termina cuando borras el archivo, y si se extiende más allá de correr el servicio.

[Si un conversor online es seguro](/blog/is-an-online-converter-safe) tiene una respuesta real para cualquier herramienta concreta, y suele ser visible con quince minutos de lectura más las dos pruebas de arriba.

Ese es el verdadero dilema, no privacidad contra comodidad. Una herramienta sin cuenta no puede guardar un historial, no puede darte un enlace para enviar a alguien, y no puede ofrecer una API. Una herramienta con cuenta hace las tres cosas y ahora tiene tus documentos. Si la respuesta es «ninguna de las dos, quiero esto en un script», deja de evaluar sitios web y usa una librería o un conversor de línea de comandos; y si necesitas PDF, DOCX o LaTeX al otro lado, Pandoc convierte a los tres y es software libre bajo la GPL (comprobado en pandoc.org, el 9 de septiembre de 2026); un conversor de navegador que te da un archivo HTML no compite por ese trabajo.

Hay una posición intermedia que merece conocerse: una herramienta que convierte en el navegador mientras no has iniciado sesión y solo guarda documentos cuando se lo pides. Te da la respuesta de la pestaña de red por defecto, e historial y compartir cuando decides que el trato vale la pena. Lo importante es que la decisión es tuya y es visible, en vez de tomada por ti en un párrafo que no leíste.

## Comprobación cinco: la API, las claves y los límites

Si un conversor ofrece una API, cuatro preguntas la resuelven, y la documentación debería responder las cuatro antes de que te registres:

- [ ] ¿Se puede revocar una clave, y la revocación surte efecto de inmediato?
- [ ] ¿La clave se guarda con hash, o soporte podría leértela de vuelta?
- [ ] ¿Cuál es el límite de tasa, y cómo es la respuesta cuando lo superas?
- [ ] ¿Qué pasa cuando la cuenta está llena — se rechaza la escritura, o se borra en silencio algo más viejo?

La última es la que la gente se salta. Una herramienta que descarta tu documento más antiguo para hacer sitio al nuevo ha decidido algo sobre tus datos, y te enteras en el peor momento. Rechazar la escritura es el comportamiento honesto.

Antes de nada de eso, mira la forma de la petición. Una API sobre la que puedes construir es una que puedes llamar con `curl` y entender solo con la respuesta, sin necesitar un SDK que te la traduzca.

```bash
# The shape to look for: one endpoint, a bearer key, the document as the body
curl -sS -X POST "https://api.example.com/v1/documents?name=README.md" \
     -H "Authorization: Bearer <key>" \
     --data-binary @README.md

# And the refusal you can act on: a status that means something, and a body a script can parse
# HTTP/1.1 413
# { "error": "document is over 4 MB" }
```

Tres cosas de ese intercambio merecen exigirse. La clave viaja en una cabecera y no en un parámetro de la URL, así que no acaba en los registros del servidor ni en el historial del navegador. El cuerpo es el documento en sí y no un sobre JSON con el archivo codificado en base64 dentro, lo que mantiene el tamaño bajo y elimina un paso de codificación de tu script. Y el fallo es un código de estado más un cuerpo analizable, así que un trabajo de CI puede distinguir «demasiado grande» de «demasiado rápido» de «no es tuyo» sin leer inglés.

Luego, empuja deliberadamente más allá del camino feliz. Envía un archivo por encima del límite y lee el estado. Envía veinte peticiones en un segundo y lee el estado. Envía una clave mala, y una clave de otra cuenta. Una API bien construida responde `413`, `429`, `401` y `404` en esos cuatro casos, con un cuerpo que explica cuál; una mal construida responde `500` cuatro veces, o `200` con un mensaje de error escondido en el HTML.

Los límites publicados son la otra mitad de la misma pregunta. Un límite que puedes leer es un límite alrededor del que puedes diseñar; un límite descubierto en producción es una caída del servicio. TransformPipe limita una cuenta a 100 MB y 500 documentos, una conversión a 10 MB, un documento guardado a 4 MB y una llamada a 60 peticiones por minuto; alcanzar un límite rechaza la escritura en vez de borrar nada, y los endpoints, los estados y el formato de la clave están en [la documentación](/docs). La cifra de 4 MB es una restricción de la plataforma más que una preferencia — la función que hay debajo rechaza una petición o una respuesta de más de 4,5 MB—, algo que merece decirse en vez de esconderse, porque te dice sobre qué estás construyendo.

Si estás integrando la conversión en una compilación o un bot en vez de hacer clic en un botón, [qué exigir de una API de conversión de documentos](/blog/converting-documents-with-an-api) profundiza más en las formas de las peticiones, el comportamiento de reintento y los fallos que solo importan en una tubería.

## Dos comprobaciones más, y una hoja para puntuar las siete

Cinco comprobaciones cubren las formas en que un conversor falla a gritos. Dos más cubren las formas en que falla en silencio, y ninguna tarda más de treinta segundos.

**Qué hace la salida al imprimirse.** Abre la vista previa de impresión. Un tema oscuro que sigue oscuro en papel desperdicia un cartucho y hace el documento illegible en el único formato que la gente todavía se entrega en mano en las reuniones. Comprueba tres cosas: si los colores cambian a valores claros, si los bloques de código se ajustan en vez de cortarse en el borde de la página, y si las URLs de los enlaces se imprimen junto al texto del enlace o se pierden por completo. Un documento con catorce enlaces que imprime como catorce frases subrayadas ha tirado la mayor parte de su contenido. TransformPipe escribe un solo archivo autocontenido con estilos en línea y sin scripts, y cambia a valores claros al imprimir; sea la herramienta que uses, mira la vista previa una vez antes de confiarle algo que vas a imprimir.

**Si los encabezados llevan ids a los que se pueda enlazar.** Busca en la salida `id="` junto a un `<h2>`. Si faltan los ids, no puedes enlazar a una sección, no puedes construir un índice sin escribir JavaScript, y un colega que cita tu documento tiene que decir «la parte sobre los límites» en vez de mandar una URL. Si los ids existen, comprueba que se derivan del texto del encabezado en vez de ser `heading-3` — un id posicional cambia en el momento en que alguien inserta una sección antes, lo que rompe cada enlace que se envió alguna vez. El encabezado con puntuación de la prueba está ahí para mostrar cómo se construye el id: uno bueno convierte el texto en slug, quita la puntuación, y produce el mismo id cada vez que se convierte ese encabezado.

Las dos importan más para documentación que para un documento puntual, que es el tema de todo este ejercicio. Las comprobaciones no tienen pesos universales, y un fallo en una fila que no te importa no es un fallo.

Aquí está la hoja. Cópiala, rellena una columna por candidato, y marca cada celda como pasa, falla o no aplica.

| # | Comprobación | Cómo se ve que la pasó | Herramienta A | Herramienta B |
| --- | --- | --- | --- | --- |
| 1 | Dialecto | La tabla renderiza, las casillas son checkboxes, el tachado se tacha, la URL sin marcar se enlaza | | |
| 2 | Saneado | Los cinco vectores neutralizados, tanto en el servidor como en el navegador | | |
| 3 | Autónomo | Doctype, charset, `<style>` en línea, sin `http` en ningún `src` ni `href` | | |
| 4 | Privacidad | La pestaña de red confirma la afirmación, y existe por escrito una duración de retención | | |
| 5 | API y límites | Clave tipo bearer, errores analizables, `413` y `429` donde se esperan, límites publicados | | |
| 6 | Impresión | Colores claros en papel, código ajustado, enlaces legibles | | |
| 7 | Ids de encabezado | Un `id` en cada encabezado, derivado del texto, estable entre ejecuciones | | |
| — | Front matter | Eliminado o renderizado como tabla, no como párrafo de `clave: valor` | | |
| — | Codificación | Guion largo y ligadura intactos, `<meta charset>` presente | | |
| — | Notas al pie | Renderizadas, o dejadas como marca visible. No descartadas en silencio | | |

Las tres filas sin número atrapan a quien convierte archivos de otros sistemas: notas exportadas de una herramienta de documentación, documentos escritos en otro sistema operativo, prosa académica. Puntúalas si tus archivos vienen de algún sitio distinto de tu propio editor.

Pondera las filas antes de sumarlas. Para un documento que le envías a alguien, las filas tres y seis valen más que todo el resto juntas, y la dos es irrelevante. Para contenido de usuario dentro de una aplicación, la fila dos es toda la prueba y las filas tres y seis no aplican. Una hoja con pesos iguales produce un número ordenado y la herramienta equivocada.

## Lo que cinco minutos no te pueden decir

Un documento de prueba es un buen instrumento y uno estrecho. Te dice qué hace una herramienta hoy, con un archivo, en tu navegador. Tres cosas que no te puede decir son las tres que más probablemente importen después.

**Una puntuación no te puede decir que estás puntuando la categoría equivocada de herramienta.** Un generador de sitios estáticos falla casi todas las comprobaciones de arriba — no te da un archivo, no sanea, no tiene API, y quiere un archivo de configuración y un paso de compilación— y sigue siendo la respuesta correcta si estás publicando cuarenta páginas que se enlazan entre sí. La hoja mide qué tan bien hace una herramienta el trabajo con el que la probaste, y no dice nada sobre si ese era el trabajo que necesitabas hacer.

**Una prueba de cinco minutos no te puede decir cómo será una herramienta en un año.** No puede ver un cambio de propiedad, una página de precios que aparece, una API que gana un parámetro obligatorio, o un mantenedor que deja de responder. Lo que sí puede ver son las propiedades que predicen esas cosas. La licencia es una: una librería MIT o BSD no te la pueden quitar, porque la copia que tienes sigue con licencia para ti pase lo que pase después. La propiedad es otra: un proyecto de código abierto independiente, una empresa con un producto de pago, y un servicio alojado gratis sin modelo de negocio visible fallan de formas distintas y en plazos distintos, y el tercero es el que desaparece sin avisar. Si puede correr sin conexión es la tercera: una herramienta que corre en tu máquina sigue funcionando cuando la empresa no, y una que corre en el servidor de alguien es exactamente tan duradera como ese servidor.

**Un documento de prueba no te puede decir qué contienen tus propios documentos.** El archivo de arriba es una muestra; tus archivos reales tienen sus propias costumbres — una tabla con cien filas, una galería de capturas de pantalla, un bloque de código en un lenguaje que nadie resalta, un nivel de encabezado que salta de dos a cuatro. Pasa también un documento real, idealmente el más grande y feo que tengas. La mitad de los problemas que la gente reporta con conversores no son problemas del conversor en absoluto; son un archivo poco habitual que la herramienta nunca vio.

### Los criterios, en orden

1. **Decide el destino antes de abrir una herramienta.** Una persona, un sitio, una aplicación, una tubería o un archivo — la respuesta elimina casi todo el mercado de inmediato, y saltarse este paso es cómo la gente acaba comparando un generador de sitios contra un conversor y concluyendo que los dos son decepcionantes.
2. **Ajusta el dialecto a los archivos que realmente tienes.** Si tus documentos contienen tablas o listas de tareas, un analizador solo-CommonMark las pierde en silencio, y te enteras cuando un colega pregunta por qué la tabla comparativa es un muro de pipes.
3. **Decide sobre el saneado preguntando quién escribió el archivo.** Para tus propias notas no importa en absoluto; para cualquier cosa que llegó de fuera, o el conversor sanea contra una lista de permitidos o lo haces tú, y no hay una tercera opción que acabe bien.
4. **Insiste en un documento, no un fragmento.** Un conversor que devuelve `<h1>…</h1><p>…</p>` se ha comportado correctamente como librería y ha fallado como herramienta, y la diferencia se ve en el momento en que alguien distinto de ti abre el archivo.
5. **Verifica la afirmación de privacidad en vez de leerla.** La pestaña de red responde en diez segundos lo que una política de privacidad tarda una página en insinuar, y la respuesta es «no se envió nada» o «esto exactamente es lo que se envió».
6. **Revisa los fallos, no los éxitos.** Cualquier cosa convierte un párrafo. Lo que separa a las herramientas es la respuesta a un archivo por encima del límite, una tabla malformada, una clave incorrecta y veinte peticiones en un segundo — y esas respuestas son lo que tu automatización va a pasarse la vida gestionando.
7. **Prefiere la propiedad que sobrevive a la prueba.** Una licencia permisiva, código que puedes correr sin conexión, un formato de salida abierto y límites publicados son todos comprobables hoy y todos siguen siendo verdad en tres años, que es más de lo que puede afirmar una lista de funciones.

Pasa el documento de prueba por la herramienta que usas ahora y por la que estás considerando, en una sola sesión: misma entrada, dos fuentes que comparar. La mayoría de las veces la incumbente gana en una fila y pierde en otra, y la hoja convierte una preferencia vaga en una decisión que puedes explicarle a otra persona. Si la fila en la que pierdes es la exportación autocontenida, [convertir Markdown a HTML en el navegador](/) es la forma más corta de arreglarlo, gratis y sin nada que instalar; si la fila en la que pierdes es el dialecto o el saneado, el arreglo suele ser una librería distinta y no una web distinta. En cualquier caso, conserva el archivo. La próxima herramienta que evalúes te va a llevar cinco minutos en vez de una tarde.

## Preguntas frecuentes

### ¿Con qué debería probar un conversor de Markdown?

Con un documento deliberadamente incómodo en vez de un párrafo de prosa: una tabla GFM, listas de tareas, tachado, una URL sin marcar, un bloque de código con cercas, front matter, una nota al pie y los cinco vectores de ataque de HTML crudo. Añade también un archivo real tuyo, idealmente el más largo y raro que tengas, porque tus documentos tienen costumbres que ninguna muestra cubre.

### ¿Cómo sé si un conversor sanea?

Convierte un documento que contenga `<script>`, un atributo `onerror`, un enlace `javascript:`, un `<iframe>` y un `<svg onload>`, y luego lee el código HTML fuente en vez de la vista previa. Si los cinco han desaparecido o están escapados, corrió una lista de permitidos; si sobrevive alguno, la herramienta filtra por nombre y se va a perder también el siguiente vector.

### ¿Importa si el conversor solo soporta CommonMark?

Solo si tus archivos usan las cuatro cosas que CommonMark deja fuera: tablas, listas de tareas, tachado y autoenlaces de URL sin marcar. La prosa con encabezados, listas, enlaces y bloques de código renderiza igual en los dos casos, así que revisa tus propios documentos antes de tratar el dialecto como un factor decisivo.

### ¿Un conversor que corre en el navegador es siempre más privado?

Es más privado en el sentido que más importa — el archivo no se transmite, y puedes confirmarlo en la pestaña de red en diez segundos. No es automáticamente más seguro en todos los sentidos, porque una herramienta de navegador igualmente renderiza cualquier HTML que contenga el documento, así que la pregunta del saneado es aparte y aplica igual.

### ¿Cómo reviso un conversor sin instalar nada?

Abre la herramienta, abre las herramientas de desarrollador del navegador, pega el documento de prueba y convierte. La pestaña de red responde la pregunta de privacidad, el panel de elementos responde la pregunta del saneado, y el archivo descargado responde la pregunta de si es autónomo — tres de las siete comprobaciones, sin instalación y sin cuenta.

### ¿Qué debería buscar en la API de un conversor antes de construir sobre ella?

Una clave enviada como cabecera bearer y no como parámetro de consulta, una revocación que surte efecto de inmediato, claves guardadas con hash, límites de tasa y tamaño publicados, y respuestas de error que sean un código de estado con sentido más un cuerpo analizable. Luego pon a prueba los rechazos deliberadamente, porque una tubería se pasa la mayor parte de su vida en el camino infeliz.

### ¿Con qué frecuencia debería volver a pasar la prueba?

Cada vez que una herramienta anuncie un cambio en su renderizador, su saneador o su hoja de estilos, y una vez al año de todos modos. Lleva un minuto una vez que el archivo ya existe, y que el comportamiento de un conversor cambie bajo tus pies es un evento normal y no un escándalo — solo quieres ser quien se dé cuenta.
