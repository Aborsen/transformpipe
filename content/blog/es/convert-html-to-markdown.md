---
title: "Cómo convertir HTML a Markdown: un método para cada punto de partida"
description: Cómo convertir HTML a Markdown desde un archivo, una pestaña del navegador, una cadena en código o un sitio entero, y por qué limpiar la página decide el resultado
date: 2026-09-05
tag: Conversión
keywords: cómo convertir html a markdown, html a markdown, convertir archivo html a markdown, página web a markdown, html a markdown línea de comandos, turndown, pandoc html a markdown, limpiar html antes de convertir
---

La mayoría de las instrucciones para convertir HTML a Markdown nombran una herramienta y ahí terminan. Por eso decepciona el resultado. La herramienta es la pieza intercambiable. Lo que decide si acabas con un documento legible o con cuatrocientas líneas de listas de enlaces es de dónde salió el HTML y qué le hiciste antes de que corriera el conversor. Un fragmento escrito a mano se convierte con limpieza con cualquier herramienta del mercado. Una página guardada desde un sitio de noticias se convierte igual de limpia, y el resultado es inservible.

### Resumen rápido

Elige el método según dónde está el HTML, no según qué librería es la mejor. Para **un archivo en el disco**, súbelo a un conversor de navegador o lanza un único comando de Pandoc. Para **una página que tienes delante**, usa un clipper o copia el elemento del artículo desde la consola del navegador, porque una página guardada casi nunca es el artículo. Para **una cadena en código**, usa la librería de tu lenguaje — Turndown en JavaScript, markdownify o html2text en Python — y para **un sitio entero**, primero espeja, luego extrae el contenido, y solo entonces convierte, en ese orden. Los encabezados, los enlaces, las listas, las tablas y el código sobreviven al viaje; la maquetación, las clases, los estilos en línea y las tablas anidadas no, y ninguna opción los recupera.

## Por qué la conversión es la mitad fácil

Convertir HTML a Markdown es un comando. Producir Markdown que le mostrarías a alguien son cuatro pasos, y el comando es el último de ellos. Primero averiguas qué bytes son el documento. Después llevas esos bytes a un sitio donde un conversor pueda leerlos. Luego decides qué pasa con las construcciones para las que Markdown no tiene palabras. Solo entonces conviertes. Salta los primeros tres y el cuarto igualmente tiene éxito — esa es la trampa. Un conversor no tiene manera de distinguir un aviso de cookies de un párrafo, así que traduce los dos, correctamente, y te entrega el resultado.

El segundo paso atrapa a más gente de la que debería, porque el HTML que ves en pantalla y el HTML del archivo con frecuencia no son el mismo documento. `curl` y `wget` traen lo que envió el servidor. Si la página se ensambla a sí misma en JavaScript después de eso — un sitio de documentación con un enrutador del lado del cliente, una carcasa de aplicación, cualquier cosa que se renderiza a partir de un payload JSON — lo que envió el servidor es un `<div>` vacío y una etiqueta de script. Conviertes eso y sacas un archivo en blanco, y te pasas veinte minutos sospechando del conversor. El DOM ya renderizado solo vive en el navegador, por lo que «guardar la página» y «pedir la página» producen resultados distintos, y por lo que a veces el navegador es el único lugar donde puede empezar la conversión.

El tercer paso es el que falla más tarde en vez de al momento. Una página escrita con `<img src="/img/diagrama.png">` se convierte a Markdown que contiene exactamente esa ruta, y la ruta ahora se resuelve contra el sitio donde terminó el Markdown. Cada imagen apunta a nada. Lo mismo vale para cada enlace relativo, cada ancla a un encabezado que el conversor renombró, y cada construcción que dependía de una hoja de estilos para llevar significado. La conversión se veía perfecta en la vista previa del propio conversor. Se rompió cuando el archivo se mudó, y eso es una semana después y delante de otra persona.

## Comparativa rápida: la chuleta

