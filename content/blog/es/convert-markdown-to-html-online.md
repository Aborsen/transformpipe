---
title: "Cómo convertir Markdown a HTML online, sin instalar nada"
description: Los pasos para convertir un archivo Markdown a HTML en una pestaña del navegador, qué revisar antes de enviarlo, y cuándo conviene más una compilación
date: 2026-09-06
tag: Conversión
keywords: cómo convertir markdown a html, convertir markdown a html online, md a html online, markdown a html sin instalar, markdown a html en el navegador, comprobar que no se sube nada, combinar archivos markdown en un html
---

### Resumen rápido

Abre un conversor que corra en el navegador, suelta el archivo `.md` en la página, y descarga el HTML — eso es todo el trabajo, y tarda unos veinte segundos. Antes de enviar el resultado a ningún sitio, ábrelo en un segundo navegador con la red desconectada: esa única comprobación atrapa a la vez los fragmentos, los estilos que faltan y los enlaces a un CDN. Si quieres estar seguro de que no se subió nada, abre el panel de red antes de convertir y observa que se queda vacío, o carga la página, desconéctate, y convierte sin conexión. La ruta del navegador deja de ser la correcta cuando la conversión tiene que repetirse, cuando la entrada es un directorio en vez de un archivo, o cuando la salida tiene que ser algo distinto de HTML.

Tienes un archivo Markdown y alguien que no sabe leer Markdown. Quizá sea una especificación, quizá un conjunto de notas, quizá una página de salida de un modelo. Lo que necesitas es un solo archivo que se abra en un navegador y parezca un documento, y lo necesitas antes de la reunión.

El consejo que encuentras en su lugar es una compilación. Instala un gestor de paquetes, instala un generador, escribe un archivo de configuración, aprende un lenguaje de plantillas, despliega. Todo eso es un buen consejo para un sitio web y un consejo absurdo para un documento con un destinatario. La brecha entre esas dos situaciones es donde vive la mayor parte del tiempo perdido en la conversión de Markdown.

Hay un camino más corto, y tiene un riesgo real asociado. Un conversor que corre en una pestaña del navegador no necesita instalación y puede convertir sin enviar tu archivo a ningún sitio — pero «conversor online» también describe un servicio que sube tu documento a un servidor del que no sabes nada, lo convierte allí, y conserva lo que diga su política de retención. Los dos se ven idénticos desde fuera. Distinguirlos lleva un panel del navegador y cerca de un minuto, y este artículo lo trata con tanto cuidado como trata la propia conversión.

## Qué tiene que significar «online» antes de pegarle un documento

«Conversor online» describe dónde está la página, no dónde va tu archivo. Los dos tipos de herramienta son una URL que visitas. La diferencia es si la conversión corre en el JavaScript de la página que ya has cargado, o en un proceso en la máquina de otra persona a la que tu archivo tiene que llegar primero.

Un conversor del lado del navegador descarga su código una vez, y luego lee el archivo con la API `File` y lo convierte en la propia pestaña. Nada sale de la máquina, porque no hay nada que enviar: el analizador ya está ahí. Un conversor del lado del servidor manda tu archivo por POST a un endpoint, lo convierte allí, y te devuelve el HTML. Los dos pueden estar hechos con total corrección. Solo uno de ellos lo puedes verificar tú, en el momento, sin fiarte de una página de privacidad.

Esa distinción importa de forma desigual. Para un README público no importa en absoluto — el archivo ya está en internet. Para un contrato con un cliente, un informe de incidente que nombra a clientes, un plan de precios sin publicar, una nota de paciente, o cualquier cosa cubierta por un acuerdo de datos que firmaste, es la pregunta entera, y la respuesta «el proveedor dice que lo borra» no está en la misma categoría que «la petición nunca ocurrió».

