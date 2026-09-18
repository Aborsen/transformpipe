---
title: "Markdown a HTML en VS Code: vista previa, exportación y conversión al guardar"
description: La vista previa de VS Code corre con markdown-it, pero su hoja de estilos nunca es la que sale en la exportación. Lo que cada vía pone alrededor del fragmento.
date: 2026-08-25
tag: Conversión
keywords: markdown a html vscode, convertir markdown a html en vscode, vista previa markdown vscode, exportar markdown a html vscode, markdown.styles, extensión para exportar markdown, convertir markdown al guardar, markdown all in one imprimir a html
---

El archivo ya está abierto. Pulsas Ctrl+Mayús+V, aparece la vista previa, y se ve como la página que querías — títulos de un tamaño razonable, código en un bloque monoespaciado con fondo de color, tablas con bordes. Así que buscas el comando de exportar, y no hay ninguno. VS Code renderiza Markdown; no te entrega un archivo `.html`.

Ese hueco es donde vive casi todo el lío de este artículo. La vista previa es una webview con su propia hoja de estilos, hecha para leer un archivo dentro del editor. Cada vía que produce un archivo HTML de verdad —una extensión, un comando de terminal, una tarea— toma sus propias decisiones sobre qué va alrededor del fragmento renderizado, y ninguna hereda por defecto el aspecto de la vista previa.

### Resumen rápido

VS Code no tiene exportación de Markdown a HTML integrada. La vista previa corre con **markdown-it**, así que lo que ves es CommonMark más lo que VS Code añade encima, y su aspecto viene de la propia hoja de estilos de vista previa del editor — que **no** es lo que ningún exportador pone en tu archivo. Para un archivo `.html`, instala una extensión (Markdown All in One imprime a HTML; Markdown PDF escribe HTML, PDF, PNG o JPEG; Markdown Preview Enhanced ofrece una exportación HTML sin conexión que incrusta sus recursos) o ejecuta un conversor desde el terminal integrado y engánchalo a una tarea. Si el archivo va destinado a una persona y no a un repositorio, un conversor que produce un documento completo y autónomo es un camino más corto que conseguir que el editor se comporte como tú quieres.

## Lo que la vista previa integrada es en realidad

La vista previa de Markdown de VS Code es una webview que ejecuta markdown-it, el mismo analizador compatible con CommonMark que usan otras herramientas. Ese único hecho explica casi todo lo que la vista previa renderiza y lo que no.

CommonMark te da títulos, énfasis, listas, citas, bloques de código delimitados, enlaces e imágenes. La configuración por defecto de markdown-it añade tablas y texto tachado, así que eso también se renderiza. VS Code añade encima casillas de lista de tareas, por lo que `- [x] hecho` muestra una casilla marcada en la vista previa y no un par literal de corchetes. Las notas al pie no están ni en CommonMark ni en la configuración por defecto de markdown-it, así que `[^1]` sale como texto literal hasta que instalas una extensión que aporte un plugin para ello. Los diagramas Mermaid, PlantUML y las matemáticas siguen la misma historia, salvo que las matemáticas tienen su propio interruptor: `markdown.math.enabled`.

El comportamiento que puedes cambiar sin extensión es una lista corta, y merece la pena conocerla porque dos de estas opciones cambian el HTML y no solo el aspecto:

| Ajuste | Por defecto | Qué cambia |
| --- | --- | --- |
| `markdown.preview.breaks` | `false` | Si un salto de línea simple se convierte en un `<br>` |
| `markdown.preview.linkify` | `true` | Si las URLs sueltas se convierten en enlaces |
| `markdown.preview.typographer` | `false` | Comillas tipográficas, rayas y puntos suspensivos |
| `markdown.math.enabled` | `true` | Renderizado de matemáticas en la vista previa |
| `markdown.styles` | `[]` | Hojas de estilos adicionales cargadas en la vista previa |
| `markdown.preview.fontFamily` | la del editor | Tipografía del cuerpo de la vista previa |
| `markdown.preview.scrollPreviewWithEditor` | `true` | Sincronía de scroll, del editor a la vista previa |
| `markdown.preview.scrollEditorWithPreview` | `true` | Sincronía de scroll, de la vista previa al editor |