| Punto de partida | Ruta más corta | Qué hay que hacer primero | Qué cuesta |
| --- | --- | --- | --- |
| Un archivo `.html`, escrito a mano o un fragmento limpio | Cualquier conversor, de navegador o de línea de comandos | Nada | Nada — este caso está resuelto |
| Un archivo `.html` guardado desde un navegador | Conversor de navegador, o Pandoc | Quitar navegación, cabecera, pie, scripts | Diez minutos de limpieza, o una herramienta que los quite por ti |
| Una página abierta en un navegador, una vez | Una extensión de tipo clipper, o la consola | Dejar que un extractor encuentre el artículo | Instalar una extensión, o una línea de JavaScript |
| Una página que se renderiza en JavaScript | La consola del navegador, o un navegador sin interfaz | Esperar al DOM, y luego tomar `outerHTML` | `curl` no funciona aquí en absoluto |
| Páginas que lees y guardas cada semana | Un clipper hacia tus notas | Configurarlo una vez | Nada después de configurarlo |
| Una cadena HTML en Node | Turndown, o node-html-markdown | Quitar con `remove()` los elementos que no quieres | Una dependencia y unas pocas reglas |
| Una cadena HTML en Python | markdownify, o html2text | Quitar con `strip=[...]` los elementos que no quieres | Una dependencia y unas pocas opciones |
| HTML en una tubería de shell o en CI | Pandoc, o un conversor con API | Decidir el motor y si pasa el HTML crudo | Una instalación en el runner, o una llamada de red |
| HTML de un correo o boletín | Pandoc, y luego mucha edición | Aceptar que la maquetación de tabla se perdió | La mayor parte de la estructura; las palabras sobreviven |
| Un sitio entero que controlas | Convertir desde la fuente, no desde la salida | Encontrar las plantillas y el directorio de contenido | Trabajo de verdad, y la respuesta correcta |
| Un sitio entero que no controlas | `wget --mirror`, extractor, conversor, en ese orden | Confirmar que tienes permiso | Horas, y un selector por sitio |
| HTML guardado en una columna de base de datos | La librería de tu lenguaje, en un bucle | Probar con veinte filas antes de convertir un millón | Una mala suposición multiplicada por el número de filas |

## Cómo convertir HTML a Markdown, según el punto de partida

### Un archivo `.html` en el disco

Este es el caso que tiene todo el mundo y el que ofrece más opciones. El archivo ya está en tu máquina, no hay nada que descargar, y la única pregunta real es si el archivo es un documento o una página.

Un fragmento escrito a mano, un capítulo exportado, una sola página de documentación — conviértelo con cualquier cosa y sigue adelante. Una página guardada desde un navegador es distinta. Los navegadores ofrecen dos modos de guardado y producen problemas diferentes. «Página web, solo HTML» te da un archivo con el marcado y ningún recurso, así que las imágenes se vuelven referencias rotas. «Página web, completa» te da un archivo más una carpeta de recursos y reescribe las rutas para que apunten a esa carpeta, lo que significa que tu Markdown llevará rutas como `page_files/diagrama.png` — correctas en tu máquina, sin sentido en cualquier otro sitio.

| Ruta | Instalación | Bueno para | Cuidado con |
| --- | --- | --- | --- |
| Conversor de navegador | Ninguna | Un archivo, ahora, sin subirlo | Un documento a la vez |
| Pandoc | Sí, una vez | Scripts, y salidas más allá de Markdown | Sin desinfección; el HTML crudo pasa salvo que lo desactives |
| `html2text` (Python) | Sí, pip | Salida de texto legible, casi plano | GPLv3, y reformatea con bastante agresividad por defecto |
| Extensión de editor | Sí | Convertir con el archivo ya abierto | Varía enormemente según la extensión |
| Pegar en un editor de Markdown | Ninguna | Fragmentos pequeños | Descarta en silencio lo que el editor no entiende |

Con Pandoc, todo el trabajo es una línea:

```bash
pandoc -f html -t gfm --wrap=none page.html -o page.md
```

`-t gfm` pide GitHub Flavored Markdown, el motor que tiene tablas, listas de tareas y tachado. `--wrap=none` evita que Pandoc reajuste tus párrafos a un ancho de columna, algo que importa porque un párrafo reajustado produce un diff en cada línea la próxima vez que alguien lo edite. Dos banderas más se ganan su lugar aquí. `--extract-media=media` saca las imágenes y otros medios de la fuente a un directorio y reescribe las referencias para que coincidan, que es el arreglo para el problema de rutas de recursos de arriba. Y `-t gfm-raw_html` desactiva la extensión `raw_html`, así que las construcciones que Pandoc no puede expresar en Markdown se descartan en vez de pasar como etiquetas HTML. Pandoc también acepta una URL en lugar de un nombre de archivo y la descargará por HTTP, y `--sandbox` limita su acceso a los archivos que nombraste en la línea de comandos, algo que conviene usar con cualquier cosa que no hayas escrito tú (comprobado en pandoc.org, el 8 de septiembre de 2026).

