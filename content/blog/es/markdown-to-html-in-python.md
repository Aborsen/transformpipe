---
title: "Renderizar Markdown a HTML en Python"
description: "Python-Markdown, markdown2, mistune y markdown-it-py comparados: las extensiones que dejan fuera, sanear con nh3, y un script de directorio que rompe una build."
updated: 2026-09-09
date: 2026-07-07
tag: Código
keywords: markdown a html python, python markdown, markdown2, mistune python, parser de markdown, convertir markdown programaticamente, extensiones python markdown, markdown-it-py, pymdown-extensions, nh3 sanear html, pypandoc
---

`markdown.markdown(text)` es la primera línea que casi todo el mundo escribe, y funciona. Luego una tabla entra en el README, el HTML vuelve con barras verticales metidas en un párrafo, y empieza la búsqueda. Python tiene cuatro bibliotecas de Markdown que merece la pena conocer. Las diferencias entre ellas son sobre todo qué viene activado por defecto y hasta dónde puedes cambiar el resultado.

### Resumen rápido

Cuatro bibliotecas, y la elección es más estrecha de lo que parece. **Python-Markdown** es aquella sobre la que se construye la mayoría del tooling de Python, y viene casi sin nada activado — tablas, código con valla, notas al pie e ids de encabezado son todas extensiones que hay que nombrar. **markdown2** es un único módulo con las mismas funciones y otro vocabulario: se llaman extras y se escriben distinto. **mistune** es la que conviene cuando el HTML tiene que salir con una forma concreta, porque subclasificas un renderer en vez de correr una expresión regular sobre la cadena final. **markdown-it-py** es la que conviene cuando el mismo documento tiene que renderizarse igual en un navegador, porque es un port del markdown-it de JavaScript y sigue de cerca la especificación CommonMark. Ninguna de las cuatro sanea, así que elijas la que elijas, nh3 va después.

El problema tiene siempre la misma forma. Un script que funcionaba con un README deja de funcionar la semana en que alguien añade una tabla, o una nota al pie, o un bloque con valla que lleva un lenguaje. Nada da error. El analizador lee las barras verticales como texto normal, las envuelve en un párrafo, y devuelve HTML perfectamente válido y visiblemente equivocado. La degradación silenciosa es el comportamiento por defecto de todo analizador de Markdown, porque no existe tal cosa como Markdown inválido — todo lo que el analizador no reconoce es prosa.

Lo segundo que muerde es que el trabajo de la biblioteca termina antes de lo que crees. Las cuatro devuelven un fragmento: `<h1>Title</h1><p>Text</p>` sin doctype, sin `<head>`, sin estilos. Escrito en un archivo `.html` y abierto, eso es Times New Roman negro a todo el ancho de la ventana. La biblioteca hizo su trabajo. El resto — la envoltura, la hoja de estilos, el sanitizador — es cosa tuya, y este texto lo cubre todo.

## Las cuatro bibliotecas de un vistazo

| Library | Install | Flavour and spec | How it extends | Licence | Best at |
| --- | --- | --- | --- | --- | --- |
| Python-Markdown | `pip install markdown` | Sintaxis Markdown original por defecto; no conforme con CommonMark en cada detalle | Extensiones nombradas con una API de puntos de entrada, más grandes paquetes de terceros | Gratis, BSD de 3 cláusulas | Compilaciones de documentación, y cualquier cosa que ya use MkDocs |
| markdown2 | `pip install markdown2` | Su propio dialecto; no CommonMark | Una lista de «extras» en cadena pasada a una llamada | Gratis, MIT | Una llamada, una lista, sin archivo de configuración |
| mistune | `pip install mistune` | «Compatible con reglas sensatas de CommonMark», en sus propias palabras | Plugins por nombre, más clases de renderer que subclasificas | Gratis, BSD de 3 cláusulas | Cambiar el HTML emitido sin posprocesarlo |
| markdown-it-py | `pip install markdown-it-py` | Sigue la especificación CommonMark para el análisis base | Preajustes, reglas nombradas individualmente, y mdit-py-plugins | Gratis, MIT | Igualar exactamente un frontend de JavaScript |

Licencias y declaraciones de especificación comprobadas en pypi.org, python-markdown.github.io, mistune.lepture.com y markdown-it-py.readthedocs.io, 9 de septiembre de 2026. No hay cifras de velocidad en esa tabla a propósito: todo benchmark de Markdown publicado mide un corpus distinto con un conjunto de extensiones distinto, y el único número que significa algo es el que consigas con tus propios documentos.

## Las cuatro bibliotecas en detalle

### Python-Markdown, y las extensiones que deja fuera

Python-Markdown — `pip install markdown`, importada como `markdown` — es la más antigua de las cuatro. Por sí sola implementa la sintaxis Markdown original y nada más. Sin tablas. Sin bloques de código con valla. Sin notas al pie. Son extensiones, y permanecen apagadas hasta que las nombras.

```python
import markdown

html = markdown.markdown(
    text,
    extensions=["tables", "fenced_code", "toc", "sane_lists"],
    extension_configs={"toc": {"anchorlink": True}},
)
```

Las banderas que la gente pasa por alto son casi siempre estas:

| What you expected | Extension | Note |
| --- | --- | --- |
| Tablas al estilo GitHub | `tables` | |
| Vallas de código de triple comilla invertida | `fenced_code` | |
| Ids y anclas en los encabezados | `toc` | también rellena `md.toc` |
| Código resaltado | `codehilite` | necesita Pygments instalado |
| Notas al pie | `footnotes` | |
| Atributos `{: .note}` en elementos | `attr_list` | |
| Un solo salto de línea convertido en salto de línea | `nl2br` | |

`extra` activa un paquete completo — `abbr`, `attr_list`, `def_list`, `fenced_code`, `footnotes`, `md_in_html`, `tables` — y te acerca a lo que probablemente asumiste que ya tenías (comprobado en python-markdown.github.io, 9 de septiembre de 2026). Nota lo que sigue faltando en él: `nl2br`, `codehilite`, `toc`, `smarty`, `sane_lists` y `meta`. `extra` es una comodidad, no un superconjunto, y las dos cosas que la gente más asume que incluye — ids de encabezado y resaltado de sintaxis — son exactamente las dos que deja fuera.

La lista oficial completa es lo bastante corta como para leerla una vez y dejar de adivinar:

| Extension | What it does | Worth knowing |
| --- | --- | --- |
| `tables` | Tablas de barras al estilo GFM | En `extra` |
| `fenced_code` | Vallas de triple comilla invertida y de virgulilla | En `extra`; la cadena de información se convierte en una clase de lenguaje |
| `footnotes` | Referencias `[^1]` y una lista de notas al pie | En `extra`; mantiene estado entre documentos |
| `attr_list` | `{: .note #id }` tras un elemento fija clase, id y atributos | En `extra`; la sintaxis es invisible para cualquier otro analizador |
| `def_list` | Listas de definición | En `extra` |
| `abbr` | `*[HTML]: HyperText Markup Language` se convierte en `<abbr>` | En `extra` |
| `md_in_html` | Analiza Markdown dentro de un bloque HTML crudo marcado `markdown="1"` | En `extra`; la razón por la que un envoltorio `<div>` deja de tragarse tu texto |
| `codehilite` | Resaltado de sintaxis vía Pygments | No en `extra`; necesita Pygments instalado y una hoja de estilos |
| `toc` | Ids en los encabezados, un marcador `[TOC]`, y `md.toc` | No en `extra`; mantiene estado |
| `smarty` | Comillas curvas, rayas en y em, puntos suspensivos | No en `extra`; cambia caracteres, así que revisa el diff de tu resultado |
| `meta` | Lee un bloque de cabecera `clave: valor` en `md.Meta` | No en `extra`; no es un analizador de YAML |
| `nl2br` | Un solo salto de línea se convierte en `<br>` | No en `extra`; es el comportamiento de un comentario de GitHub |
| `sane_lists` | Análisis de listas más estricto: una lista necesita una línea en blanco antes | No en `extra` |
| `admonition` | Bloques `!!! note` | No en `extra`; la sintaxis de aviso de MkDocs |
| `wikilinks` | `[[Page]]` se convierte en un enlace | No en `extra` |
| `legacy_attrs`, `legacy_em` | Compatibilidad con el comportamiento previo a la versión 3.0 | Solo para documentos antiguos |

Cuatro de esas merecen más que una fila de tabla.

**`codehilite`** no resalta nada por sí sola. Le entrega el código a Pygments, que emite elementos `<span>` con nombres de clase, y esos nombres de clase no significan nada hasta que una hoja de estilos los define. La propia documentación de la extensión da el comando que produce una — `pygmentize -S default -f html -a .codehilite > styles.css` — y sus opciones incluyen `linenums`, `guess_lang`, `css_class`, `pygments_style`, `noclasses` y `use_pygments` (comprobado en python-markdown.github.io, 9 de septiembre de 2026). `noclasses=True` escribe los colores como atributos `style` en línea, lo cual es más grande y más feo y exactamente lo que quieres si el HTML tiene que sobrevivir a que lo pegues en un correo. `use_pygments=False` se salta Pygments del todo y deja una clase de lenguaje en el elemento `<code>` para que un resaltador del lado del cliente la recoja después — lo cual es la elección correcta si la página ya carga uno. [Lo que necesita realmente el resaltado de sintaxis en la página](/blog/code-blocks-in-markdown) es una historia más larga que «añade una valla».

**`toc`** hace dos trabajos y la gente suele querer el segundo. Sustituye un marcador `[TOC]` en el origen por una lista anidada, y pone un `id` en cada encabezado. Sus opciones incluyen `anchorlink`, `permalink`, `baselevel`, `separator`, `slugify` y `toc_depth`, y tras una conversión la instancia lleva tanto `md.toc`, la tabla de contenidos como cadena HTML, como `md.toc_tokens`, lo mismo como diccionarios anidados (comprobado en python-markdown.github.io, 9 de septiembre de 2026). `md.toc` está disponible se haya usado o no el marcador en el documento, lo cual es lo que permite que una plantilla ponga el contenido en una barra lateral en vez de arriba del texto. `baselevel` importa cuando la plantilla ya renderiza un `<h1>`: fíjalo en 2 y los encabezados `#` del documento salen como `<h2>` en vez de pelear con la página.

**`meta`** parece soporte de front matter y no lo es. Lee un bloque de líneas `clave: valor` al principio del archivo en `md.Meta`, tolera delimitadores `---`, y su propia documentación es explícita en que el contenido no se analiza como YAML. Cada valor llega como una lista de cadenas, una entrada por línea, así que `md.Meta["title"][0]` es el título y `md.Meta["title"]` es una lista de uno (comprobado en python-markdown.github.io, 9 de septiembre de 2026). Si tus archivos llevan YAML de verdad — claves anidadas, listas, booleanos, fechas — lee la cabecera con `python-frontmatter` o `yaml.safe_load` antes de que el texto llegue al analizador.

**`attr_list`** es la que te cuesta portabilidad. `{: .warning }` tras un párrafo es una convención de Python-Markdown; en GitHub, en la vista previa de un navegador, o en cualquiera de las otras tres bibliotecas de aquí, son cinco caracteres literales al final de tu frase.

Para más de un documento, construye el conversor una vez con `markdown.Markdown(extensions=[...])` y llama a `.reset()` entre archivos. Las notas al pie y la tabla de contenidos mantienen estado, así que sin el reinicio la segunda página hereda las notas al pie de la primera. La documentación dice lo mismo con más palabras: puede que el analizador necesite que se reinicie su estado entre cada llamada a `convert` (comprobado en python-markdown.github.io, 9 de septiembre de 2026). El corolario importa para la sección de concurrencia más abajo — un objeto `Markdown` mantiene estado, así que pertenece a un solo worker, no a un pool.

Dos ajustes más pequeños, ambos documentados en la referencia de la biblioteca (comprobado en python-markdown.github.io, 9 de septiembre de 2026). `output_format` acepta `"xhtml"` o `"html"`, y decide si un salto de línea sale como `<br />` o `<br>`; el valor por defecto es `"xhtml"`, lo cual sorprende a quien escribe HTML5. Y `tab_length` es por defecto 4 — si tus documentos sangran las listas anidadas con dos espacios, esta es la razón por la que el anidamiento se colapsa.