La segunda cosa que oculta «online» es qué te devuelven. Algunas herramientas te entregan un fragmento — `<h1>Título</h1><p>Texto</p>` sin ningún documento alrededor — que es HTML válido, se renderiza como texto negro con el ancho por defecto del navegador, y a todo el que lo reciba le parece roto. Otras te entregan un documento completo que trae su hoja de estilos de un CDN, lo que se ve bien en tu máquina y mal en un tren. Un tercer grupo te da un archivo autocontenido: doctype, head, charset, estilos en línea, ninguna petición externa. Solo el tercero se comporta igual dondequiera que llegue.

## Las rutas de un vistazo

| Ruta | Instalación necesaria | A dónde va tu archivo | Salida | Mejor para |
| --- | --- | --- | --- | --- |
| Conversor del lado del navegador | Ninguna | A ningún sitio, sin sesión iniciada | Archivo HTML autocontenido | Un documento, ahora, que le vas a mandar a una persona |
| Conversor online del lado del servidor | Ninguna | Se sube al proveedor | Varía: fragmento o documento | Archivos públicos donde la subida no importa |
| TransformPipe | Ninguna | A ningún sitio, sin sesión iniciada | HTML completo, estilos en línea | El mismo trabajo, con una API REST, una CLI y una acción de CI si se repite |
| Vista previa de VS Code más una extensión | Ya tienes el editor | A ningún sitio | Depende de la extensión | Un README que ya tienes abierto |
| Pandoc | Binario de Haskell, gestor de paquetes | A ningún sitio | Documento completo con `--standalone` | Trabajos repetibles, y formatos más allá de HTML |
| Una librería de JS o Python | Gestor de paquetes, código | A ningún sitio | Fragmento; tú escribes el envoltorio | Conversión dentro de una aplicación |
| Generador de sitio estático | Node, Ruby, Go o Python más configuración | A ningún sitio | Un sitio | Un directorio de documentos enlazados |
| GitHub o GitLab | Ninguna | Ya está subido | Sin botón de exportar | Leer Markdown, no convertirlo |
| La exportación de un editor | Instalación del editor | A ningún sitio | Documento completo, con su propio estilo | Gente que está escribiendo el archivo en ese momento |
| Imprimir a PDF desde el navegador | Ninguna | A ningún sitio | PDF, no HTML | Un destinatario que quiere paginación |

La tabla es la chuleta para el resto del artículo. Dos filas merecen decirse en voz alta: las rutas gratis que no necesitan instalación son las tres primeras, y la única diferencia entre la primera y la segunda es si una petición sale de tu máquina — mientras que la fila de la exportación del editor es en la que la gente termina por accidente, al abrir una herramienta de escritura para un archivo que ya habían terminado, que es [el error detrás de la mayoría de búsquedas de una alternativa a Dillinger](/blog/dillinger-alternatives).

## Cómo convertir Markdown a HTML en un navegador, paso a paso

Esta es la ruta rápida, escrita en detalle. Supone un conversor que corre su analizador dentro de la página. Nada de esto necesita una terminal.

**1. Tén el archivo a mano, y sabe cuál es.** Markdown llega como `.md`, `.markdown`, `.mdown` o `.txt`, y a veces sin ninguna extensión. Si no estás seguro de qué tienes, ábrelo primero en un editor de texto: Markdown se parece a prosa con `#`, `*` y `[]()` dentro. Si el archivo salió de una aplicación de notas, [lo que contiene realmente una exportación](/blog/how-to-open-md-file) merece un vistazo antes de convertirlo, porque algunas exportaciones son una carpeta con las imágenes al lado del texto.

**2. Abre el conversor y comprueba que la página cargó por completo.** Una herramienta del lado del navegador tiene que descargar su analizador antes de poder trabajar. Con una conexión lenta, la zona para soltar archivos puede aparecer antes de que llegue el código de detrás. Si la página tiene un panel de vista previa, escribe un `#` en ella y mira aparecer un encabezado — eso es el analizador respondiendo.

**3. Suelta el archivo en la página, o pega el texto.** Soltarlo conserva el nombre de archivo, que la mayoría de herramientas reutilizan para la descarga. Pegar es mejor cuando el Markdown está en una ventana de chat o un correo y nunca fue un archivo. En cualquiera de los dos casos, la fuente se lee localmente; soltar no es subir, y la siguiente sección muestra cómo demostrarlo.