La ruta del navegador cambia las banderas por no tener que instalar nada. [La conversión de HTML a Markdown de TransformPipe](/html-to-markdown) lee el archivo en la propia página, elimina los elementos `script`, `style`, `noscript`, `template`, `svg`, `iframe`, `head`, `nav` y `footer` junto con los comentarios HTML, convierte lo que queda, y te entrega un archivo `.md`. Sin sesión iniciada, el archivo nunca se envía a ningún sitio — la conversión ocurre en tu propia máquina, algo que puedes confirmar mirando la pestaña de red mientras corre. La conversión tiene un límite de 10 MB, mucho más HTML del que cabe en cualquier página individual.

**Úsalo cuando:** tienes el archivo, quieres el Markdown, y lo haces una o dos veces. Si lo vas a hacer cien veces, pasa directamente a la ruta de código.

### Una página abierta en un navegador

Aquí el HTML que quieres todavía no existe como archivo, y la versión que obtendrías al pedir la URL puede no coincidir con lo que estás leyendo. Hay tres rutas y conviene cada una a una frecuencia distinta.

**Recórtala.** Una extensión de navegador que recorta a Markdown corre un extractor sobre la página ya renderizada, descarta el mobiliario y convierte lo que queda. Este es el mejor resultado por unidad de esfuerzo para una página que estás leyendo, y es la única ruta que maneja de forma fiable contenido renderizado en JavaScript, porque trabaja sobre el DOM en vivo. [La comparativa de conversores de HTML a Markdown](/blog/best-html-to-markdown-converters) cubre qué hace cada extensión; el punto aquí es que lo que las hace sentir mejor que una herramienta desnuda es la extracción, no la conversión.

**Saca de la consola el elemento que quieres.** Abre las herramientas de desarrollador, encuentra el elemento que contiene el artículo, y copia su marcado:

```js
// En la consola del navegador. Elige el selector que envuelve de verdad el artículo.
copy(document.querySelector('main').outerHTML)
```

`copy()` es una función de la consola de DevTools de Chrome y Edge; pone su argumento en el portapapeles. Pega el resultado en un archivo y conviértelo. El valor entero de esta ruta es el selector: has nombrado el artículo a mano, lo que es más preciso que cualquier heurística, y tarda unos quince segundos una vez que conoces el sitio. Para un sitio que conviertes con frecuencia, apunta el selector. `article`, `main`, `[role="main"]` y `.post-content` cubren una parte sorprendente de la web.

**Guarda y convierte.** Usa el comando de guardar del navegador, y luego trata el resultado como un archivo en el disco. Esta es la ruta más lenta hacia un buen resultado, porque el archivo guardado contiene todo: la cabecera, la navegación, el aviso de suscripción, la barra de artículos relacionados, la sección de comentarios y un pie con sesenta enlaces. Sigue siendo la ruta correcta cuando necesitas la página exactamente como era, incluidas las partes que un extractor descartaría.

| Ruta | Esfuerzo por página | Maneja páginas en JavaScript | Conserva la página entera |
| --- | --- | --- | --- |
| Extensión clipper | Dos clics | Sí | No, por diseño |
| Selector de consola | Quince segundos | Sí | Solo lo que seleccionaste |
| Guardar y convertir | Un minuto, más limpieza | Depende del modo de guardado | Sí, todo |
| Vista de lectura, y guardar | Dos clics | Sí | No |

Esa última fila merece conocerse. La Vista de lectura de Firefox está construida sobre la librería Readability de Mozilla, el mismo motor de extracción que usan la mayoría de clippers. Activar la Vista de lectura y luego guardar te da una página despojada sin instalar nada.

**Úsalo cuando:** la página está delante de ti. Si te encuentras haciéndolo cada día, instala un clipper y deja de pensar en ello.

### Una cadena HTML en código

Una vez que el HTML es una variable, la conversión es una llamada de función y el trabajo interesante está en la configuración. Cada librería de esta categoría te da tres palancas: qué elementos descartar por completo, cuáles conservar como HTML crudo, y cómo renderizar el resto.

En JavaScript, Turndown es la opción por defecto y aquella con la que se mide todo lo demás. Tiene licencia MIT y su API es pequeña:

```js
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const turndown = new TurndownService({
  headingStyle: 'atx',        // "## Encabezado", no la forma subrayada
  codeBlockStyle: 'fenced',   // vallas ```, no sangrado de cuatro espacios
  bulletListMarker: '-',
  linkStyle: 'inlined',
});

turndown.use(gfm);                                  // tablas y tachado
turndown.remove(['script', 'style', 'nav', 'footer']); // fuera, sin convertir