**pymdown-extensions** es lo que la mayoría instala en realidad por encima. Es un paquete con licencia MIT bajo el espacio de nombres `pymdownx`, y lleva Arithmatex, B64, BetterEm, Blocks, Caret, Critic, Details, Emoji, EscapeAll, Extra, FancyLists, Highlight, InlineHilite, Keys, MagicLink, Mark, PathConverter, ProgressBar, Quotes, SaneHeaders, SmartSymbols, Snippets, StripHTML, SuperFences, Tabbed, Tasklist y Tilde (comprobado en facelessuser.github.io, 9 de septiembre de 2026). Tres de esas hacen la mayor parte del trabajo: `pymdownx.superfences` sustituye a `fenced_code` y deja anidar vallas dentro de elementos de lista y avisos, `pymdownx.highlight` centraliza la configuración de Pygments que de otro modo llevaría `codehilite`, y `pymdownx.tasklist` da la sintaxis de casilla de GitHub que Python-Markdown no tiene como extensión oficial. Si alguna vez te preguntaste por qué un sitio de MkDocs Material puede hacer contenido con pestañas y tu script no, este paquete es la respuesta.

**¿Para quién es?** Scripts de compilación en Python, y cualquiera cuya documentación ya corra por MkDocs, donde Python-Markdown es el motor y la lista de extensiones es un archivo de configuración que ya estás editando de todos modos.

### markdown2 y sus extras

markdown2 es un único módulo con la misma forma y un vocabulario distinto: las funciones son *extras*, y también están apagadas por defecto.

```python
import markdown2

html = markdown2.markdown(
    text,
    extras=["tables", "fenced-code-blocks", "strike", "header-ids", "footnotes"],
)
```

Hay más extras de los que nadie recuerda, así que ayuda verlos agrupados por para qué sirven (nombres comprobados en github.com, 9 de septiembre de 2026):

| What you want | Extras |
| --- | --- |
| Las funciones GFM que asumiste que tenías | `tables`, `fenced-code-blocks`, `strike`, `task_list`, `header-ids`, `footnotes` |
| Metadatos y estructura | `metadata`, `toc`, `numbering`, `cuddled-lists`, `breaks` |
| Código y matemáticas | `code-friendly`, `highlightjs-lang`, `pyshell`, `latex`, `wavedrom`, `mermaid` |
| Tipografía | `smarty-pants`, `middle-word-em`, `tag-friendly` |
| Enlaces y forma del resultado | `link-patterns`, `nofollow`, `target-blank-links`, `html-classes`, `xml` |
| Interoperabilidad con HTML | `markdown-in-html`, `wiki-tables`, `spoiler`, `tg-spoiler`, `admonitions` |

Tres de esas merecen destacarse aparte. `code-friendly` desactiva `_` y `__` como marcadores de énfasis, que es la solución para un documento lleno de `some_variable_name` que empieza a salir en cursiva a mitad de camino. `link-patterns` toma una lista de pares de expresión regular y sustitución y convierte automáticamente en enlace cualquier cosa que coincida — `#1234` en una URL de issue, `CVE-2026-…` en un aviso — que es una función que ninguna de las otras tres bibliotecas ofrece en una sola línea. Y `header-ids` es el nombre que markdown2 le da a lo que Python-Markdown llama `toc`; si cambias de biblioteca y tus anclas se rompen, esta es la razón.

El compromiso es menos piezas móviles a cambio de un ecosistema más pequeño: si necesitas algo que ninguna de las dos bibliotecas ofrece, Python-Markdown tiene una API de extensiones documentada y extensiones de terceros de las que tirar.

Cuidado con la ortografía. Las dos bibliotecas nombran la misma función de forma distinta — `fenced_code` frente a `fenced-code-blocks` — así que mantén la lista en una sola constante en vez de reescribirla en cada punto de llamada. Confundir las dos es la razón habitual por la que una página renderiza una tabla y otra imprime barras.

**¿Para quién es?** Un script que necesita un import, una llamada y una lista de cadenas, sin registro de extensiones, sin objeto de configuración y sin un segundo paquete. markdown2 tiene licencia MIT (comprobado en pypi.org, 9 de septiembre de 2026).

### mistune, cuando quieres cambiar el resultado

mistune es un analizador de Markdown puro en Python construido alrededor de plugins y renderers. `mistune.html(text)` es la llamada de comodidad; `create_markdown` es donde viven las decisiones.

```python
import mistune

render = mistune.create_markdown(
    escape=True,
    plugins=["table", "strikethrough", "task_lists", "url"],
)
html = render(text)
```

`escape=True` escapa el HTML crudo del origen en vez de dejarlo pasar, que es lo que quieres cuando el Markdown viene de otra persona. Pasa `escape=False` cuando el origen es tuyo y contiene HTML deliberado.

Los plugins que trae de serie son `strikethrough`, `footnotes`, `table`, `url`, `task_lists`, `def_list`, `abbr`, `mark`, `insert`, `superscript`, `subscript`, `math`, `ruby` y `spoiler` (comprobado en mistune.lepture.com, 9 de septiembre de 2026). Pásalos como cadenas, o importa las funciones y pasa esas — la forma de cadena es una búsqueda dentro de `mistune.plugins`.

La razón real para recurrir a mistune es el renderer. Subclasifica `HTMLRenderer`, sobrescribe el método de un tipo de nodo, y las imágenes o los enlaces salen con la forma que quieres — llevando `loading="lazy"`, por ejemplo — sin ninguna expresión regular corriendo sobre la cadena final.

```python
from html import escape

import mistune
from mistune import HTMLRenderer


class DocRenderer(HTMLRenderer):
    def image(self, alt, url, title=None):
        attrs = f' title="{escape(title, quote=True)}"' if title else ""
        return (
            f'<img src="{escape(url, quote=True)}" alt="{escape(alt, quote=True)}"'
            f'{attrs} loading="lazy" decoding="async">'
        )

    def heading(self, text, level, **attrs):
        slug = attrs.get("id") or text.lower().replace(" ", "-")
        return f'<h{level} id="doc-{slug}">{text}</h{level}>'


render = mistune.create_markdown(renderer=DocRenderer(), plugins=["table", "footnotes"])
```

Los nombres de método son los tipos de nodo, y las firmas están documentadas: `link(self, text, url, title=None)`, `image(self, alt, url, title=None)`, `heading(self, text, level, **attrs)`, `block_code(self, code, info=None)`, `paragraph(self, text)`, `list(self, text, ordered, **attrs)`, `codespan(self, text)`, `inline_html(self, html)` y el resto (comprobado en mistune.lepture.com, 9 de septiembre de 2026). Los plugins añaden los suyos: `strikethrough(self, text)`, `table_cell(self, text, align=None, head=False)`.