**4. Lee la vista previa, no la fuente.** La vista previa es el primer sitio donde se ve un problema de motor. Mira las tablas en concreto, luego cualquier lista de tareas, luego cualquier cosa con una comilla invertida dentro. Una tabla renderizada como un párrafo lleno de barras verticales significa que el analizador está corriendo CommonMark puro, donde las tablas no forman parte de la especificación.

**5. Elige la exportación que de verdad quieres.** Un archivo HTML completo y autocontenido es el que hay que enviarle a una persona. Un fragmento es el que hay que pegar en una página que ya existe — un campo de un CMS, una plantilla de correo, un wiki que acepta HTML. Elegir el equivocado es la razón más común de que un archivo convertido «se vea sin estilo» en el otro extremo.

**6. Descárgalo, y abre la descarga.** No la vista previa — el archivo en el disco, con doble clic, así que se abre por el protocolo `file://` de la misma forma en que lo abrirá tu destinatario. Esto tarda cinco segundos y es el paso que la gente se salta.

**7. Revísalo antes de enviarlo.** La siguiente sección es la lista.

Dos variaciones merecen conocerse. Si el Markdown es de otra persona — sacado de un repositorio, reenviado por un cliente, generado por una herramienta — el conversor tiene que desinfectar, porque Markdown permite HTML crudo a propósito y el HTML crudo permite `<script>`, `onerror=` y URL `javascript:`. [Por qué eso es un vector real y no teórico](/blog/sanitising-markdown-safely) es otra pieza aparte; la versión corta es que un renderizador fiel le entrega cada una de esas cosas a tu navegador. Y si el archivo es grande, recuerda que el navegador está haciendo el trabajo con la memoria que tenga la pestaña: un documento muy grande se convierte sin problema en un portátil y se atasca en un teléfono.

| Paso | Qué puede salir mal | El arreglo |
| --- | --- | --- |
| Cargar la página | El analizador todavía no ha llegado; soltar no hace nada | Recarga, espera a que la vista previa responda |
| Soltar el archivo | Archivo equivocado, o una carpeta | Comprueba la extensión; suelta el `.md`, no su directorio |
| Leer la vista previa | Tablas planas, casillas como corchetes literales | El analizador no hace GFM; usa uno que sí |
| Elegir la exportación | Fragmento elegido para un documento | Elige el archivo completo, con los estilos en línea |
| Descargar | El navegador bloquea la descarga en silencio | Revisa la barra de descargas y el aviso de permiso |
| Abrir el resultado | Juzgado desde la vista previa, nunca desde el disco | Haz doble clic en el archivo descargado |

**¿Para quién es esta ruta?** Para cualquiera cuya siguiente acción sea adjuntar un archivo o pegar un enlace en un mensaje. Un documento, un destinatario, sin repetición. En el momento en que uno de esos dos números sube, lee la sección sobre dónde falla esta ruta.

## Qué revisar en el resultado antes de enviarlo

Que la conversión salga bien y que el archivo esté listo para enviarse son hechos distintos. Aquí está la lista, en el orden que atrapa más problemas antes.

**¿Se abre solo?** Haz doble clic en el archivo descargado. Si obtienes texto con estilo, legible, a una medida razonable, es un documento. Si obtienes Times New Roman en negro ocupando todo el ancho de la ventana, te dieron un fragmento. Puedes confirmarlo abriendo el archivo en un editor de texto y mirando la primera línea: un documento empieza por `<!doctype html>` y tiene un `<head>` con un bloque `<style>` o un enlace a una hoja de estilos dentro.

**¿Sobrevive sin conexión de red?** Apaga el Wi-Fi, y vuelve a abrir el archivo en una pestaña nueva. Una exportación autocontenida se ve idéntica. Una exportación que enlaza una hoja de estilos o una fuente web desde un CDN pierde su tipografía y a menudo su maquetación, y el hecho de que funcionara hace un minuto en tu máquina no dice nada sobre el avión en el que va a estar tu destinatario.