const markdown = turndown.turndown(html);
```

Tres de esas líneas son las que importan. `use(gfm)` añade las reglas de `turndown-plugin-gfm` para tablas y tachado — sin ella, Turndown no tiene soporte de tablas y una `<table>` llega como HTML crudo o como una serie de texto según tus otros ajustes. `remove()` borra elementos y su contenido antes de convertir, que es tu paso de limpieza. Y `addRule()`, que no aparece aquí, te deja mapear un patrón concreto a un Markdown concreto: un `<div class="warning">` a una cita, un `<figcaption>` a cursiva bajo la imagen, un componente conocido a un bloque de código.

La alternativa en JavaScript es node-html-markdown, que lleva su propio analizador de HTML en vez de exigir un DOM. Eso importa si el código corre en algún sitio sin uno — una función serverless, una CLI, un worker — porque la opción que depende del DOM te obligaría a atornillar jsdom a la compilación. Tiene licencia MIT y maneja tablas y tachado por sí sola.

En Python hay dos opciones maduras con objetivos distintos. markdownify tiene licencia MIT, está construida sobre BeautifulSoup, y apunta a una estructura fiel: `md(html, heading_style="ATX", strip=['a'])` convierte, con `strip` nombrando etiquetas a eliminar y `convert` nombrando las únicas etiquetas a conservar. Tiene opciones para el carácter de las viñetas, un lenguaje de código asumido para los bloques `<pre>`, el ajuste de párrafos y la inferencia de encabezado en tablas sin fila de cabecera. html2text tiene licencia GPLv3 y apunta a texto legible: instala una herramienta de línea de comandos con el mismo nombre y acepta banderas como `--ignore-links`, `--reference-links`, `--mark-code` y `--escape-all`.

| Librería | Lenguaje | Licencia | Palanca de limpieza | Tablas |
| --- | --- | --- | --- | --- |
| Turndown | JavaScript | MIT | `remove()`, `keep()`, `addRule()` | Vía `turndown-plugin-gfm` |
| node-html-markdown | JavaScript | MIT | Traductores personalizados | Incluido |
| markdownify | Python | MIT | `strip=[]`, `convert=[]` | Incluido |
| html2text | Python | GPLv3 | Banderas tipo `--ignore-links`, `--ignore-images` | Limitado; apunta a texto legible |
| Pandoc | Cualquiera, por shell | GPL | `-t gfm-raw_html`, `--sandbox` | Incluido |

Si la conversión tiene que correr dentro de un trabajo en vez de en una máquina que administras, un conversor accesible por HTTP quita la instalación del runner. Mandar el HTML por POST a `POST /api/v1/documents?kind=html-to-markdown` convierte el cuerpo y guarda el resultado; el cuerpo de la petición tiene un límite de 4 MB, porque una función de Vercel rechaza un cuerpo más grande con un 413 desnudo que ningún código de aplicación llega a ver.

**Úsalo cuando:** la conversión ocurre más de una vez, o sin que nadie esté mirando. Escribe las reglas de limpieza una vez, en código, donde se pueden revisar.

### Un sitio entero

Este es el caso donde el consejo honesto suele ser «haz otra cosa». Si controlas el sitio, el HTML es la salida de la compilación y estás convirtiendo el artefacto equivocado. La fuente — las plantillas más donde viva el contenido — está más cerca de Markdown que las páginas ya renderizadas, y convertir el HTML renderizado de vuelta significa recuperar una estructura que tu propia compilación ya conoce. Busca primero una exportación. Un CMS con un formato de exportación, una base de datos con una tabla de contenido, un repositorio con la fuente dentro: los tres le ganan a raspar tu propio sitio.

Si de verdad solo tienes las páginas renderizadas, el orden es fijo y saltarse un paso cuesta más que hacerlo.

1. **Espeja.** Trae las páginas al disco antes de convertir nada, para que la conversión sea repetible y no estés volviendo a descargar en cada intento. `wget --mirror --page-requisites --convert-links --adjust-extension --no-parent https://ejemplo.com/docs/` recorre la sección, trae los recursos, reescribe los enlaces para que apunten a las copias locales y se queda dentro de la ruta que nombraste. Revisa antes los términos del sitio y su `robots.txt`; «podría descargarlo» y «tengo permiso para descargarlo» son preguntas distintas.
2. **Consigue la lista correcta.** Un mapa del sitio es una fuente de URL mejor que un rastreo, porque es la propia respuesta del sitio a «qué páginas existen» y no te va a llevar a un calendario con meses infinitos dentro.
3. **Extrae.** Página por página, aísla el contenido. Un selector CSS elegido a mano — lo mejor, si el sitio usa una plantilla — o un extractor. Readability de Mozilla tiene licencia Apache 2.0, toma un documento DOM y devuelve un objeto con `title`, `content`, `textContent`, `excerpt`, `byline`, `lang` y más. Necesita un DOM real, así que en Node se combina con jsdom. Su compañero `isProbablyReaderable` te da un booleano rápido sobre si un documento vale la pena entregárselo, que es como te saltas las páginas de índice de forma automática (comprobado en github.com/mozilla/readability, el 8 de septiembre de 2026).
4. **Convierte.** Ahora corre el conversor, y ahora es el paso aburrido que debería haber sido desde el principio.
5. **Arregla los enlaces.** Cada enlace interno del HTML espejado apunta a una estructura de URL que ya no existe. Decide una vez el mapeo de la URL vieja a la ruta de archivo nueva, aplícalo a cada documento, y revisa una muestra.