Esa distinción — sobrescribir el renderer en vez de parchear la cadena de texto — es todo el argumento a favor de mistune, y merece la pena ser concreto sobre por qué importa. Posprocesar HTML con una expresión regular funciona hasta que aparece un `<img>` dentro de un bloque de código, o el valor de un atributo contiene el carácter que estabas buscando, o alguien escribe `<img>` en una frase sobre HTML. El renderer corre sobre nodos ya analizados, así que una valla de código que contiene el texto `<img src=x>` nunca llega a `image()`; llega a `block_code()`, como texto. No hay ningún caso en el que los dos enfoques discrepen a tu favor.

`block_code(self, code, info=None)` es el gancho para el resaltado de sintaxis: `info` es la cadena tras las comillas invertidas de apertura, así que obtienes el nombre del lenguaje y puedes entregarle el cuerpo a Pygments tú mismo, con tus propios nombres de clase, sin ninguna extensión de por medio. mistune también trae `RSTRenderer` y `MarkdownRenderer` junto a `HTMLRenderer`, que es cómo se usa para normalizar Markdown en vez de para dejar de ser Markdown.

**¿Para quién es?** Para cualquiera cuyo resultado tenga que satisfacer una restricción que la biblioteca no conoce — una política de seguridad de contenido que prohíbe estilos en línea, una cadena de imágenes que reescribe `src`, un sistema de diseño cuyas tablas necesitan un `<div>` envolvente para hacer scroll horizontal. mistune tiene licencia BSD de 3 cláusulas (comprobado en pypi.org, 9 de septiembre de 2026).

### markdown-it-py, y por qué importa la conformidad con CommonMark

Cuando el requisito es «coincide con la especificación», markdown-it-py es la respuesta directa. Es un port a Python del markdown-it de JavaScript y sigue de cerca CommonMark. Los preajustes elijen un punto de partida y las reglas se activan por nombre.

```python
from markdown_it import MarkdownIt

md = MarkdownIt("commonmark")
md.enable(["table", "strikethrough"])
html = md.render(text)
```

Los preajustes son la forma más rápida de decir lo que quieres (comprobado en markdown-it-py.readthedocs.io, 9 de septiembre de 2026):

| Preset | What you get |
| --- | --- |
| `zero` | Párrafos y texto, nada más — un punto de partida que construyes regla por regla |
| `commonmark` | CommonMark estricto: código con valla, sin tablas, sin tachado, sin enlaces automáticos |
| `js-default` | HTML crudo desactivado, tablas y tachado activados |
| `gfm-like` | Tablas, tachado y linkify — necesita el paquete `linkify-it-py` |
| `gfm-like2` | `gfm-like` más listas de tareas, alertas al estilo GitHub y tachado de una sola virgulilla; también necesita `linkify-it-py` |

Las reglas se activan y desactivan por nombre en los niveles de núcleo, bloque y en línea, de forma permanente con `enable()` y `disable()` o temporal con un gestor de contexto. Esa granularidad es inusual y a veces es justo el punto: si tu plataforma no puede renderizar imágenes, `md.disable("image")` es una garantía a nivel de analizador, no un filtro aplicado después.

`mdit-py-plugins` es el paquete complementario — `pip install mdit-py-plugins`, junto con `pip install markdown-it-py[linkify]` si quieres los preajustes de linkify — y lleva las extensiones de sintaxis que no están en la especificación: front matter, notas al pie, listas de definición, contenedores, anclas, listas de tareas. Se aplican con `md.use(plugin)`:

```python
from markdown_it import MarkdownIt
from mdit_py_plugins.front_matter import front_matter_plugin
from mdit_py_plugins.footnote import footnote_plugin

md = MarkdownIt("gfm-like").use(front_matter_plugin).use(footnote_plugin)
html = md.render(text)
```

Ahora la razón por la que importa la conformidad, dicha con claridad. Un documento Markdown renderizado dos veces — una por tu backend de Python para la copia enviada por correo, otra por JavaScript en el navegador para la vista previa en vivo — tiene que salir igual, y «igual» no es algo que dos analizadores escritos de forma independiente sean nunca por accidente. Enlaces de estilo referencia, continuación perezosa de citas, cuántas comillas invertidas cierran una valla, si una lista es loose o tight, qué hace un guion bajo dentro de una palabra: son exactamente los casos donde las implementaciones divergen, y cada uno de ellos está fijado por la especificación CommonMark y su suite de pruebas. Dos analizadores que pasan esa suite coinciden. Dos analizadores que no la pasan ambos coinciden hasta que alguien escribe algo levemente inusual, y entonces la vista previa y el archivo exportado discrepan — que es el error que tarda un día en encontrarse, porque el documento se ve bien en la herramienta donde lo estás mirando.

markdown-it-py es un port del markdown-it de JavaScript, así que las dos comparten no solo una especificación sino un linaje de implementación y un vocabulario de plugins. Eso es lo más cerca que hay de una garantía de coincidencia. Qué dialecto estás apuntando importa más que qué biblioteca elijas; [CommonMark, GFM y los dialectos](/blog/commonmark-gfm-and-the-flavours) expone las diferencias, y las mismas bibliotecas tienen su contraparte en [renderizar Markdown en JavaScript](/blog/markdown-to-html-in-javascript).

**¿Para quién es?** Para cualquier cosa con un navegador al otro lado, cualquier sitio donde una diferencia de renderizado sea un ticket de soporte, y para quien prefiera leer una especificación antes que un registro de cambios. Tiene licencia MIT (comprobado en pypi.org, 9 de septiembre de 2026).

## Sanear el HTML, y el único orden que funciona

Ninguna de estas cuatro es un sanitizador. Markdown permite HTML crudo por diseño, así que una etiqueta `<script>` en el origen es una etiqueta `<script>` en el resultado salvo que algo la escape o la elimine. Python-Markdown lo dice con sus propias palabras: la biblioteca no sanea su salida HTML, y si el origen viene de una fuente no confiable, sanearlo es tu responsabilidad (comprobado en python-markdown.github.io, 9 de septiembre de 2026).