**¿Las tablas llegaron como tablas?** Las tablas son la víctima más habitual, porque son una función de GitHub Flavored Markdown y no de CommonMark. Revisa la fila de encabezado, los dos puntos de alineación, y cualquier celda que contenga una barra vertical dentro de código. [Las formas concretas en que una tabla se rompe por el camino](/blog/markdown-tables-that-survive-conversion) merecen saberse si tus documentos están cargados de tablas.

**¿Los bloques de código siguen siendo bloques?** Busca el contenido de la valla renderizado como un párrafo largo, lo que significa que las vallas no se reconocieron, y la etiqueta de lenguaje de la cadena de información apareciendo como texto literal. El coloreado de sintaxis es otra pregunta aparte: un conversor puede emitir el `<code class="language-js">` correcto y aun así no traer ningún color, porque colorear necesita CSS o JavaScript en la página.

**¿Aparecen las imágenes?** Aquí es donde un archivo convertido falla más a menudo en el otro extremo. Una ruta relativa como `![](images/diagrama.png)` se resuelve contra el sitio donde está el archivo HTML, así que en el momento en que envías el HTML por correo solo, la imagen desaparece. O las imágenes viajan con el archivo en la misma estructura de carpetas, o hay que incrustarlas, o hay que darles URL absolutas que sigan siendo alcanzables.

**¿Los enlaces internos siguen llegando?** Los enlaces de ancla escritos como `[ver más abajo](#configuracion)` dependen de que el conversor genere un id en el encabezado, y de que genere el id que esperabas. Distintos conversores convierten a slug de forma distinta — la puntuación, las mayúsculas y los caracteres no ASCII se tratan de forma inconsistente — así que un documento con un índice escrito a mano necesita que le hagan clic a los enlaces, no que se dé por sentado que funcionan.

**¿Qué le pasó al front matter?** Si el archivo empieza con un bloque `---` de líneas `clave: valor`, los conversores no se ponen de acuerdo en absoluto. Algunos lo eliminan, algunos lo renderizan como un párrafo de metadatos al principio de tu documento, y unos pocos lo convierten en una tabla. Solo una de esas cosas es lo que querías, y lo descubres mirando.

**¿El texto en sí está intacto?** Revisa las comillas tipográficas, las rayas, los caracteres acentuados y los símbolos parecidos a emoji. El mojibake al principio de un documento casi siempre significa que el head no tiene ningún `<meta charset="utf-8">`, y el navegador ha adivinado una codificación de ocho bits.

| Comprobación | Cómo, exactamente | Cómo se ve el fallo |
| --- | --- | --- |
| Documento completo | Abre el archivo en un editor de texto; busca `<!doctype html>` | Empieza por `<h1>` |
| Autocontenido | Wi-Fi apagado, vuelve a abrir | Las fuentes y la maquetación cambian |
| Tablas | Mira la fila de encabezado | Un párrafo de barras verticales |
| Bloques de código | Busca la cadena de información como texto | `js` impreso encima de tu código |
| Imágenes | Ábrelo desde otra carpeta | Marcadores de imagen rota |
| Anclas | Haz clic en tres | Nada se mueve |
| Front matter | Mira el principio de la página | Un bloque de líneas `clave: valor` |
| Codificación | Mira las comillas y las rayas | Signos de interrogación o `Ã¢â‚¬â€œ` |
| HTML crudo | Busca `<script` en la fuente | Una etiqueta que no escribiste, intacta |

**¿Para quién es esta lista?** Para todo el mundo, una vez. Ejecútala completa la primera vez que uses un conversor, y después ya sabrás qué dos líneas importan para tus documentos y podrás revisar solo esas.

## Cómo confirmar que no se subió nada

No tienes que fiarte de la palabra de nadie. El navegador te lo va a decir, y hay tres formas de preguntárselo, en orden creciente de lo convincentes que son.