| Paso | Saltárselo cuesta |
| --- | --- |
| Espejar al disco | Volver a descargar todo el sitio cada vez que cambias una regla |
| Mapa del sitio en vez de rastreo | Páginas duplicadas, archivos paginados, calendarios infinitos |
| Extraer | Mil documentos que abren todos con las mismas cuarenta líneas de navegación |
| Convertir | — |
| Reescribir enlaces | Un corpus de documentos que se enlazan todos entre sí hacia nada |

**Úsalo cuando:** no tienes acceso a la fuente y necesitas el contenido igualmente — un sitio que se está retirando, la documentación de un proveedor que te dejan conservar, un archivo. Presupuesta un día, no una hora, y espera que el trabajo del selector sea por plantilla.

## Limpiar el mobiliario primero

Este es el paso que decide el resultado, y es el que ninguna tabla comparativa tiene una columna para. El hallazgo es constante en cada ruta de arriba: la diferencia entre una buena conversión y una mala casi nunca es el conversor. Es si la entrada era el documento.

Piensa en una página real. El artículo que quieres puede ser el 15% de los elementos. El resto es una cabecera, una barra de navegación primaria, una secundaria, un diálogo de consentimiento de cookies, un formulario de boletín, una fila para compartir, una barra de artículos relacionados, un hilo de comentarios, un pie con un mapa del sitio dentro y un aviso legal. Un conversor traduce todo eso con fidelidad, en el orden del documento, lo que pone el artículo en algún sitio en medio de un archivo muy largo. La salida es correcta e inútil, y el lector culpa a la herramienta.

Hay cuatro formas de recortar, en orden descendente de lo bien que funcionan.

**Nombra el elemento que quieres.** Un selector — `main`, `article`, `#content`, `.markdown-body` — es el método más preciso disponible porque tú miraste la página y decidiste. Tiene una limitación: es por sitio, a veces por plantilla, y se rompe cuando el sitio se rediseña. Para un puñado de sitios que conviertes a menudo, esto es imbatible y tarda segundos.

**Ejecuta un extractor.** Readability y sus parientes puntúan los elementos de un documento por cuánto texto de tipo prosa contienen frente a marcado y densidad de enlaces, y devuelven el ganador. Esto generaliza, que es todo el punto: funciona en un sitio que nunca has visto, sin configuración. También a veces se equivoca de adivinanza, casi siempre en páginas que no son artículos en absoluto — páginas de índice, paneles, resultados de búsqueda — donde no hay un único bloque de prosa que encontrar.

**Elimina los elementos que no quieres.** En vez de nombrar qué conservar, nombra qué descartar: `script`, `style`, `nav`, `footer`, `header`, `aside`, `form`, `iframe`, `noscript`, `svg`. Esto es lo que un conversor de propósito general puede hacer sin saber nada de tu página, y captura la mayor parte del mobiliario en una página construida con elementos semánticos. No captura nada en una página construida entera de elementos `<div>`, que es buena parte de la web.

**Arréglalo después.** Convierte todo, y luego borra el Markdown que no querías. Está bien para un documento y es indefendible para cien, y es la opción por defecto porque no exige ninguna decisión de antemano. El coste es que haces la misma edición una vez por documento, y no puedes volver a ejecutarla cuando mejoras tus reglas.

| Método | Precisión | Generaliza | Esfuerzo |
| --- | --- | --- | --- |
| Selector CSS que elegiste | La más alta | No — por sitio | Segundos, una vez que conoces el sitio |
| Extractor (Readability y similares) | Bueno en artículos, malo en todo lo demás | Sí | Una instalación y un DOM |
| Lista de eliminación de elementos | Bueno en HTML semántico, malo en la sopa de `<div>` | Sí | Ninguno; los conversores lo hacen por ti |
| Editar el Markdown después | Perfecto, en principio | No | Por documento, para siempre |