bleach fue la respuesta estándar durante años, y vale la pena comprobar su estado en vez de repetir lo último que oíste. Su propia página en PyPI dice ahora que bleach ya no tiene mantenimiento y que no habrá más versiones, ni siquiera por seguridad; la última versión fue 6.4.0 el 5 de junio de 2026, bajo Apache 2.0 (comprobado en pypi.org, 9 de septiembre de 2026). Un sanitizador sin mantenimiento es peor posición que ningún sanitizador, porque parece protección en una revisión de código.

La respuesta actual es nh3, un binding de Python con licencia MIT a ammonia, el sanitizador de HTML escrito en Rust (comprobado en pypi.org, 9 de septiembre de 2026). Es una sola función sobre un analizador muy probado, y falla cerrado: cualquier cosa que no esté en la lista blanca se elimina.

```python
import nh3

safe = nh3.clean(
    html,
    tags={"p", "a", "code", "pre", "h1", "h2", "h3", "h4", "ul", "ol", "li", "table",
          "thead", "tbody", "tr", "th", "td", "em", "strong", "blockquote", "hr",
          "img", "sup", "sub", "del"},
    attributes={
        "a": {"href", "title"},
        "img": {"src", "alt", "title", "loading"},
        "code": {"class"},
        "h1": {"id"}, "h2": {"id"}, "h3": {"id"}, "h4": {"id"},
    },
    url_schemes={"http", "https", "mailto"},
    id_prefix="doc-",
    link_rel="noopener noreferrer nofollow",
)
```

Cada argumento ahí hace algo concreto, y los nombres de las palabras clave son los propios de la biblioteca (comprobado en nh3.readthedocs.io, 9 de septiembre de 2026):

| Argument | What it decides |
| --- | --- |
| `tags` | La lista blanca de elementos. Omítela y obtienes el conjunto por defecto de ammonia |
| `attributes` | Qué atributos sobreviven, por etiqueta. `"*"` como clave se aplica a toda etiqueta. El conjunto por defecto no incluye `id` |
| `url_schemes` | Con qué puede empezar `href` y `src`. Aquí es donde muere `javascript:` |
| `id_prefix` | Añade una cadena delante de cada `id` permitido, que es la solución para el DOM clobbering |
| `link_rel` | El valor `rel` añadido a los enlaces; por defecto `noopener noreferrer` |
| `clean_content_tags` | Etiquetas cuyo *contenido* también se elimina — el tratamiento correcto para `script` y `style` |
| `strip_comments` | Activado por defecto, así que los trucos de comentarios condicionales no sobreviven |
| `attribute_filter` | Un callback que puede reescribir un valor en vez de eliminar el atributo |

`clean_content_tags` es la que la gente pasa por alto. Eliminar una etiqueta `<script>` conservando su texto deja el JavaScript sentado en el documento como prosa visible, que es inofensivo y parece un fallo. Eliminar la etiqueta y su contenido es lo que querías.

Ahora el orden, porque esta es la parte que se hace al revés. Sanea después de renderizar, nunca antes. Filtrar el origen Markdown es adivinar, porque el analizador es lo que decide qué caracteres se convierten en una etiqueta: un `<` dentro de una valla de código es texto, el mismo `<` en un párrafo empieza un elemento, y un esquema codificado por porcentaje en el destino de un enlace lo decodifica el analizador y no tu expresión regular. Cualquier filtro que corra sobre el origen tendría que reimplementar el analizador para saber cuál es cuál, y si pudiera hacer eso sería el analizador. Renderiza primero, luego limpia el HTML — esa es la única etapa en la que la cadena que estás inspeccionando es la cadena que va a recibir el navegador. [Sanear Markdown de forma segura](/blog/sanitising-markdown-safely) trabaja los casos de fallo en detalle.

Hay una excepción legítima, y no es realmente una excepción: rechazar el HTML crudo en el momento del análisis. `mistune.create_markdown(escape=True)` y `MarkdownIt("commonmark")` con el HTML desactivado significan ambos que el analizador nunca emite una etiqueta cruda en primer lugar. Eso es una garantía más fuerte que sanear, y solo está disponible porque ocurre dentro del analizador en vez de delante de él. Úsala cuando el origen no sea confiable y no necesites nada de HTML pasar. Usa nh3 cuando necesites algo.

TransformPipe está construido de la misma forma: marked renderiza, luego DOMPurify en el navegador y el paquete `xss` en el servidor limpian el resultado contra una misma lista blanca compartida, así que ambos lados producen el mismo documento. Sus ids de encabezado llevan un prefijo `doc-`, que los mantiene fuera del territorio de DOM clobbering — el mismo trabajo que hace `id_prefix` arriba.

## Convertir un fragmento en una página

Las cuatro bibliotecas devuelven un fragmento, y un fragmento no es un documento. Tienen que pasarle tres cosas antes de que otra persona pueda abrir el archivo: una envoltura, estilos, y una decisión sobre qué puede pedirle a la red el archivo.

La envoltura es una plantilla, y Jinja2 es la obvia porque ya está en la mayoría de proyectos de Python:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ title }}</title>
    <style>{{ css }}</style>
  </head>
  <body>
    <main>{{ body|safe }}</main>
  </body>
</html>
```

```python
from jinja2 import Environment, FileSystemLoader, select_autoescape

env = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape(["html"]),
)
page = env.get_template("page.html").render(title=title, body=safe_html, css=css)
```

Dos trampas en seis líneas. La primera es `|safe`. Con el autoescape activado — y debería estarlo — `{{ body }}` renderiza tu HTML como texto literal, y obtienes una página mostrando `<p>Hello</p>` como palabras. `|safe` es lo que dice «esta cadena ya es HTML». La segunda sigue de inmediato: `|safe` es una promesa que estás haciendo, así que la única cadena que marcas como segura es una que ya pasó por nh3. Sanea, luego marca como segura, en ese orden. Una plantilla que marca como segura la salida sin sanear del analizador ha reintroducido en silencio todos los problemas que resolvió la sección anterior.

Los estilos son la parte que la gente se salta y luego lamenta. Una hoja de estilos en una etiqueta `<link>` hace que el archivo HTML dependa de un segundo archivo; mueve uno y no el otro y la página queda sin estilo. Una hoja de estilos desde un CDN hace que el archivo dependa de una red, y le dice a quien lo abre algo sobre por dónde ha andado el archivo. Leer el CSS desde el disco y pasarlo a `{{ css }}` lo incrusta, lo cual es más grande y se comporta igual en todos lados:

```python
from pathlib import Path