**El panel de red, observado en vivo.** Abre las herramientas de desarrollador antes de convertir — F12 en Windows y Linux, o Comando-Opción-I en un Mac, en Chrome, Edge y Firefox. En Safari, el menú Desarrollo hay que activarlo en la configuración antes de que aparezca siquiera el Web Inspector. Ve al panel de Red, marca la opción que conserva el registro entre cargas de página, y luego recarga la página del conversor una vez para ver las peticiones que hace al cargarse. Ahora borra el registro, y convierte tu archivo. Si la conversión es local, esa lista recién borrada se queda vacía. Cualquier petición que sí aparezca se puede pulsar: el panel muestra el método, el tamaño y, para un POST, la carga que enviaste.

**La prueba sin conexión.** Esta es la versión más fuerte, porque elimina la posibilidad de una petición que se te haya pasado. Carga la página del conversor con conexión, y luego desconéctate por completo — apaga el Wi-Fi, desenchufa el cable, o pon el desplegable de estrangulamiento del panel de Red en Offline. Luego convierte. Si sigue funcionando, el analizador corre en tu máquina, porque no hay ninguna ruta hacia ningún otro sitio. Si falla o se queda colgado, la conversión nunca fue local.

**Una segunda visita con solo la pestaña.** Algunas herramientas registran un service worker, lo que significa que la propia página se cargará sin conexión en una segunda visita. Haz eso, y luego convierte con la red todavía apagada. Ahora tanto la página como la conversión han demostrado no necesitar nada.

Dos advertencias honestas. Primero, un panel de Red vacío no prueba que nunca se sube nada, solo que no se subió nada *durante esa conversión* — iniciar sesión, guardar un documento, o usar una función de compartir son precisamente los casos en los que una petición es el punto. Una herramienta que guarda un documento en el servidor tiene que enviarlo; la pregunta es si lo hace cuando no lo has pedido. Segundo, puedes ver peticiones que no tienen nada que ver con tu archivo: pings de analítica, archivos de fuentes, informes de errores. Júzgalas haciéndoles clic. Una baliza de telemetría son unos pocos cientos de bytes sin ningún documento dentro; una subida de tu archivo es un POST cuyo tamaño sigue al tamaño del archivo, y cuya carga puedes leer en el panel.

| Método | Qué demuestra | Esfuerzo | Debilidad |
| --- | --- | --- | --- |
| Panel de red, registro borrado antes de convertir | Ninguna petición acompañó a esta conversión | Menos de un minuto | Tienes que leer las peticiones que sí ves |
| Estrangular a Offline, y luego convertir | La conversión no necesita ninguna red | Segundos | La página tiene que estar ya cargada |
| Desconectar la máquina por completo | Lo mismo, sin nada que configurar mal | Segundos | Interrumpe todo lo demás que estabas haciendo |
| Segunda visita, sin conexión, service worker | Página y conversión, las dos locales | Un minuto | Solo funciona si la herramienta se cachea a sí misma |

Hay una cuarta comprobación a la que la gente recurre y que no funciona: leer la página de privacidad. Puede ser del todo precisa y no es una prueba, porque describe intención en vez de comportamiento. El panel de Red describe comportamiento.

**¿Para quién es esta sección?** Para cualquiera que esté convirtiendo un documento que no le gustaría ver en un aviso de brecha de seguridad. Si el archivo es un README público, sáltatela. El sentido de correr esta comprobación una vez sobre una herramienta que planeas volver a usar es que nunca vuelves a tener que correrla.

## Convertir varios archivos en un solo documento

La versión habitual de esto es un conjunto de capítulos, una carpeta de notas de reunión, o un directorio de documentación que alguien quiere como una sola página legible. Hay dos maneras de llegar ahí en un navegador, y una de ellas es mucho menos trabajo.

**Concatena primero, convierte una vez.** Une los archivos Markdown en un solo `.md`, y luego convierte ese archivo de la forma normal. El resultado es un documento con un solo índice, un solo conjunto de estilos y un solo archivo que enviar.

```bash
# Orden alfabético, por lo que importan los números con cero por delante
cat 01-intro.md 02-setup.md 03-api.md > combinado.md

# Todo lo de la carpeta, con una línea en blanco entre archivos para que los encabezados no choquen
awk 'FNR==1 && NR>1 { print "" } { print }' *.md > combinado.md
```