Una advertencia sobre limpiar demasiado a fondo. `<script>` y `<style>` siempre deberían irse — Markdown no puede expresar ninguno de los dos, y una etiqueta de script en la entrada es una etiqueta de script buscando dónde correr. Pero `<aside>` a veces guarda una cita destacada que pertenece al artículo, `<header>` dentro de un elemento `<article>` suele ser el título y la firma en vez de la cabecera del sitio, y `<figure>` lleva imágenes con sus leyendas. Una lista de eliminación es un instrumento poco fino. Mira un documento convertido antes de lanzarla sobre mil.

## Lo que sobrevive, y lo que no puede

Markdown es un lenguaje pequeño, a propósito. HTML no lo es. La conversión es una demolición con una lista de lo que hay que conservar, y ayuda conocer la lista antes de empezar en vez de descubrirla en la salida.

| Construcción | ¿Sobrevive? | Qué pasa en realidad |
| --- | --- | --- |
| Encabezados `h1`–`h6` | Sí | Se convierten en `#` hasta `######`, con los niveles intactos |
| Párrafos, énfasis, negrita | Sí | Fiable en todas partes |
| Enlaces | Sí, como texto | La URL se copia literal, rutas relativas incluidas |
| Imágenes | Sí, como referencia | El `src` se copia literal; `width`, alineación y `srcset` desaparecen |
| Listas ordenadas y desordenadas | Sí | El anidado sobrevive; la numeración personalizada y `start` normalmente no |
| Citas | Sí | Directo |
| Bloques de código | Normalmente | Una clase `language-*` se convierte en la etiqueta de la valla si el conversor la lee |
| Código en línea | Sí | Comillas invertidas |
| Tablas simples | Con GFM | Solo cuadrícula plana; hace falta un motor o un plugin que implemente tablas |
| Líneas horizontales | Sí | `---` |
| Tachado | Con GFM | Si no, se descarta o se conserva como HTML crudo |
| Listas de tareas | A veces | Un `<input>` de casilla dentro de un elemento de lista; muchos conversores lo ignoran |
| Listas de definición | Raramente | No están en CommonMark ni en GFM; se aproximan o se descartan |
| Notas al pie | Raramente | Una extensión en cada motor que las tiene |
| Maquetación — columnas, flotantes, anchos | No | Se convierte en una sola columna, en el orden del documento |
| Clases, ids, estilos en línea | No | Se descartan, junto con lo que fueran a señalar |
| Tablas anidadas, `rowspan`, `colspan` | No | Se aplanan, se descartan, o se dejan como HTML crudo |
| Formularios, botones, `<details>`, pestañas | No | Se descartan o se emiten como HTML crudo |
| Vídeo incrustado, canvas, SVG | No | Un enlace, en el mejor caso |
| Comentarios, scripts, hojas de estilos | No | Se eliminan, y con razón |

Cuatro de esas filas merecen una frase más.

**Las tablas son el fallo más ruidoso.** No están en la especificación CommonMark, así que un conversor tiene que implementar las tablas GFM a propósito. Cuando no lo ha hecho, una `<table>` llega como una serie de párrafos o como HTML crudo en medio de tu documento. Cuando sí lo ha hecho, una cuadrícula simple pasa perfecta y una complicada no, porque las tablas GFM no tienen celdas que se extiendan, ni contenido en bloque, ni anidado. [Qué le pasa a las tablas en el camino](/blog/markdown-tables-that-survive-conversion) es lo más útil que se puede probar sobre un documento real antes de comprometerte con una ruta.

**Los bloques de código dependen del resaltador.** Un `<pre><code>` normal se convierte con limpieza. Un bloque que un resaltador de sintaxis ha reescrito en cientos de elementos `<span>` se convierte en una valla si el conversor es sensato con `<pre>`, y en un revoltijo de caracteres sueltos si no lo es. El lenguaje normalmente está en un nombre de clase, y leerlo es un comportamiento opcional. [Los detalles de los bloques de código y sus cadenas de información](/blog/code-blocks-in-markdown) merecen comprobarse contra una muestra real.

**Los enlaces y las imágenes sobreviven como cadenas, no como referencias que funcionan.** Este es el fallo que parece un éxito. Cada ruta relativa se convierte en la misma ruta relativa, y ahora se resuelve desde otro sitio. Si el Markdown va a un repositorio, un wiki o una bóveda de notas, necesitas un paso de reescritura, y [los enlaces y las imágenes que siguen funcionando tras la conversión](/blog/images-and-links-that-still-work) no ocurren por sí solos.