css = Path("assets/page.css").read_text(encoding="utf-8")
if use_pygments:
    css += Path("assets/pygments.css").read_text(encoding="utf-8")
```

Esa segunda línea es por lo que `codehilite` no termina en cuanto emite clases — la hoja de estilos de Pygments tiene que viajar con la página o el resaltado queda invisible.

Las imágenes son la última dependencia. `<img src="diagram.png">` en un archivo autocontenido es una imagen rota en la máquina de otra persona. O envías la carpeta entera, o lees los bytes y los incrustas como un URI `data:`, que es lo que necesita un archivo de verdad independiente:

```python
import base64, mimetypes
from pathlib import Path


def inline(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"
```

La prueba de si has terminado es simple y cuesta un minuto: copia el archivo `.html` a otra máquina, apaga la red, y ábrelo. Cualquier cosa que se vea mal es una dependencia de la que no te habías dado cuenta.

## Un script que convierte un directorio

Junta las piezas y una carpeta entera son unas quince líneas.

```python
from pathlib import Path
import markdown, nh3

TEMPLATE = "<!doctype html><meta charset=utf-8><title>{title}</title>{body}"

md = markdown.Markdown(extensions=["tables", "fenced_code", "toc"])
src, out = Path("docs"), Path("build")

for path in sorted(src.rglob("*.md")):
    body = nh3.clean(md.convert(path.read_text(encoding="utf-8")))
    md.reset()
    target = out / path.relative_to(src).with_suffix(".html")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(TEMPLATE.format(title=path.stem, body=body), encoding="utf-8")
    print(f"{path} -> {target}")
```

Tres detalles hacen el trabajo. `encoding="utf-8"` tanto en la lectura como en la escritura, porque la codificación por defecto de la plataforma no es UTF-8 en todos lados y una raya basta para romper el trabajo. `sorted()`, para que el orden de compilación sea el mismo en cada máquina. `md.reset()` dentro del bucle, por la razón de arriba.

Una trampa en la que cae el script de arriba: `nh3.clean` sin argumentos usa la lista blanca por defecto de ammonia, y `id` no está en ella, así que las anclas de encabezado que `toc` acaba de añadir se eliminan de vuelta. Permite el atributo por etiqueta — `attributes={"h1": {"id"}, "h2": {"id"}}` — y fija `id_prefix="doc-"`, porque un `id` desnudo en un encabezado puede sombrear una propiedad del DOM con el mismo nombre.

Quince líneas son la demostración. En lo que se convierte cuando corre según un calendario es un script que se salta el trabajo que ya hizo, convierte archivos en paralelo, y le dice a un trabajo de CI cuando algo salió mal. Son tres añadidos, y cada uno merece entenderse en vez de copiarse.

```python
#!/usr/bin/env python3
"""Convert docs/**/*.md to build/**/*.html. Exit non-zero if any file fails."""
import sys
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import markdown
import nh3
from jinja2 import Environment, FileSystemLoader, select_autoescape

SRC, OUT = Path("docs"), Path("build")
PAGE = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape(["html"]),
).get_template("page.html")
EXTENSIONS = ["tables", "fenced_code", "footnotes", "attr_list", "toc", "sane_lists"]
TAGS = {"p", "a", "code", "pre", "h1", "h2", "h3", "h4", "ul", "ol", "li", "em",
        "strong", "blockquote", "hr", "table", "thead", "tbody", "tr", "th", "td"}
ATTRS = {"a": {"href", "title"}, "code": {"class"},
         "h1": {"id"}, "h2": {"id"}, "h3": {"id"}, "h4": {"id"}}


def convert(path: Path) -> tuple[Path, str | None]:
    target = OUT / path.relative_to(SRC).with_suffix(".html")

    if target.exists() and target.stat().st_mtime >= path.stat().st_mtime:
        return path, None

    try:
        md = markdown.Markdown(extensions=EXTENSIONS)
        body = nh3.clean(
            md.convert(path.read_text(encoding="utf-8")),
            tags=TAGS, attributes=ATTRS, id_prefix="doc-",
            url_schemes={"http", "https", "mailto"},
        )
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(PAGE.render(title=path.stem, body=body, toc=md.toc),
                          encoding="utf-8")
    except Exception as error:                      # noqa: BLE001 - report, do not stop
        return path, f"{type(error).__name__}: {error}"

    return path, None


def main() -> int:
    paths = sorted(SRC.rglob("*.md"))

    with ProcessPoolExecutor() as pool:
        results = list(pool.map(convert, paths))

    failures = [(path, error) for path, error in results if error]

    for path, error in failures:
        print(f"{path}: {error}", file=sys.stderr)

    print(f"{len(paths) - len(failures)} of {len(paths)} converted", file=sys.stderr)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