`breaks` y `linkify` son las dos que importan más allá del aspecto. Activa `breaks` y cada salto de línea suave de tu fuente se convierte en un `<br>` en la salida renderizada, lo que cambia la estructura del documento y no solo su representación — la misma fuente, dos árboles distintos. Si alguna vez te has preguntado por qué una herramienta respeta tus párrafos partidos a mano y otra los une en un bloque, ese ajuste es todo el argumento, y su valor por defecto cambia de una herramienta a otra.

Dos ajustes más entran en esta lista aunque no cambian nada en la salida, porque atrapan los defectos que una conversión vuelve permanentes. `markdown.validate.enabled` activa la comprobación de enlaces dentro del editor: un enlace relativo a un archivo que no existe, o un ancla de título que no corresponde a ningún título, sale subrayado donde todavía puedes arreglarlo. `markdown.updateLinksOnFileMove.enabled` ofrece reescribir los enlaces cuando mueves o renombras un archivo Markdown en el explorador. Ambos merecen estar activados en un repositorio de documentación, porque un enlace relativo roto en la fuente es un enlace roto en todos los formatos a los que lo conviertas, y la conversión no lo señala.

Los comandos son `Markdown: Open Preview` (Ctrl+Mayús+V, Cmd+Mayús+V en macOS) y `Markdown: Open Preview to the Side` (Ctrl+K V). Hay un tercero que conviene recordar: `Markdown: Change preview security settings`, que controla si la vista previa carga imágenes remotas y si ejecuta scripts. La vista previa es una webview con una política de seguridad de contenido, así que un archivo `.md` con una etiqueta `<script>` no la ejecuta por defecto. Eso es una propiedad de la webview. No es una propiedad de nada que exportes, y confundir las dos cosas es como la gente termina publicando una página que nunca inspeccionó.

## Comparativa rápida: la chuleta

| Vía | Qué produce | Estilos en la salida | Dónde corre | Licencia |
| --- | --- | --- | --- | --- |
| Vista previa integrada | Nada — solo una vista renderizada | Hoja de estilos de vista previa del editor, no exportable | Webview en el editor | Gratis, MIT (código de VS Code) |
| Copiar desde la vista previa | Texto enriquecido en el portapapeles | Lo que decida la aplicación de destino | Editor | Gratis |
| Markdown All in One | `.html` junto al `.md` | Opcionalmente las propias hojas de vista previa de VS Code | Comando del editor | Gratis, MIT |
| Markdown PDF | `.html`, `.pdf`, `.png`, `.jpeg` | Las suyas por defecto más `markdown-pdf.styles` | Editor, necesita un navegador Chromium | Gratis, MIT |
| Markdown Preview Enhanced | `.html` sin conexión o alojado en CDN | El tema de su propio renderizador | Comando del editor, vista previa propia | Gratis, licencia NCSA |
| Pandoc en el terminal integrado | Lo que le pidas | La de la plantilla, o ninguna | Terminal, necesita instalación | Gratis, GPL |
| Un conversor detrás de `tasks.json` | Lo que produzca ese conversor | La del conversor | Ejecutor de tareas | Depende del conversor |
| Extensión Run on Save | Dispara cualquiera de las anteriores | No es asunto suyo | En cada guardado que coincida | Gratis, Apache 2.0 |
| Un conversor en el navegador | Un `.html` autónomo | En línea, dentro del archivo | Una pestaña del navegador | Gratis |

Lee esa tabla por la tercera columna. La vía que elijas es sobre todo una decisión sobre qué CSS termina en el archivo, y es la columna que nadie revisa hasta que el archivo ya está en la bandeja de entrada de alguien. Toda licencia nombrada en este artículo, en esa columna y debajo, es gratuita y de código abierto, leída del propio manifiesto de cada proyecto (comprobado en el repositorio de cada proyecto, el 8 de septiembre de 2026).

## La hoja de estilos de la vista previa no es la hoja de estilos exportada

Esta es la parte que sorprende a la gente, así que merece decirse sin rodeos: el aspecto de la vista previa de Markdown de VS Code lo producen hojas de estilos que pertenecen a la webview del editor. No están pegadas a tu documento. No se escriben en nada que exportes. Un exportador que no las copia a propósito produce un archivo que se renderiza con los valores por defecto del navegador — Times New Roman a todo el ancho de la ventana, títulos que solo son más grandes, bloques de código que solo se distinguen por ser monoespaciados.