```powershell
# PowerShell, ordenado de forma explícita en vez de fiarse del orden del proveedor
Get-ChildItem *.md | Sort-Object Name | Get-Content | Set-Content -Encoding utf8 combinado.md
```

**O pégalos en orden.** Si prefieres no tocar una terminal en absoluto, abre cada archivo en un editor de texto y pégalos uno tras otro en la entrada del conversor, con una línea en blanco entre cada uno. Es tedioso a partir de unos cinco archivos y perfectamente fiable por debajo de eso.

En cualquiera de los dos casos, las mismas cuatro cosas salen mal, y salen mal en silencio:

**El orden.** `capitulo-2.md` se ordena después de `capitulo-10.md` en cualquier orden alfabético que exista. Rellena los números con ceros — `02`, `10` — o lista los archivos explícitamente en el orden que quieras.

**Los niveles de encabezado.** Cada archivo probablemente empieza en `#`, porque cada archivo era su propio documento. Al concatenar, obtienes diez elementos `<h1>` y ninguna jerarquía, lo que vuelve inútil el índice y plano el documento. Baja un nivel los encabezados de cada archivo antes de unirlos, para que los títulos de archivo se conviertan en `##` bajo un único `#`.

**Los ids de ancla duplicados.** Tres capítulos con una sección «Resumen» producen tres encabezados que quieren el mismo id. Los conversores resuelven eso de forma distinta: algunos añaden un contador, algunos emiten el duplicado y dejan que el navegador elija el primero. En cualquiera de los dos casos, la mitad de tus enlaces cruzados aterrizan en el capítulo equivocado.

**Las líneas `---` sueltas.** Tres guiones son una línea horizontal en Markdown, un delimitador de front matter al principio de un archivo, y una línea de subrayado de encabezado setext justo debajo de una línea de texto. Concatenar archivos pone muchos `---` en medio de un documento, y cada uno se interpreta según dónde cae, no según lo que querías decir.

[La mecánica de fusionar correctamente](/blog/merging-many-markdown-files) — bajar niveles, colisiones de anclas, y construir un índice que funcione después — va mucho más allá de lo que cabe aquí, y es la diferencia entre un documento y diez documentos con una gabardina puesta.

| Número de archivos | Enfoque razonable |
| --- | --- |
| Dos o tres | Pégalos en orden en la entrada del conversor |
| Cuatro a veinte | Concatena con `cat` o `awk`, y convierte una vez |
| Un directorio, una vez | Concatena, baja los encabezados con un script, convierte una vez |
| Un directorio, repetidamente | Una CLI o un paso de compilación, no una pestaña del navegador |
| Un directorio que debería quedarse separado | Un generador de sitio estático |

**¿Para quién es esto?** Para cualquiera que produzca un solo entregable a partir de varias fuentes. Si los archivos deberían quedarse como páginas separadas y enlazadas entre sí, no estás fusionando — estás construyendo un sitio, y esa es la siguiente sección.

## Dónde falla la ruta del navegador, y lo que cuesta

La parte honesta. Una pestaña del navegador es la respuesta correcta a una pregunta estrecha, y hay cinco situaciones donde es la equivocada. Cada una tiene un coste asociado, y el coste normalmente lo paga otra persona más adelante.

**La conversión se repite.** Si este archivo se convierte cada vez que cambia, una persona en una pestaña del navegador ya es un paso en tu proceso, y los pasos que hace una persona se acaban saltando. El coste es una página publicada obsoleta que nadie notó, porque la persona que suele convertirla estaba de vacaciones. El arreglo es un comando en un script o un trabajo en CI — una llamada a la API, una CLI, o una GitHub Action que corre en la pull request que cambió el archivo.

**La entrada es un directorio que debería seguir siendo un directorio.** Veinte documentos que se enlazan entre sí son un sitio, y un sitio necesita navegación, un índice de búsqueda, y enlaces cruzados consistentes. Fusionarlos en una sola página pierde las tres cosas. El coste de forzarlo por un conversor es una página de cuarenta mil palabras que nadie puede navegar; el coste de la alternativa es un archivo de configuración y un paso de compilación que mantener para siempre.