```

**`pathlib` en vez de `os.path`.** `rglob("*.md")` recorre el árbol, `relative_to` da la parte de la ruta que debe reflejarse en el directorio de salida, `with_suffix(".html")` la renombra, y `mkdir(parents=True, exist_ok=True)` crea lo que falte. Todo el cálculo de rutas es una sola expresión, y es la misma expresión en Windows y en Linux — lo cual importa, porque un script que une rutas con `"/"` produce un resultado que nadie nota mal hasta que corre en un agente de compilación.

**Saltar por mtime.** `target.stat().st_mtime >= path.stat().st_mtime` es la comprobación de obsolescencia más barata que existe, y es exactamente lo que hace `make`. Tiene dos modos de fallo conocidos y conviene conocer ambos. Un cambio en la plantilla o en la lista de extensiones no cambia el mtime de ningún archivo de origen, así que los resultados no se recompilan — la solución es comparar también contra el mtime de la plantilla, o mantener un hash de la configuración junto al resultado. Y un checkout no es una copia: algunos sistemas de CI le dan a cada archivo la hora del checkout, lo cual hace que todo parezca nuevo y recompila el mundo entero. Eso es lento en vez de incorrecto, que es el lado correcto para que falle una caché.

**Un mapa concurrente.** `pool.map` sobre un `ProcessPoolExecutor` mantiene la forma del bucle y usa cada núcleo. Procesos en vez de hilos, porque analizar Markdown es Python puro y el bloqueo global del interprete de CPython significa que los hilos no van a superponer el trabajo; el coste es que los argumentos y los valores de retorno se serializan, por lo que `convert` devuelve una pequeña tupla en vez del HTML. También construye su propia instancia de `Markdown` por llamada — la instancia mantiene estado, que es la misma razón por la que existe `.reset()`, y compartir una entre workers es cómo una nota al pie de una página termina apareciendo al final de otra.

**Un código de salida.** `return 1 if failures else 0` es lo que convierte esto en un paso de compilación en vez de un script que alguien ejecuta. `raise SystemExit(main())` lo propaga. Los errores van a stderr y el proceso sigue convirtiendo los demás archivos, así que un documento malo te da un mensaje de error y un informe completo en vez de una traza de pila y ninguna idea de a cuántos otros afectó. En un trabajo de GitHub Actions, una salida distinta de cero hace fallar el paso, y el registro ya contiene la lista de archivos que se rompieron. [Convertir muchos archivos a la vez](/blog/batch-convert-markdown-files) cubre las variaciones — resultado plano, un documento fusionado, vigilar cambios.

## pypandoc, y cuándo es correcto llamar a Pandoc por fuera

Ninguna de las cuatro bibliotecas de arriba lee nada que no sea Markdown, y ninguna escribe nada que no sea HTML. En el momento en que la descripción del trabajo contiene un segundo formato — un documento Word que primero tiene que convertirse a Markdown, un PDF al final, un manuscrito en LaTeX, un EPUB — la respuesta honesta es dejar de escribir una tubería de analizadores y llamar a Pandoc.

pypandoc es el envoltorio delgado. Tiene licencia MIT, necesita el propio Pandoc, y viene en dos sabores: `pypandoc`, que espera Pandoc en el sistema, y `pypandoc_binary`, que lo incluye. También hay `download_pandoc()` para traerlo en tiempo de ejecución (comprobado en pypi.org, 9 de septiembre de 2026).

```python
import pypandoc

html = pypandoc.convert_text(
    text, to="html5", format="gfm",
    extra_args=["--standalone", "--embed-resources", "--toc"],
)