La estratificación dentro de la vista previa hace la separación más clara. Tres fuentes de CSS llegan a la webview, en este orden: primero los estilos de vista previa integrados de VS Code, después las hojas de estilos que las extensiones hayan aportado a través del punto de contribución `markdown.previewStyles`, y por último tus propios `markdown.styles`. El orden documentado es integrado, después contribuido, después del usuario — por lo que tu regla de `markdown.styles` gana a la de una extensión, y por lo que una extensión que quiere poder sobrescribirse contribuye en vez de inyectar.

Ninguna de esas tres capas forma parte de la conversión. Dan estilo a una vista del documento. La conversión —texto Markdown dentro, etiquetas HTML fuera— ocurre antes de las tres y no sabe nada de ellas.

Hay una segunda versión, más silenciosa, de la misma sorpresa, y esta atrapa a quienes programan más que a quienes escriben. Las extensiones pueden añadir sintaxis a la vista previa mediante el punto de contribución `markdown.markdownItPlugins`: la extensión devuelve una función `extendMarkdownIt`, VS Code le entrega la instancia de markdown-it, y el plugin queda activo. Esto solo afecta a la vista previa. No afecta a cómo se exporta el documento ni a cómo se procesa en ningún otro sitio. Así que puedes instalar un plugin de notas al pie, ver tus notas renderizadas de maravilla, ejecutar una exportación, y obtener un `[^1]` literal en la salida — porque el exportador tiene su propio analizador, su propio conjunto de plugins, y no sabe nada de lo que se le pidió a la vista previa.

La regla práctica que sigue de aquí: **la vista previa es una herramienta de lectura, y la exportación es un programa aparte.** Verifica la exportación abriendo el archivo exportado, en un navegador, no en el editor. Cualquier cosa que concluyas desde la vista previa sobre el archivo que estás a punto de enviar es una suposición.

## Las extensiones que exportan de verdad

Tres extensiones cubren casi todo esto, y se diferencian exactamente como sugiere la tercera columna de la chuleta — en lo que ponen alrededor del fragmento.

### Copiar desde la vista previa — la vía que la gente prueba primero

Antes de instalar nada, la mayoría selecciona todo en la vista previa, copia, y lo pega donde haga falta el contenido. Esto funciona, en el sentido estricto de que el portapapeles lleva texto enriquecido y el destino lo renderiza. Merece la pena saber exactamente qué ocurre, porque el resultado no es ni la vista previa ni un archivo HTML.

El portapapeles recibe una variante HTML de la selección, y la aplicación receptora aplica entonces sus propias reglas. Un cliente de correo conserva la negrita y las listas y sustituye su propia tipografía. Un procesador de texto asigna los títulos a sus propios estilos de título, que a menudo es justo lo que querías. Un gestor de contenidos elimina casi todo y conserva la estructura. En cualquier caso el estilo pertenece al destino, no a VS Code, y las imágenes referenciadas por ruta relativa por lo general no llegan.

| A favor | En contra |
| --- | --- |
| Sin instalar nada, sin configurar, sin archivo que gestionar | Obtienes texto enriquecido, no un archivo que puedas enviar o servir |
| Los títulos y las listas sobreviven en la mayoría de destinos | Las imágenes relativas normalmente no sobreviven |
| Suficiente para pegar una sección en un correo | Los bloques de código pierden el resaltado y a veces el monoespaciado |

**¿Para quién es?** Para cualquiera que mueva unos párrafos a otra aplicación. No es una conversión, y tratarla como tal es como una tabla llega al otro lado convertida en cinco líneas de barras verticales.

### Markdown All in One — el camino más corto a un archivo `.html`

Markdown All in One es una extensión de Markdown general: combinaciones de teclas, continuación de listas, un índice, y una exportación a HTML. El comando de exportación es `Markdown: Print current document to HTML`, con `Markdown: Print documents to HTML` para un lote. Escribe el archivo junto a la fuente.

| A favor | En contra |
| --- | --- |
| Un comando, sin navegador, sin más instalación que la extensión | La salida se apoya en las propias hojas de vista previa de VS Code |
| Puede reproducir el aspecto de la vista previa del editor a propósito | Las imágenes quedan enlazadas, no incrustadas, salvo que lo actives |
| Comando por lotes para una carpeta de archivos | No es un conversor al que puedas llamar desde un build |
| Exportar al guardar es un único ajuste | El HTML está pensado para una webview, no para imprimir ni para correo |

**Precio:** gratis, con licencia MIT.

Los ajustes son la parte interesante, porque son las decisiones que el exportador toma por ti:

| Ajuste | Por defecto | Efecto |
| --- | --- | --- |
| `markdown.extension.print.includeVscodeStylesheets` | `true` | Si el propio CSS de vista previa de VS Code entra en el archivo |
| `markdown.extension.print.imgToBase64` | `false` | Si las imágenes se incrustan como URIs de datos |
| `markdown.extension.print.absoluteImgPath` | `true` | Si las rutas de imagen relativas se reescriben como absolutas |
| `markdown.extension.print.theme` | `light` | Esquema de color del HTML exportado |
| `markdown.extension.print.onFileSave` | `false` | Reexportar cada vez que guardas el `.md` |
| `markdown.extension.print.validateUrls` | `true` | Comprobar los enlaces durante la exportación |

Dos de esos ajustes decidan si el archivo viaja. `absoluteImgPath`, en su valor por defecto, reescribe tus referencias de imagen relativas como rutas absolutas en tu máquina, lo cual es correcto mientras el archivo se quede donde se escribió y se rompe en el momento en que se lo envías a otra persona — su ordenador no tiene ningún `C:\Users\tu\docs\diagrama.png`. Poner `imgToBase64` en `true` incrusta las imágenes en su lugar, lo que hace el archivo más grande y funciona en cualquier parte. Cuál de las dos quieres depende de a dónde va el archivo, y el valor por defecto asume que no va a ninguna parte.

**¿Para quién es?** Para quien quiera el archivo que está mirando, en HTML, ahora, y no le importe mucho qué CSS lleva mientras no sea ninguno.

### Markdown PDF — una extensión, cuatro formatos de salida

Markdown PDF convierte el documento abierto a PDF, HTML, PNG o JPEG. Lo hace controlando un navegador basado en Chromium a través de Puppeteer, ya sea uno que le indiques, uno ya instalado, o uno que descarga y gestiona ella misma.

| A favor | En contra |
| --- | --- |
| HTML y PDF desde una sola configuración | Necesita un navegador Chromium, descargado si no encuentra uno |
| `markdown-pdf.styles` acepta tus propias hojas de estilos | La dependencia del navegador es pesada para un trabajo que solo necesita HTML |
| Convertir al guardar viene integrado | Más lento que un analizador, porque renderiza una página |
| Varios formatos en una sola pasada con `markdown-pdf.type` | El estilo de salida es el de la extensión hasta que lo reemplaces |

**Precio:** gratis, con licencia MIT.

Los ajustes que conviene conocer: `markdown-pdf.type` acepta el formato de salida o una lista de ellos; `markdown-pdf.convertOnSave` repite la conversión cada vez que se guarda el archivo; `markdown-pdf.styles` acepta una lista de rutas locales de hojas de estilos. Como es un navegador real el que hace el renderizado, la vía del PDF es lo más sólido de aquí — el tamaño de página, los márgenes y las cabeceras son cosas que un navegador sabe hacer y un analizador de Markdown no. Si el PDF es el objetivo real y no un efecto secundario, las contrapartidas son su propio tema.

**¿Para quién es?** Para quien necesite tanto PDF como HTML de la misma fuente y no le importe que se descargue un navegador para lograrlo.

### Markdown Preview Enhanced — la que tiene exportación sin conexión

Markdown Preview Enhanced sustituye la vista previa integrada por una propia, que renderiza matemáticas, Mermaid y PlantUML, y exporta a varios formatos. Su exportación HTML es la única de las tres que nombra la distinción a la que este artículo vuelve una y otra vez: eliges entre **HTML (offline)** y **HTML (cdn hosted)**.

| A favor | En contra |
| --- | --- |
| La exportación sin conexión incrusta los recursos en vez de enlazar un CDN | Es una segunda vista previa, con comportamiento y tema propios |
| Diagramas y matemáticas se renderizan sin plugins adicionales | Lo que ves ya no es lo que muestra la vista previa integrada |
| El frontmatter controla la exportación por documento | La ejecución de scripts hay que activarla para algunas funciones |
| Exportar al guardar se declara en el documento, no en los ajustes | La más grande de las tres extensiones, en alcance |

**Precio:** gratis, bajo la licencia University of Illinois/NCSA Open Source.

La exportación se configura en el propio frontmatter del documento en vez de en los ajustes, lo cual es una idea genuinamente buena — el documento lleva sus propias instrucciones. Las claves incluyen `offline`, `embed_local_images`, `embed_svg`, `print_background` y `toc`, y exportar al guardar se declara así:

```yaml
---
export_on_save:
  html: true
---
```

`embed_local_images` convierte las imágenes locales a base64, la misma decisión que toma `imgToBase64` en Markdown All in One, y por el mismo motivo. Ten en cuenta que la función de índice requiere tener activado `enableScriptExecution` en los ajustes de la extensión, porque necesita ejecutar un script dentro de la vista previa.

**¿Para quién es?** Para quien escribe documentos con diagramas y ecuaciones, y quiere que la exportación se describa en el archivo y no en los ajustes de una máquina.

### Pandoc desde el terminal integrado — ninguna extensión en absoluto

El terminal integrado es parte del editor, así que ejecutar un conversor ahí dentro sigue siendo convertir desde VS Code. Pandoc es la elección habitual y produce un documento completo cuando se lo pides:

```sh
pandoc README.md --standalone --embed-resources --output README.html
```

`--standalone` envuelve el fragmento en un documento real con doctype y cabecera. `--embed-resources` mete imágenes y hojas de estilos dentro del archivo para que se abra con la red desconectada. Sin esos dos parámetros, Pandoc te entrega un fragmento, que es el comportamiento correcto para una biblioteca y el archivo equivocado para enviar por correo. Hay más que decir sobre lo que esto cuesta por ejecución y dónde encaja en una cadena de compilación, y [la historia de la línea de comandos es su propio artículo](/blog/markdown-to-html-from-the-command-line).

**¿Para quién es?** Para quien ya tenga Pandoc, o quiera que la conversión sea un comando que también pueda ejecutar un build, un colega o un runner de CI.

## CSS propio: markdown.styles, y hasta dónde llega

`markdown.styles` es un array de URLs de hojas de estilos cargadas en la vista previa. En un workspace, pon el archivo en el repositorio y referéncialo desde `.vscode/settings.json`:

```json
{
  "markdown.styles": ["docs/preview.css"],
  "markdown.preview.breaks": false,
  "markdown.preview.typographer": true
}
```

Dos restricciones hacen tropezar a la gente. Primero, las rutas se resuelven en relación con la carpeta del workspace; las rutas absolutas del sistema de archivos no están soportadas, y las URIs `file://` no son el atajo — hay peticiones abiertas en el repositorio de VS Code que piden rutas absolutas precisamente porque no funcionan. Segundo, esto es un ajuste de workspace por una razón: una hoja de estilos que vive en el repositorio viaja con el repositorio, así que la vista previa de todos se ve igual. Ponerlo en tus ajustes de usuario da estilo a cualquier archivo Markdown que abras alguna vez, incluidos los de otras personas, que casi nunca es lo que se quería.

Y ahora la parte importante. `markdown.styles` llega a la vista previa y a nada más. No llega a `Markdown: Print current document to HTML`, no llega a `markdown-pdf.styles`, y no llega a la exportación de Markdown Preview Enhanced. Cada una tiene su propio ajuste de hoja de estilos, y si quieres un aspecto único entre la vista previa y la exportación, tienes que apuntar los dos ajustes al mismo archivo:

```json
{
  "markdown.styles": ["docs/preview.css"],
  "markdown-pdf.styles": ["docs/preview.css"]
}
```

Eso funciona, con una salvedad que conviene comprobar antes de confiar en ella: la hoja de estilos integrada de la vista previa sigue estando por debajo de la tuya dentro de la webview y falta en la exportación, así que una hoja de estilos escrita como un conjunto de anulaciones sobre los valores por defecto de VS Code produce un archivo mucho más sencillo cuando esos valores por defecto no están. Si quieres que las dos coincidan, escribe la hoja de estilos como una hoja completa —tipografía del cuerpo, espaciado, bordes de tabla, fondo del bloque de código— en vez de como un parche.

La misma lógica se aplica al resaltado de sintaxis. La vista previa resalta los bloques de código con la propia maquinaria del editor, y la exportación no la hereda. Un exportador que resalta lo hace con su propio tema y sus propios nombres de clase, y uno que no lo hace te da un `<pre><code>` sencillo con una clase de idioma y nada que lo coloree. Lo que el resaltado necesita en la página es una hoja de estilos, y a veces un script, y ninguno de los dos aparece por magia.

## Convertir al guardar con una entrada en tasks.json