**El HTML crudo es una decisión que tomas te des cuenta o no.** Algunos conversores emiten HTML para cualquier cosa que no pueden expresar. Eso conserva la información y hace el Markdown menos portable: sobrevive si el siguiente renderizador permite HTML crudo y se convierte en sopa de etiquetas visible si lo escapa en su lugar. Peor aún, el HTML crudo que atraviesa una conversión lleva consigo lo que tuviera dentro. Si la fuente venía de fuera, el Markdown ahora guarda una superficie de ataque para el próximo renderizador, y [desinfectar tiene que pasar donde se renderiza el HTML](/blog/sanitising-markdown-safely), no donde se convirtió.

## Dónde falla la respuesta obvia

La respuesta obvia es «instala Turndown» o «ejecuta Pandoc», y para la mayoría de archivos es correcta. Aquí está donde no lo es, y lo que cuesta cada fallo.

**Cuando la página no es el documento.** Ya lo hemos dicho y vale la pena repetirlo, porque explica la mayor parte de las salidas malas. Un conversor desnudo sobre una página guardada produce una traducción correcta de un sitio web. El coste no es un archivo malo — es que no te vas a dar cuenta hasta que lo abras, y a escala habrás convertido todo antes de notarlo.

**Cuando el HTML nunca existió en el servidor.** Una página renderizada del lado del cliente, pedida con `curl`, produce una carcasa. El coste de no saberlo es un desvío de diagnóstico: probarás tres conversores, obtendrás tres archivos vacíos, y concluirás que HTML a Markdown está roto. La pista es que la fuente que descargas es corta y está llena de `<script src=...>`. El arreglo es un navegador, en vivo o sin interfaz.

**Cuando la semántica estaba en el CSS.** Una página cuyos avisos, advertencias y notas de obsolescencia se marcan solo con nombres de clase pierde todos y cada uno. Los párrafos siguen ahí y el lector ya no sabe cuál importa. Una regla por clase lo arregla — `addRule()` de Turndown, las opciones por etiqueta de markdownify — al precio de una regla por clase por sitio, escrita por ti. No hay solución general, porque no hay convención general.

**Cuando el destino es más estricto que la fuente.** Convierte con una herramienta que emite GFM, y luego renderiza con un analizador CommonMark estricto, y tus tablas se convierten en párrafos de caracteres de barra vertical. El motor de la salida tiene que coincidir con el motor de lo que vaya a renderizarla, y eso es una decisión, no un valor por defecto. El coste de equivocarse es un documento que se veía bien en un sitio y mal en el siguiente.

**Cuando el documento nunca fue prosa.** Una plantilla de correo, un panel, una página de precios maquetada como una cuadrícula, un formulario. No son artículos disfrazados de HTML; la maquetación es el contenido. Convertirlos produce una lista de palabras en el orden en que aparecen en el marcado, que no es el orden en que nadie las leyó. El Markdown no es una copia con pérdidas — es una equivocada, y lo honesto es reconstruir en vez de convertir.

**Cuando estás convirtiendo la salida de tu propia compilación.** Si controlas el sitio, convertir el HTML renderizado de vuelta a Markdown es tirar información que tu compilación ya tenía, y luego pagar por adivinarla. El coste es sutil: el resultado sale 90% correcto, así que se publica, y el 10% que falta lo descubren los lectores a lo largo de los meses siguientes.

## Cómo elegir

1. **Encuentra el HTML antes de encontrar la herramienta.** Que los bytes vengan de un archivo, un guardado, una descarga o un DOM en vivo decide todo el método, y elegir una librería primero significa descubrir después que no puede ver la página que querías.
2. **Convierte un documento difícil antes de convertir cualquier otro.** No el más simple — el que tiene una tabla, un bloque de código y un aviso destacado. Lo que conserve esos tres conserva casi todo lo demás, y lo aprendes en un minuto en vez de después de doscientos archivos.
3. **Decide el paso de limpieza de forma explícita.** Selector, extractor, lista de eliminación o edición manual: elige uno ahora. Elegirlo después significa convertir todo dos veces, y la edición manual no escala más allá de unos diez documentos.
4. **Haz coincidir el motor con el destino.** Si el Markdown va a un sitio que solo hace CommonMark, las tablas y el tachado no van a aparecer, sin importar lo bien que los emitiera el conversor.
5. **Decide qué pasa con lo que Markdown no puede expresar.** Descartado, aproximado, o conservado como HTML crudo. Conservar HTML crudo en un documento con destino a un renderizador estricto es lo mismo que corromperlo.
6. **Revisa los enlaces y las imágenes, no solo el texto.** Abre tres de ellos desde la nueva ubicación del archivo convertido. Que las rutas relativas se conviertan en rutas relativas es el defecto que pasa cualquier prueba visual hasta que otra persona abre el archivo.
7. **Cuenta las conversiones frente a las instalaciones.** Un archivo no justifica un gestor de paquetes y un árbol de dependencias. Un trabajo nocturno no justifica una pestaña de navegador y una persona pulsando en ella.