pypandoc.convert_file("docs/report.md", to="pdf", outputfile="report.pdf")
```

`convert_text` necesita el formato de entrada nombrado explícitamente; `convert_file` lo infiere de la extensión. Ambas aceptan `extra_args` para las propias banderas de Pandoc y `filters` para sus programas de filtro. Las tres banderas de arriba son las que convierten un fragmento en un archivo que otra persona puede abrir: `--standalone` produce un resultado con cabecera y pie en vez de un fragmento, `--embed-resources` incrusta scripts, hojas de estilos e imágenes enlazados como URIs `data:`, y `--toc` genera una tabla de contenidos (comprobado en pandoc.org, 9 de septiembre de 2026).

Recurre a ello cuando la tubería es más ancha que Markdown a HTML. No recurras a ello cuando no lo es, y sé claro sobre lo que asumes: un binario externo en cada entorno donde corra el código, una versión de ese binario que hay que fijar porque el resultado cambia entre versiones, un subproceso por documento con el coste de arranque que eso implica, y un conversor que deja pasar el HTML crudo directamente — Pandoc tampoco es un sanitizador. A cambio, hace plantillas, incrusta recursos, lee y escribe formatos que ninguna otra cosa toca, y va a durar más que tu script. [Las alternativas, y cuándo cada una es la herramienta mejor](/blog/pandoc-alternatives-for-markdown-to-html) es la comparativa completa.

## Lo que cuestan las extensiones: nada de esto es portable

Esta es la parte que la documentación de las bibliotecas no pone en la primera página. Toda función más allá de CommonMark puro es una extensión, las extensiones son propias de cada biblioteca, y un documento escrito contra las extensiones de una biblioteca es un documento que se renderiza correctamente en exactamente un sitio.

Trabaja lo que eso significa en concreto:

| The syntax | Where it renders | Where it does not |
| --- | --- | --- |
| `{: .warning #note }` | Python-Markdown con `attr_list`, MkDocs | GitHub, markdown-it-py, mistune, markdown2 — se muestra como texto literal |
| Bloques `!!! note` | Python-Markdown con `admonition`, MkDocs Material | En todo lo demás — un párrafo que empieza con tres signos de exclamación |
| `[TOC]` | Python-Markdown con `toc` | En todo lo demás — un párrafo que contiene la palabra TOC |
| Vallas `~~~` con atributos | `pymdownx.superfences` | El `fenced_code` plano gestiona la valla, descarta los atributos |
| Listas de tareas `- [ ]` | GitHub, `pymdownx.tasklist`, `task_lists` de mistune, `gfm-like2` | Python-Markdown sin extensión — un elemento de lista que empieza con corchetes |
| Notas al pie `[^1]` | Python-Markdown, markdown2, mistune, mdit-py-plugins — las cuatro, de forma distinta | CommonMark puro; y los ids generados difieren entre las cuatro |
| Matemáticas `$x^2$` | `pymdownx.arithmatex`, `latex` de markdown2, `math` de mistune | Todo lo demás — y cada una de las tres emite un marcado distinto |

El fallo es silencioso en cada fila. Nada lanza un error. El documento simplemente contiene una frase que antes era un aviso.

Así que un documento que se renderiza en MkDocs no es un documento que se renderiza en cualquier sitio. Es un documento que se renderiza en MkDocs. Si tu Markdown vive en un repositorio que la gente también lee en GitHub, o se pega en un cliente de chat, o alguien de otro equipo lo exporta a Word, entonces las extensiones que activas son un coste que paga cada lector que no usa tu compilación. La forma de mantener ese coste visible es apuntar qué extensiones pueden usar tus documentos, mantener la lista en una sola constante en el código, y probar un documento representativo — con una tabla, una nota al pie, una lista anidada y una valla de código — en cada renderizador que vaya a verlo.

Las notas al pie merecen un aviso concreto, porque son la extensión con más probabilidades de que dos bibliotecas distintas la activen en la misma organización. Las cuatro las soportan, ninguna genera los mismos ids, y los enlaces de vuelta difieren. Fusiona dos documentos renderizados en una sola página y las anclas colisionan. Convierte un documento con dos herramientas distintas y las URLs de los enlaces de nota al pie cambian, lo cual rompe cualquier cosa que enlazara directamente a ellas.

Y hay un coste dentro de tu propia compilación también. Cada extensión es código que corre sobre cada documento. `codehilite` trae Pygments y una hoja de estilos. `smarty` reescribe caracteres, así que un diff de tu resultado tras activarla está lleno de cambios que no pretendías — incluso dentro de algo que nunca se pensó como prosa. `nl2br` cambia lo que significa un salto suave, lo cual cambia cómo se reajusta un párrafo en cada documento escrito antes de que la activaras. Las extensiones no son gratis y no son reversibles sin volver a renderizar.

## Cómo elegir

1. **Empieza por lo que tiene que ver el resultado.** Si un navegador renderiza el mismo origen con una biblioteca de JavaScript, elige markdown-it-py e igualalo con el preajuste; cualquier otra cosa significa que la vista previa y la exportación acabarán discrepando, y te enterarás por un lector en vez de por una prueba.
2. **Cuenta las extensiones que realmente necesitas antes de elegir la biblioteca.** Si la lista es tablas y código con valla, las cuatro lo hacen. Si es avisos, contenido con pestañas y matemáticas, estás eligiendo Python-Markdown más pymdown-extensions lo quisieras o no, y estás aceptando que el origen solo se renderiza ahí.
3. **Decide quién escribió el Markdown.** Para tu propio repositorio, sanear es higiene. Para cualquier cosa que llegara de un usuario, una API o un cliente, es el requisito alrededor del cual tiene que encajar el resto del diseño — y significa nh3 después del renderizado, o un analizador configurado para rechazar el HTML crudo del todo.
4. **Pregúntate si necesitas cambiar el resultado o solo producirlo.** Si el HTML tiene que llevar atributos, envolturas o nombres de clase concretos, el renderer de mistune te ahorra un paso de posprocesado que va a fallar el día en que alguien escriba sobre HTML dentro de un ejemplo de código.
5. **Comprueba que el destino es un documento, no un fragmento.** Una biblioteca devuelve un fragmento; si el archivo va a una persona, algo tiene que añadir el doctype, el head y los estilos en línea, y ese algo es tu plantilla. Pruébalo con la red apagada antes de enviarlo.
6. **Fija juntas la biblioteca y la lista de extensiones.** Una versión menor que cambia un valor por defecto, o un compañero que añade una extensión para arreglar una página, cambia cada página. Ambas cosas van en el mismo commit que el archivo de requisitos.
7. **Detente y usa Pandoc si la lista de formatos es más larga que uno.** Una biblioteca de Markdown a HTML que le crece una rama de Word y una rama de PDF es un Pandoc peor con una suite de pruebas más pequeña.

## Conclusión

Elige según el requisito: Python-Markdown para las extensiones y el ecosistema de documentación construido sobre ellas, markdown2 cuando una llamada con una lista de extras es todo el trabajo, mistune cuando el HTML tiene que salir con una forma concreta, markdown-it-py cuando tiene que coincidir con la especificación y con un navegador. Luego añade nh3 después del renderizado, pon el fragmento en una plantilla que incrusta sus propios estilos, y dale al script un código de salida para que un documento roto haga fallar una compilación en vez de publicarse. Si todo lo que necesitas es una página que un compañero pueda abrir, sáltate la compilación por completo — [convierte el archivo en el navegador](/) y descarga el HTML autocontenido, o haz que el script lo mande por POST a la API y recibe un enlace de solo lectura en una sola llamada.

## Preguntas frecuentes

### ¿Qué biblioteca de Python debería usar para convertir Markdown a HTML?

Python-Markdown si ya estás en una cadena de documentación que la usa, markdown-it-py si un navegador tiene que renderizar el mismo origen de forma idéntica, mistune si necesitas cambiar el HTML emitido, y markdown2 si quieres un import y una llamada. Las cuatro son gratis y de código abierto, y ninguna sanea.

### ¿Por qué mi resultado de Python-Markdown muestra barras verticales en vez de una tabla?

Porque `tables` es una extensión y está apagada salvo que la nombres: `markdown.markdown(text, extensions=["tables"])`. Lo mismo aplica a los bloques de código con valla, las notas al pie y los ids de encabezado. El paquete `extra` activa siete extensiones incluida `tables`, pero no `toc` ni `codehilite`.

### ¿Sigue siendo bleach la forma correcta de sanear HTML en Python?

No. La propia página de PyPI de bleach dice que ya no tiene mantenimiento y que no habrá más versiones, ni siquiera por seguridad, con una última versión 6.4.0 el 5 de junio de 2026 (comprobado en pypi.org, 9 de septiembre de 2026). nh3, un binding a la biblioteca ammonia en Rust, es el sustituto actual y toma una lista blanca explícita de etiquetas y atributos.

### ¿Debería sanear el Markdown o el HTML?

El HTML, siempre, y después de renderizar. El analizador es lo que decide qué caracteres del origen se convierten en etiquetas, así que un filtro que corre sobre el Markdown tiene que adivinar, y adivina mal en las vallas de código, los destinos de enlace y los caracteres escapados. La alternativa es configurar el analizador para que rechace el HTML crudo desde el principio, lo cual es todavía más fuerte.

### ¿Cómo consigo resaltado de sintaxis en Python-Markdown?

Activa `codehilite`, instala Pygments, y genera la hoja de estilos — la documentación de la extensión da el comando como `pygmentize -S default -f html -a .codehilite > styles.css` (comprobado en python-markdown.github.io, 9 de septiembre de 2026). Sin esa hoja de estilos, las clases están ahí y los colores no. `noclasses=True` escribe estilos en línea en su lugar, lo cual sobrevive a pegarse en algún sitio sin el CSS.

### ¿Qué es pymdown-extensions y lo necesito?

Es un paquete con licencia MIT de extensiones para Python-Markdown bajo el espacio de nombres `pymdownx`, incluidas SuperFences, Highlight, Tabbed, Tasklist, Details y Arithmatex (comprobado en facelessuser.github.io, 9 de septiembre de 2026). Lo necesitas si quieres contenido con pestañas, vallas anidadas, listas de tareas o matemáticas, nada de lo cual ofrece oficialmente Python-Markdown. No lo necesitas para tablas, notas al pie o código con valla.

### ¿Puedo hacer que Python y JavaScript rendericen el mismo Markdown de forma idéntica?

Casi, usando markdown-it-py en Python y markdown-it en JavaScript — el primero es un port del segundo, ambos siguen la especificación CommonMark, y los nombres de los plugins coinciden en su mayoría. Mantén el preajuste y las reglas activadas en una sola configuración compartida, porque una diferencia en esa lista produce una diferencia en el resultado que ningún lado reporta.