Si la conversión va a pasar más de dos veces, ponla en el repositorio en vez de en tus dedos. Una tarea convierte el comando en una propiedad del proyecto:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "md a html",
      "type": "shell",
      "command": "pandoc",
      "args": [
        "${file}",
        "--standalone",
        "--embed-resources",
        "--output",
        "${fileDirname}/${fileBasenameNoExtension}.html"
      ],
      "problemMatcher": [],
      "presentation": { "reveal": "silent" },
      "group": { "kind": "build", "isDefault": true }
    }
  ]
}
```

Marcarla como tarea de build por defecto, como hace la propiedad `group` de arriba, hace que Ctrl+Mayús+B la ejecute sin un selector — un detalle pequeño que decide si la tarea se usa de verdad. `presentation.reveal` en `silent` evita que el panel de terminal se lleve el foco en cada ejecución, algo que importa cuando la ejecución pasa docenas de veces al día.

`${file}` es el archivo en el editor activo, `${fileDirname}` su carpeta, y `${fileBasenameNoExtension}` su nombre sin la extensión, así que la tarea convierte lo que sea que estés mirando y escribe el resultado justo al lado. `"problemMatcher": []` le dice a VS Code que no busque errores de compilador en la salida, cosa que de otro modo produce un aviso cada vez que la ejecutas.

Ahora la parte honesta, porque aquí es donde los tutoriales se detienen y la gente empieza a buscar. **`tasks.json` no puede ejecutar una tarea al guardar un archivo.** La propiedad `runOptions.runOn` acepta dos valores: `default`, que significa que la tarea corre cuando tú la invocas, y `folderOpen`, que significa que corre cuando se abre la carpeta que la contiene. No hay `onSave`. Existen tres soluciones alternativas, y sus costes son genuinamente distintos.

**Asocia la tarea a una tecla.** La opción más económica, y mantiene el disparador explícito. En `keybindings.json`:

```json
{
  "key": "ctrl+alt+h",
  "command": "workbench.action.tasks.runTask",
  "args": "md a html"
}
```

Una pulsación, ninguna extensión adicional, y la conversión ocurre cuando tú decides que debería. Para un archivo que exportas unas cuantas veces al día, esta es la respuesta correcta, y que sea manual es una virtud — no estás escribiendo archivos HTML cada vez que guardas una frase a medio terminar.

**Usa el propio ajuste de guardado del exportador.** Markdown All in One tiene `markdown.extension.print.onFileSave`, Markdown PDF tiene `markdown-pdf.convertOnSave`, y Markdown Preview Enhanced lee `export_on_save` del frontmatter del documento. De las tres, la versión del frontmatter es la mejor pensada: es por documento, está en el control de versiones, y un archivo que no debe exportarse simplemente no lo pide.

**Usa una extensión que vigile los archivos.** La extensión Run on Save es la opción habitual. Su configuración es una lista de expresiones regulares emparejadas con comandos, bajo `emeraldwalk.runonsave` en los ajustes:

```json
{
  "emeraldwalk.runonsave": {
    "commands": [
      {
        "match": "\\.md$",
        "cmd": "pandoc \"${file}\" --standalone --embed-resources --output \"${fileDirname}/${fileBasenameNoExt}.html\""
      }
    ]
  }
}
```

Tiene licencia Apache 2.0 y sustituye sus propios marcadores — `${file}`, `${fileDirname}`, `${fileBasenameNoExt}`, `${workspaceFolder}` y algunos más— que son lo bastante parecidos a las variables de tareas de VS Code como para confundir. `${fileBasenameNoExt}` aquí, `${fileBasenameNoExtension}` en `tasks.json`. Copiar uno en el otro produce en silencio un archivo llamado `${fileBasenameNoExtension}.html`.

La cuarta opción es saltarse por completo el disparador del editor y dejar que el repositorio sea el dueño: un script que vigila en `package.json`, o un flujo de trabajo que convierte en cada push para que el artefacto se construya con el mismo comando para todos. Publicar desde una pull request elimina la pregunta de quién tiene instalada la extensión correcta, que es el modo de fallo de cada ajuste de este artículo.

## Dónde falla la vía del editor, y qué cuesta

Convertir en el editor es rápido y local, y tiene cuatro costes que solo aparecen después.

### La configuración es por máquina, no por repositorio

Cada ajuste de extensión de este artículo vive en un archivo de configuración, y solo los de workspace viajan. `.vscode/settings.json` se puede subir al repositorio, así que `markdown.styles`, `markdown-pdf.styles` y `markdown.extension.print.imgToBase64` pueden ser propiedades del repositorio. Las extensiones mismas no pueden. Puedes listarlas en `.vscode/extensions.json` como recomendaciones, y una recomendación es un aviso que alguien puede rechazar. Un colega que ejecuta la misma exportación con otra extensión instalada produce un archivo distinto, y nada en el repositorio registra cuál era el correcto.

Esta es la diferencia entre una conversión y una costumbre. Un comando dentro de un script es revisable, comparable y repetible; una secuencia de teclas en el editor de alguien no es ninguna de esas tres cosas, y la primera señal de problema suele ser un documento que se ve mal para una persona y bien para otra. Si la salida importa a más de una persona, la conversión tiene que estar escrita en algún sitio que no sea un archivo de ajustes en un portátil.

### Un archivo a la vez, casi siempre

Markdown All in One tiene un comando de impresión por lotes; el resto está construido alrededor del editor activo. Si la tarea es una carpeta de documentos, o un documento montado a partir de muchos, el editor tiene la forma equivocada para ello — fusionar primero y convertir una sola vez es una operación distinta con un resultado distinto, y ningún comando de exportación de un editor de texto lo va a hacer.

### Nada en esta cadena limpia el contenido

Markdown permite HTML sin filtrar, así que un archivo `.md` puede contener `<script>`, `onerror=` y URLs `javascript:`. La vista previa integrada renderiza HTML sin filtrar y confía en la política de seguridad de contenido de la webview para impedir que se ejecuten scripts, lo cual te protege mientras lees. Un archivo HTML exportado no tiene webview ni tal política: cualquier HTML sin filtrar que hubiera en la fuente está ahora en un archivo que un navegador ejecutará. Para tus propias notas esto es irrelevante. Para un README que sacaste de un repositorio, o un documento que te mandó un cliente, [es toda la cuestión](/blog/sanitising-markdown-safely), y ninguna de estas extensiones anuncia la limpieza como un paso propio.

### La dependencia de Chromium es real

La descarga de navegador de Markdown PDF es un inconveniente puntual en un portátil y un problema de verdad en CI, donde un runner sin interfaz tiene que buscar y guardar en caché un navegador para producir un archivo que un analizador podría haber producido en milisegundos. Si solo necesitas HTML, un navegador es una forma pesada de conseguirlo.

### Cuando el archivo tiene un lector

Los costes de arriba son todos tolerables cuando la salida va a un repositorio, a un build o a un panel de vista previa. Dejan de ser tolerables cuando la salida va a una persona, porque entonces el archivo tiene que sobrevivir a salir de tu máquina — tiene que llevar sus estilos, resolver sus imágenes, y abrirse correctamente en un ordenador que no tiene ninguno de tus ajustes y no tiene idea de qué es una webview.

Esa es una propiedad técnica concreta: un archivo HTML completo y autónomo, con los estilos en línea, sin peticiones externas. Algunos exportadores se pueden configurar para producir uno; la mayoría producen algo entre un fragmento y un documento, y descubres cuál al mandártelo por correo a ti mismo. Un conversor construido para ese resultado empieza ahí directamente. TransformPipe convierte Markdown a un único archivo HTML autónomo en el navegador, sin que se suba nada mientras no has iniciado sesión, lo que significa que la comprobación que importa —abrirlo en otro sitio, con la red desconectada— pasa por construcción y no por configuración. [Lo que tiene que cumplir un documento que le entregas a alguien](/blog/share-a-markdown-document-as-a-link) es una lista más corta que lo que tiene que cumplir el build de un repositorio, y el editor está optimizado para lo segundo.

## Cómo elegir, en cinco preguntas

1. **¿La salida es para un lector o para un repositorio?** Un lector necesita un archivo autónomo, así que los estilos y las imágenes tienen que estar dentro; un repositorio necesita un comando reproducible, así que tiene que vivir en el control de versiones y no en los ajustes de extensión de alguien.
2. **¿El exportador lleva los estilos al archivo?** Si no lo hace, obtienes los valores por defecto del navegador, y un documento al ancho por defecto del navegador y sin bordes de tabla se lee como roto aunque el HTML sea correcto.
3. **¿Hay imágenes?** Las rutas relativas se rompen cuando el archivo se mueve y las absolutas se rompen en el instante en que sale de tu máquina, así que salvo que las imágenes estén incrustadas como URIs de datos, el archivo solo funciona donde se escribió.
4. **¿Algo tiene que ejecutar esto sin ti?** Si la respuesta es sí, la conversión pertenece a un comando que una tarea, un script o un trabajo de CI puedan invocar, porque un comando de editor es una persona pulsando una tecla, y una persona no está disponible a las 3 de la madrugada.
5. **¿Escribiste todo lo que hay en el archivo?** Si no, algo tiene que limpiar el HTML sin filtrar antes de que la salida llegue a un navegador, porque ninguna parte de la vía del editor lo hace por ti.

## Conclusión

Convertir Markdown a HTML en VS Code funciona bien exactamente para el caso para el que se construyó: un archivo que ya estás editando, una exportación que vas a mirar tú mismo, en una máquina que has configurado. Más allá de eso, las dos cosas que la gente espera del editor —reproducir el aspecto de la vista previa en el archivo exportado, y ejecutar la conversión automáticamente al guardar— son cosas que no hace, y ambas solo se arreglan elegiendo una extensión y leyendo sus ajustes con cuidado. Si lo que necesitas es un archivo HTML que se abra correctamente en el ordenador de otra persona, convertir [Markdown a HTML con un conversor en el navegador](/) implica menos decisiones que poner de acuerdo a tres extensiones, y [la comparativa más amplia de conversores](/blog/best-markdown-to-html-converters) cubre las bibliotecas y las herramientas de línea de comandos que merece la pena meter en un build en su lugar.

## Preguntas frecuentes

### ¿VS Code tiene exportación integrada de Markdown a HTML?

No. VS Code trae una vista previa de Markdown y ningún comando de exportación, así que producir un archivo `.html` necesita una extensión o un conversor ejecutado desde el terminal integrado. El propósito de la vista previa es leer el archivo en el editor, no producir un entregable.

### ¿Por qué mi HTML exportado no se parece nada a la vista previa?

Porque el aspecto de la vista previa viene de las propias hojas de estilos de la webview de VS Code, que no son parte de tu documento y no se escriben en ninguna exportación. Salvo que el exportador las copie a propósito —Markdown All in One tiene un ajuste justo para eso— el archivo exportado se renderiza con los valores por defecto del navegador.

### ¿Cómo uso mi propio CSS en la vista previa de Markdown de VS Code?

Añade la hoja de estilos a `markdown.styles` en `.vscode/settings.json`, con una ruta relativa a la carpeta del workspace. Las rutas absolutas del sistema de archivos no están soportadas, y el ajuste solo afecta a la vista previa — para la exportación también tienes que fijar la propia opción de estilos de la extensión que exporta.

### ¿VS Code puede convertir Markdown a HTML cada vez que guardo?

No a través de `tasks.json`, cuyo `runOptions.runOn` solo acepta `default` y `folderOpen`. Usa el propio ajuste de guardado del exportador, como `markdown.extension.print.onFileSave` o `markdown-pdf.convertOnSave`, o una extensión que vigile los archivos y ejecute un comando en los guardados que coincidan.

### ¿Por qué mis notas al pie se renderizan en la vista previa pero no en la exportación?

Porque los plugins de markdown-it que aportan las extensiones solo se aplican a la vista previa y no tienen ningún efecto sobre cómo se exporta el documento. El exportador tiene su propio analizador y su propio conjunto de plugins, así que una sintaxis que la vista previa entiende puede salir como texto literal en el archivo.

### ¿La vista previa renderiza GitHub Flavored Markdown?

En la práctica, casi del todo: markdown-it maneja tablas y tachado, VS Code añade casillas de lista de tareas, y las URLs sueltas se convierten en enlaces porque `markdown.preview.linkify` está activado por defecto. No es una garantía de la salida exacta de GitHub, y [conocer las diferencias entre dialectos](/blog/commonmark-gfm-and-the-flavours) conviene hacerlo antes de asumir que un archivo se renderiza igual en los dos sitios.

### ¿Qué vía me da un único archivo sin peticiones externas?

Tanto la exportación `HTML (offline)` de Markdown Preview Enhanced como `--standalone --embed-resources` de Pandoc apuntan a esto, igual que cualquier conversor cuya salida declarada sea un documento autónomo. Pruébalo de la única manera que demuestra algo: abre el archivo en otra máquina con la red desconectada.