## Conclusión

Convertir HTML a Markdown bien es sobre todo hacer una cosa antes de la conversión — y si lo que estás convirtiendo es una página en la web en vez de un archivo, [lee esto primero](/blog/save-a-web-page-as-markdown). La única cosa: decidir qué parte del HTML es el documento, y con qué método. Nómbrala con un selector si conoces el sitio, entrégasela a un extractor si no, y quita el mobiliario en cualquiera de los dos casos. Después de eso, cualquiera de las herramientas de aquí hará la traducción — Turndown en JavaScript, markdownify o html2text en Python, Pandoc cuando la salida tiene que ser más que Markdown, o [la conversión de HTML a Markdown de TransformPipe](/blog/best-html-to-markdown-converters) del lado del navegador cuando tienes un archivo y nada que instalar. Lo que no te va a acompañar es la maquetación, el estilo y cualquier cosa que un nombre de clase estuviera señalando en silencio. Eso no es una carencia del conversor; es la definición de Markdown, y la razón por la que el archivo es legible al otro extremo.

## Preguntas frecuentes

### ¿Cómo convierto un archivo HTML a Markdown sin instalar nada?

Usa un conversor que corra en el navegador: abre la página, suelta el archivo `.html`, descarga el `.md`. Con una herramienta del lado del navegador el archivo nunca se sube, algo que puedes verificar mirando la pestaña de red mientras convierte. Si el archivo es una página web guardada en vez de un fragmento limpio, espera tener que borrar algo de navegación después, salvo que la herramienta la quite por ti.

### ¿Cuál es el comando para convertir HTML a Markdown?

`pandoc -f html -t gfm --wrap=none page.html -o page.md` es la respuesta general. Añade `--extract-media=media` para sacar las imágenes y reescribir sus referencias, y `-t gfm-raw_html` para descartar construcciones que Pandoc no puede expresar en vez de dejarlas pasar como etiquetas HTML. Pandoc también acepta una URL donde iría el nombre de archivo.

### ¿Por qué mi Markdown convertido está lleno de navegación y avisos de cookies?

Porque convertiste la página en vez del artículo. Los conversores traducen cada elemento que les das, y una página guardada casi nunca es el artículo. O nombra el elemento de contenido con un selector CSS, o corre un extractor como Readability sobre él primero, o usa un conversor que elimina elementos estructurales antes de empezar.

### ¿Puedo convertir una página que solo se renderiza en JavaScript?

No descargándola. `curl` y `wget` reciben lo que envió el servidor, que para una página renderizada del lado del cliente es una carcasa de aplicación y una etiqueta de script. Necesitas el DOM ya renderizado: copia el elemento desde la consola del navegador, usa una extensión clipper, o maneja un navegador sin interfaz y toma el `outerHTML` una vez que la página se haya asentado.

### ¿Los conversores de HTML a Markdown conservan las tablas?

Las simples, si el conversor implementa tablas GFM — algunos necesitan un plugin, como `turndown-plugin-gfm` para Turndown. Nada conserva una tabla complicada, porque las tablas GFM son una cuadrícula plana sin celdas que se extiendan, sin contenido en bloque y sin anidado. Convierte una tabla real y mírala antes de fiarte de una ruta.

### ¿Cómo convierto un sitio web entero a Markdown?

Espéjalo primero al disco con algo como `wget --mirror --page-requisites --no-parent`, saca la lista de URL del mapa del sitio en vez de un rastreo, extrae el contenido de cada página, convierte, y luego reescribe los enlaces internos a las nuevas rutas. Revisa los términos del sitio antes de empezar. Si controlas el sitio, convierte la fuente en su lugar — el HTML renderizado ya descartó una estructura que estarías adivinando.

### ¿Qué pasa con el CSS, las clases y los estilos en línea?

Se descartan, porque Markdown no tiene estilo. Eso suele ser lo que quieres y a veces una pérdida real, ya que un nombre de clase es a menudo lo único que marca un cuadro de aviso, un destacado o una cita. Los conversores con reglas por elemento pueden mapear una clase conocida a una cita o a un prefijo en negrita, pero esa regla la escribes tú, por sitio.