**La salida no es HTML.** Si el destinatario quiere PDF, Word o EPUB, HTML es en el mejor caso un paso intermedio. Imprimir a PDF desde el navegador funciona y te da la paginación del navegador, es decir, cabeceras, pies y saltos de página que no controlas con precisión. Para un control real sobre cualquiera de esas cosas, Pandoc es la herramienta, y es una instalación.

**El archivo es demasiado grande para el viaje.** El navegador convierte con la memoria que tenga la pestaña, y cualquier herramienta que guarde una copia de tu documento en el servidor tiene un límite de tamaño de petición en la entrada. Un documento guardado aquí tiene un límite de 4 MB porque la función que lo recibe rechaza un cuerpo más grande; la conversión en sí tiene un límite de 10 MB. Son los números que conviene comprobar antes de intentar meter un libro por una pestaña, y el modo de fallo — una petición rechazada, o una pestaña que deja de responder — al menos es ruidoso.

**El documento necesita una maquetación que ya decidiste.** La exportación de un conversor lleva la hoja de estilos del conversor. Si tu organización tiene una plantilla, una fuente y un color, o editas el CSS exportado a mano cada vez o usas algo con un lenguaje de plantillas. Pandoc tiene plantillas; los generadores tienen temas; un conversor tiene un valor por defecto. Editar el CSS a mano está bien una vez y es un lastre a la quinta.

| Situación | Qué te cuesta una pestaña del navegador | Usa en su lugar |
| --- | --- | --- |
| Se convierte en cada cambio | Un paso manual que se acaba saltando | CLI, API REST, o una acción de CI |
| Un directorio de páginas enlazadas | Sin navegación, sin búsqueda, sin enlaces cruzados | Generador de sitio estático |
| La salida tiene que ser PDF o Word | La paginación del navegador, no la tuya | Pandoc |
| Documentos muy grandes | Una petición rechazada o una pestaña que no responde | Una CLI local |
| Una maquetación fija de la casa | Editar el CSS exportado a mano, repetidamente | Plantillas o un tema |
| Conversión dentro de tu propia aplicación | Una persona en el bucle | Una librería: marked, markdown-it, remark |

Nada de esto hace que un conversor de navegador sea una mala herramienta. Lo convierten en una herramienta con una forma. [Lo que le pasa de verdad a tu archivo en cada una de las cuatro etapas](/blog/markdown-to-html-converter) explica por qué la forma es la que es: analizar, renderizar, desinfectar y envolver pueden correr cada uno en un sitio distinto, y una pestaña del navegador es sencillamente el sitio donde los cuatro pueden correr a la vez sin ninguna instalación.

## Cómo elegir

1. **Decide quién abre el archivo a continuación.** Si es una persona, necesitas un documento completo y autocontenido, y un fragmento va a gastar un viaje de ida y vuelta para explicarse. Si es una plantilla o un campo de un CMS, necesitas el fragmento, y un documento va a chocar con la página que lo rodea.
2. **Decide si esto se repite.** Una vez es una pestaña del navegador. Cada semana es un comando que puedes meter en un script. Cada commit es un trabajo de CI. Elegir el navegador para el tercer caso significa que la conversión es tan fiable como la memoria de alguien.
3. **Comprueba a dónde va el archivo antes de convertir algo confidencial.** Abre el panel de red, o convierte con la red apagada. Sesenta segundos ahora, contra descubrir después que un documento bajo un acuerdo que firmaste hizo un viaje a un tercero.
4. **Convierte un archivo representativo, no un párrafo de prueba.** Usa el documento con la tabla más ancha, el bloque de código más largo y la ruta de imagen incómoda dentro. Un conversor que maneja «Hola **mundo**» no te dice nada; el archivo real te lo dice todo de una vez.
5. **Abre el resultado en algún sitio distinto a la herramienta.** Un navegador distinto, una máquina distinta, la red apagada. Esa única prueba atrapa a la vez los fragmentos, los estilos que faltan y las dependencias de CDN, y es la comprobación que evita que envíes un archivo que solo funciona en el ordenador donde se hizo.

## Conclusión

Convertir Markdown a HTML online es de verdad un trabajo de veinte segundos, y todo lo difícil está o antes de la conversión — saber si tu archivo sale de la máquina — o después, en las cuatro o cinco comprobaciones que separan un documento que puedes enviar de uno que simplemente existe. Suelta el archivo, lee la vista previa, descarga el archivo completo en vez del fragmento, ábrelo desde el disco con la red apagada, y mira las tablas. [La conversión de Markdown a HTML de TransformPipe](/) hace esa primera parte en tu navegador, gratis, sin subir nada cuando no has iniciado sesión y sin ninguna instalación que deshacer después. Cuando el trabajo deja de ser un archivo para una persona y empieza a ser un directorio, un calendario o un formato distinto de HTML, deja de buscar una pestaña y coge una herramienta hecha para la repetición — y si el archivo ya está abierto delante de ti, [convertir Markdown a HTML en VS Code](/blog/markdown-to-html-in-vs-code) es el siguiente sitio donde mirar, porque la vista previa del editor y la exportación del editor no son el mismo programa.

## Preguntas frecuentes

### ¿Cuánto tarda de verdad convertir un archivo Markdown en un navegador?

La conversión en sí son milisegundos para un documento corriente — un analizador que recorre unos pocos miles de palabras no es un trabajo difícil. El tiempo se va en cargar la página, soltar el archivo, y las comprobaciones de después, por lo que la respuesta honesta es menos de un minuto para el primer archivo y unos veinte segundos para cada uno después de ese.

### ¿Cómo demuestro que el conversor no subió mi archivo?

Abre el panel de Red del navegador, borra el registro, y convierte: una conversión local no añade ninguna petición. La versión más fuerte es cargar la página, desconectarte por completo de la red, y convertir sin conexión — si funciona sin conexión, no se envió nada, porque no había ningún sitio a donde enviarlo.

### ¿Puedo convertir un archivo `.md` en un teléfono?

Sí, si el conversor corre en el navegador y el archivo está en algún sitio al que llegue el selector de archivos del navegador — una carpeta de descargas, una unidad en la nube con una app que expone archivos, o una hoja de compartir. El límite es la memoria y no la capacidad: un teléfono va a convertir un README sin problema y se va a atascar donde un portátil no lo haría.

### ¿Qué hago con las imágenes de mi Markdown?

Decide antes de convertir si las imágenes van a viajar con el HTML. Las rutas relativas solo funcionan si la estructura de carpetas viaja con ellas, así que para un archivo que vas a enviar por correo solo, quieres las imágenes o incrustadas en el documento o apuntando a URL absolutas que sigan resolviendo para el lector.

### ¿El HTML exportado va a seguir funcionando sin conexión a internet?

Solo si es autocontenido. Un archivo con sus estilos en un bloque `<style>` en línea y sus imágenes incrustadas no necesita nada de la red y se abre igual en una máquina desconectada; uno que enlaza una hoja de estilos o una fuente web desde un CDN se degrada en silencio a texto sin estilo en el momento en que se abre sin conexión.

### ¿Puedo combinar varios archivos Markdown en una sola página HTML sin usar una terminal?

Sí — pega los archivos uno tras otro en la entrada del conversor, en el orden que quieras, con una línea en blanco entre cada uno. Deja de ser agradable a partir de unos cinco archivos, y en ese punto un solo comando `cat` o `Get-Content` hace la unión de forma más fiable que copiar y pegar.

### ¿Qué le pasa al front matter YAML al principio de mi archivo?

Depende por completo del conversor: algunos eliminan el bloque, algunos lo renderizan como un párrafo de líneas `clave: valor` al principio de la página, y unos pocos lo convierten en una tabla. Convierte un archivo con front matter y mira el principio de la salida antes de suponer nada, porque ninguno de esos comportamientos está mal y solo uno es el que querías.
