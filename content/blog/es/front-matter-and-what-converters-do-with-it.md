---
title: "El front matter de Markdown, y qué hace cada conversor con él"
description: "El bloque al principio de un archivo Markdown se elimina, se renderiza, se convierte en tabla o se lee como metadatos, y cuál de las cuatro decide la herramienta"
date: 2026-08-18
tag: Sintaxis
keywords: front matter markdown, front matter yaml, cómo quitar el front matter, conversor markdown con front matter, front matter toml, front matter json, front matter en hugo, front matter en jekyll, metadatos en markdown
---

Llega un archivo, lo conviertes, y la página se abre con una línea horizontal, seguida de un encabezado en negrita que dice `title: Q3 review date: 2026-08-04 draft: false`. Nada está roto. El conversor hizo exactamente lo que la especificación de Markdown dice que hay que hacer con tres guiones, un párrafo y tres guiones más. El bloque que pensabas como metadatos es, para un analizador que nunca oyó hablar del front matter, simplemente texto.

### Resumen rápido

El front matter es un bloque de metadatos al principio de un archivo `.md`, y no aparece en ninguna especificación de Markdown — ni CommonMark, ni GFM. Por eso cada herramienta decide por su cuenta, y solo hay cuatro resultados posibles: el bloque se **elimina** y se descarta, se **renderiza** como contenido del documento, se **convierte en tabla**, o se **lee como metadatos** y se usa. Los generadores de sitios estáticos lo leen; los conversores y bibliotecas simples lo renderizan, lo que parece un fallo y es literalismo; GitHub lo tabula. Si el archivo va a un sitio que lo va a renderizar, elimina el bloque primero o usa una herramienta con opción de front matter, y nunca escribas una regla `---` al principio de un documento.

El front matter entró en Markdown de rebote. Jekyll quería variables por página, eligió un bloque YAML delimitado por `---`, y todo generador desde entonces copió la convención sin que nadie la escribiera en ninguna especificación. El resultado es una construcción que soportan una docena de herramientas muy usadas, que ninguna de las dos soporta de forma idéntica, y que un analizador tiene todo el derecho de ignorar por completo.

Ahí está la fricción. No puedes saber mirando un archivo qué le va a pasar a su cabecera, y tampoco puedes saberlo leyendo la lista de funciones de un conversor, porque «soporta Markdown» no dice nada sobre un bloque que no es Markdown. El fallo es silencioso en las dos direcciones: un renderizador imprime tus metadatos dentro del documento, donde los lectores los leen, y un lector de metadatos borra en silencio una regla `---` que pensabas como divisor visible.

Este texto trata de qué hace cada herramienta, por qué el comportamiento de renderizado es defendible y no un error, qué pasa con las cabeceras TOML y JSON, y la única trampa genuina — que `---` es al mismo tiempo un delimitador de front matter, una regla horizontal y un subrayado de encabezado setext, y cuál de los tres se activa depende de dónde caiga.

## Un bloque que ninguna especificación de Markdown define

Toma el ejemplo más pequeño posible y pásalo por un analizador sin soporte de front matter. Este es `marked`, la biblioteca detrás de muchas vistas previas y conversores:

```md
---
title: Notes
date: 2026-01-01
---

Body
```

La salida no es la que daría un generador:

```html
<hr>
<h2>title: Notes
date: 2026-01-01</h2>
<p>Body</p>
```

Léelo como lo lee un analizador y es inevitable. El primer `---` no tiene nada arriba, así que es un corte temático — un `<hr>`. Las dos líneas `clave: valor` son un párrafo. El `---` de cierre queda justo debajo de un párrafo, y en Markdown una línea de guiones bajo un párrafo es un subrayado de encabezado setext, que convierte el párrafo de arriba en un `<h2>`. Tres guiones, un párrafo, tres guiones: regla, encabezado. El conversor está siendo fiel a la única especificación que existe para los caracteres que recibió.

Pon una línea en blanco dentro del bloque, algo que YAML permite y que la gente hace cuando la cabecera crece, y la forma vuelve a cambiar:

```html
<hr>
<p>title: Notes</p>
<h2>date: 2026-01-01</h2>
```

Ahora la primera clave es un párrafo y solo la última se vuelve encabezado, porque un subrayado setext solo reclama el párrafo que tiene justo arriba. Misma intención, dos documentos distintos, y ninguno es un fallo. Es el mismo tipo de problema que [las diferencias entre los sabores de Markdown](/blog/commonmark-gfm-and-the-flavours), con un agravante: los sabores al menos documentan lo que añaden. El front matter es una convención y no una extensión, así que no hay nada contra lo que comprobar una herramienta.

Los cuatro resultados de abajo son exhaustivos. Una herramienta puede tirar el bloque, imprimirlo, darle formato o usarlo. Todo lo que te vas a encontrar en la práctica es uno de esos cuatro, y la única pregunta que vale la pena hacerse sobre un conversor es cuál eligió.

## Comparativa rápida: qué hace cada herramienta con el bloque

| Herramienta | Qué hace con el front matter | Delimitadores que reconoce | Con qué te quedas | Precio |
| --- | --- | --- | --- | --- |
| Jekyll | Lo lee como metadatos; una página necesita el bloque para procesarse siquiera | `---` YAML | Variables de página en las plantillas, el bloque desaparece de la salida | Gratis, MIT |
| Hugo | Lo lee como metadatos | `---` YAML, `+++` TOML, `{` y `}` JSON | Parámetros de página, el bloque desaparece de la salida | Gratis, Apache 2.0 |
| Eleventy | Lo lee como metadatos a través de gray-matter | `---` YAML, más un sufijo de idioma como `---json` | Entradas de la cascada de datos, el bloque desaparece | Gratis, MIT |
| MkDocs | Lo lee como metadatos de página | `---` YAML | `page.meta` en las plantillas, el bloque desaparece | Gratis, BSD |
| Docusaurus | Lo lee como metadatos de página | `---` YAML | Posición en la barra lateral, slug y etiquetas; el bloque desaparece | Gratis, MIT |
| Pandoc | Lo lee como metadatos, con la extensión activada | `---` para abrir, `---` o `...` para cerrar | Variables de plantilla, y un bloque de título con `--standalone` | Gratis, GPL |
| marked | Lo renderiza como contenido | Ninguno | Un `<hr>` y un `<h2>` con tus claves | Gratis, MIT |
| markdown-it | Lo renderiza como contenido salvo que se añada un plugin | Ninguno integrado | Un `<hr>` y un `<h2>` con tus claves | Gratis, MIT |
| remark con remark-frontmatter | Lo reconoce, no lo interpreta, lo elimina del HTML | `---` YAML, `+++` TOML, delimitadores personalizados | Un nodo `yaml` en el árbol y nada en el HTML | Gratis, MIT |
| Python-Markdown con `meta` | Lo elimina y lo expone como cadenas | `---` de apertura opcional, `---` o `...` de cierre, o una línea en blanco | `md.Meta` como listas de cadenas | Gratis, BSD |
| gray-matter | Lo separa y lo interpreta por ti | `---` por defecto, configurable, sufijos de idioma | `data`, `content` y `excerpt` si lo pides | Gratis, MIT |
| GitHub | Lo convierte en tabla | `---` YAML | Una tabla de dos filas encima de tu documento | Gratis |
| GitLab | Lo muestra tal cual, en un recuadro encima del documento | `---` YAML, `+++` TOML, `;;;` JSON | El bloque en crudo, visible, arriba de todo | Gratis |
| Vista previa de VS Code | Lo oculta | `---` YAML | Nada; la vista previa arranca en tu primer encabezado | Gratis |
| Obsidian | Lo lee como propiedades y las muestra en su propio panel | `---` YAML | Campos tipados, con `tags` y `aliases` reservados | Gratis |
| Una expresión regular en tu propio build | Lo elimina, normalmente bien | Lo que diga el patrón | Una cadena más corta, y un caso límite esperando | Gratis |

La lista de delimitadores de GitLab es la más amplia de todas las herramientas de aquí: YAML con `---`, TOML con `+++`, JSON con `;;;`, y un especificador de idioma añadido al delimitador, como `---php` (comprobado en docs.gitlab.com, el 8 de septiembre de 2026).

## Los cuatro destinos, uno por uno

### Eliminado: el bloque se quita y se olvida

El comportamiento más simple, y el más común dentro de un build. La herramienta encuentra el bloque, lo quita del texto, y no hace nada más con él. La extensión `meta` de Python-Markdown es explícita sobre el orden — su documentación dice que todos los metadatos se eliminan del documento antes de que Markdown haga ningún otro procesamiento — y `remark-frontmatter` acaba en el mismo lugar para la salida HTML, porque el nodo que añade al árbol no tiene ningún manejador de HTML y por lo tanto no produce nada.

| A favor | En contra |
| --- | --- |
| La salida es el documento, sin que ningún metadato se filtre dentro | Los metadatos desaparecen, así que un título tiene que venir de otro lado |
| Nada que configurar una vez activado | Silencioso: una regla `---` al principio del cuerpo se elimina con la misma alegría |
| Funciona con cualquier clave, YAML válido o no, en la versión más cruda | Una versión con expresión regular se rompe con una línea de guiones dentro de un valor entre comillas |

**¿Para quién es?** Para cualquiera que convierta archivos que salieron de un generador y van a algún sitio que no necesita los metadatos: un README convertido en página, una carpeta de documentación renderizada para revisión, un conjunto de notas exportado para un cliente. Si solo necesitas la prosa, eliminar el bloque es la respuesta correcta y la más barata de conseguir.

La separación de `remark-frontmatter` merece entenderse si usas unified, porque es fácil esperar demasiado del plugin. Añade un nodo de tipo `yaml` — o `toml` — que lleva el texto crudo como una cadena, y su readme es tajante en que no interpreta los datos de dentro; eso es un trabajo aparte para algo como `vfile-matter`. Así que instalarlo te compra la eliminación, no los metadatos. Es una división del trabajo sensata y una sorpresa para quien lo instaló esperando `data.title`.

### Renderizado: el conversor es literal, no está roto

Cada biblioteca de Markdown de propósito general sin función de front matter aterriza aquí, y también cada conversor construido sobre una cuya autora nunca decidió nada sobre las cabeceras. Obtienes el `<hr>` y el `<h2>`, y parece que la herramienta se comió tu archivo.

| A favor | En contra |
| --- | --- |
| Fiel: nada de la entrada se borra en silencio | Tus metadatos aparecen en el documento, donde los lectores los leen |
| Predecible en cuanto conoces la regla | Parece un defecto, así que la gente lo reporta como tal |
| Sin plugin, y sin duda sobre qué se descartó | La forma exacta depende de las líneas en blanco dentro del bloque |

**¿Para quién es?** Nadie lo elige a propósito, y sigue siendo el comportamiento por defecto correcto para una biblioteca. Un analizador que adivinara qué párrafos eran metadatos se equivocaría en algún caso, y ese error sería irrecuperable, porque el texto habría desaparecido. Renderizar mantiene la información dentro del documento y deja la decisión en manos de quien llama, que es donde pertenece. `marked` no tiene opción de front matter, y el consejo habitual es pasar `gray-matter` sobre la cadena primero. `markdown-it` tampoco tiene una regla de front matter propia; los plugins para él funcionan encontrando el bloque y no renderizando nada, entregando el texto crudo a una función de retorno para que hagas lo que quieras con él.

La consecuencia práctica es que «el conversor destrozó mi cabecera» y «el conversor no tiene ninguna opinión sobre las cabeceras» son el mismo evento. Si estás eligiendo entre herramientas, esto es una de las cosas que [una comparativa de funciones no te va a decir](/blog/best-markdown-to-html-converters), y hace falta un archivo y diez segundos para descubrirlo.

### Convertido en tabla: renderizado, pero con formato

GitHub lee el bloque, lo reconoce, y lo renderiza como una tabla encima de tu documento — las claves en la fila de cabecera, los valores en la única fila de abajo. Es una concesión deliberada, y tiene sentido para un alojador de código: GitHub Pages corre sobre Jekyll, así que el front matter dentro de un repositorio suele ser metadatos reales y no un accidente, y mostrarlo le gana a imprimirlo como encabezado.

| A favor | En contra |
| --- | --- |
| El bloque se reconoce como metadatos, no se confunde con prosa | Una cabecera con una docena de claves se convierte en una tabla de una docena de columnas |
| Nada se oculta a quien navega el repositorio | Valores largos, listas y YAML anidado se leen mal dentro de una celda |
| Consistente en cada `.md` renderizado dentro de un repositorio | No se puede desactivar para un solo archivo |

**¿Para quién es?** Para lectores, no para builds. Es la decisión correcta para un alojador de código e irrelevante para un pipeline, y por eso un archivo puede verse ordenado en GitHub y llegar como una regla y un encabezado en tu propio conversor: dos herramientas, dos de los cuatro destinos, un archivo sin cambios. GitLab toma una decisión parecida y muestra el bloque tal cual, en un recuadro arriba del documento, que es el mismo instinto con menos formato.

### Leído como metadatos: el bloque hace algo

El destino para el que se inventó el bloque. La herramienta interpreta el YAML, usa las claves, y las quita del contenido.

Jekyll lo empezó: un archivo que comienza con el bloque se procesa, y uno que no lo lleva se copia sin tocar, que es por lo que un bloque `---` vacío es algo que la gente escribe a propósito de verdad. Hugo determina el formato por los delimitadores y convierte las claves en parámetros de página, con `title`, `date`, `draft`, `weight`, `description`, `slug` y `layout` entre los estándar. MkDocs expone el bloque como `page.meta`. Docusaurus usa `id`, `title`, `sidebar_position` y `slug`. Obsidian lee el bloque como propiedades tipadas y las muestra en un panel en vez de en el cuerpo de la nota, reservando `tags`, `aliases` y `cssclasses` para su propio comportamiento.

Pandoc es el caso interesante, porque es un conversor y no un generador, y aun así lee el bloque. La extensión se llama `yaml_metadata_block`, y pertenece al dialecto propio de Markdown de Pandoc, así que cuando el formato de entrada es `commonmark` o `gfm` hay que nombrarla en el formato en vez de asumirla:

```bash
pandoc -f gfm+yaml_metadata_block -t html --standalone notes.md -o notes.html
```

Tres detalles del manual merecen recordarse. El delimitador de apertura es una línea de tres guiones, y el de cierre puede ser `---` o tres puntos. El bloque no tiene que estar al principio del archivo — puede aparecer en cualquier parte del documento, siempre que una línea en blanco lo preceda cuando no está al inicio. Y `title`, `author`, `date` y `abstract` los usan las plantillas por defecto, mientras que cualquier otra clave se convierte en una variable de plantilla que se establece automáticamente desde los metadatos, que es cómo se consigue meter una cadena de versión en un pie de página sin tocar el cuerpo del documento (comprobado en pandoc.org, el 8 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| Los metadatos hacen lo que se escribieron para hacer | Solo funciona cuando ambos lados están de acuerdo en los nombres de las claves |
| El cuerpo del documento se mantiene limpio | Un YAML inválido se convierte en un fallo del build en vez de en una rareza |
| Un título en el archivo significa un título en la salida | Las claves son por herramienta: `weight` no significa nada para Jekyll |

**¿Para quién es?** Para cualquiera cuyo Markdown viva en un repositorio y lo construya algo — un sitio de documentación, un blog, una carpeta de manuales. Si los archivos son la fuente de verdad, el front matter es donde pertenecen las partes de una página que no son prosa, y eso es la mayor parte de lo que hace que [la documentación que vive en el repositorio](/blog/documentation-that-lives-in-the-repo) funcione siquiera.

Si quieres el análisis sin el generador, `gray-matter` es la biblioteca que casi todo en JavaScript usa para esto. Devuelve `data` — el bloque interpretado como un objeto —, `content`, que es la entrada con el bloque quitado, y `excerpt` si lo pides. Maneja YAML, JSON y front matter en JavaScript de fábrica; TOML y CoffeeScript están disponibles añadiendo un motor. Los delimitadores se configuran con la opción `delimiters`, y se puede nombrar un idioma en el delimitador de apertura como `---toml`. Tiene licencia MIT. En Python, `python-frontmatter` cubre el mismo hueco sobre PyYAML.

```js
import matter from "gray-matter";
import { marked } from "marked";

const { data, content } = matter(raw);
const html = marked.parse(content);

// data.title is now yours to put in the <title> element.
```

Dos líneas, y el bloque pasa del segundo destino al cuarto.

## TOML, JSON y los delimitadores en los que nadie se puso de acuerdo

YAML con `---` es el estándar de facto en todas partes, pero no es la única convención, y las alternativas fallan de forma distinta.

El front matter en TOML se delimita con `+++`, algo que Hugo soporta desde que existe. A diferencia de `---`, `+++` no significa nada en Markdown, así que un conversor simple no produce ni regla ni encabezado. Produce un párrafo de texto literal:

```html
<p>+++
title = &quot;Notes&quot;
+++</p>
```

Eso es, según se mire, mejor, porque es obviamente incorrecto y nadie lo confunde con un encabezado real, y según se mire, peor, porque tus metadatos son ahora prosa visible arriba de la página. De cualquier forma, una herramienta que reconoce front matter YAML no necesariamente reconoce TOML: `gray-matter` necesita un motor añadido para eso, `remark-frontmatter` tiene un preajuste de TOML que hay que pedir, y el `yaml_metadata_block` de Pandoc es, como dice el nombre, YAML.

El front matter en JSON es más extraño, porque en Hugo no hay delimitadores en absoluto — el archivo empieza con `{` y el objeto termina con `}`. Eleventy toma el otro camino y te deja escribir `---json` en el delimitador de apertura, que es una función de gray-matter y no de Eleventy. Para un analizador de Markdown, un objeto JSON sin delimitar al principio de un archivo es un párrafo de llaves y comillas, escapado y mostrado. GitLab reconoce `;;;` para JSON, que es una cuarta convención para la misma idea.

| Formato | Delimitadores | Reconocido por | Qué produce un analizador simple |
| --- | --- | --- | --- |
| YAML | `---` a `---`, o `...` para cerrar en Pandoc | Todo lo que soporta front matter siquiera | Un `<hr>` más un `<h2>` con tus claves |
| TOML | `+++` a `+++` | Hugo, GitLab, remark con el preajuste TOML | Un párrafo visible con `+++` y claves literales |
| JSON | `{` a `}`, sin delimitar | Hugo | Un párrafo visible de llaves y comillas |
| JSON | `---json` a `---` | Eleventy, y gray-matter por debajo | Un párrafo visible, o un encabezado si el delimitador va desnudo |
| JSON | `;;;` a `;;;` | GitLab | Un párrafo visible de punto y coma y claves |

La lección es estrecha y útil. YAML es el único formato con algo parecido a soporte universal, así que a menos que alguna herramienta de tu cadena exija otra cosa, escribe YAML. Los delimitadores exóticos no compran nada salvo un conjunto más pequeño de herramientas que van a entender el archivo dentro de dos años.

## La trampa: el delimitador también es una regla horizontal

Todo lo anterior es cuestión de saber qué herramienta tienes en las manos. Esta parte es una ambigüedad real de la sintaxis, y corta en las dos direcciones.

`---` en una línea sola tiene tres significados en Markdown, decididos enteramente por el contexto. Con texto justo arriba, es un subrayado de encabezado setext. Con una línea en blanco arriba, es un corte temático — un `<hr>`. Y al principio absoluto de un archivo, es lo que busca cualquier analizador de front matter. Nada en la sintaxis distingue el tercer caso del segundo: la posición es toda la señal.

Así que piensa en un documento que abre con un divisor, algo que la gente escribe por razones estéticas más a menudo de lo que uno esperaría:

```md
---

Notes from the incident review, 4 August.

---

## Timeline
```

Un analizador de front matter lee el primer `---`, busca el siguiente, lo encuentra cuatro líneas más abajo, y toma todo lo de en medio como metadatos. Lo que pasa después depende de la herramienta. Un análisis YAML de `Notes from the incident review, 4 August.` funciona sin problema — YAML acepta feliz leer una frase suelta como cadena —, así que nada estalla; el analizador simplemente obtiene una cadena donde esperaba un objeto. Algunas herramientas lo ignoran, algunas lo registran, y todas devuelven el contenido con tu línea inicial eliminada. El documento que recibes de vuelta empieza en `## Timeline`, y no se levantó ningún error en ninguna parte.

Haz que esa primera línea sea algo que a YAML no le guste y obtienes el fallo contrario: un build que se detiene con un error de análisis que señala a la prosa. Los dos resultados vienen de la misma causa, que es que el delimitador no está reservado para un solo trabajo.

La otra dirección muerde cuando se combinan archivos. Concatena varios archivos que cada uno empieza con una cabecera, y solo el primer bloque queda en posición de front matter. El resto cae en medio del documento, donde tres guiones significan regla y encabezado — que es por lo que [fusionar muchos archivos Markdown](/blog/merging-many-markdown-files) necesita que los bloques se quiten al leer cada archivo, y no limpiarlos después.

Dentro del bloque, los mismos caracteres guardan una sorpresa más. La extensión `meta` de Python-Markdown termina los metadatos en la primera línea en blanco o en el primer delimitador de cierre, lo que llegue primero, así que una línea en blanco en medio de una cabecera larga la trunca y las claves restantes se vuelven texto del cuerpo. Las bibliotecas que renderizan el bloque también lo dividen en la línea en blanco, como se mostró antes, solo que en un párrafo y un encabezado en vez de eso.

Tres hábitos eliminan toda esta clase de problema:

- Escribe las reglas horizontales como `***` o `___`, nunca como `---`. Producen un `<hr>` idéntico y no se pueden confundir con un delimitador ni con un subrayado de encabezado.
- Mantén el `---` de apertura en la primerísima línea del archivo, sin línea en blanco ni marca de orden de bytes antes. La mayoría de los analizadores exigen el delimitador al principio de la cadena, y si no está ahí, concluyen en silencio que no hay front matter.
- No dejes líneas en blanco dentro del bloque. YAML las permite, varios lectores de front matter no, y las herramientas que renderizan el bloque cambian de forma por su culpa.

## Dónde falla eliminarlo y seguir adelante, y qué cuesta

Eliminar el bloque es la respuesta obvia para convertir, y suele ser la correcta. Esto es lo que cuesta en realidad, porque el coste nunca está en la propia página de la herramienta.

**El título se va con él.** El único metadato que todo formato de salida quiere es el título, y eliminar el bloque lo borra. Un archivo HTML sin `<title>` muestra el nombre del archivo en la pestaña del navegador, que es lo que alguien ve en su barra de pestañas y en sus marcadores. Un documento llamado `final-v3.html` sentado en una pestaña es una pequeña indignidad que un cambio de dos líneas evita: interpreta el bloque, conserva `title`, ponlo en el head. Lo mismo pasa con la descripción, que es lo que lee un cliente de chat cuando construye la vista previa de un enlace.

**Las fechas dejan de ser fechas.** Una fecha en YAML no es una cadena para la mayoría de los analizadores. Una marca temporal es un tipo YAML resuelto y no texto, así que con `date: 2026-08-18`, js-yaml devuelve un `Date` de JavaScript y PyYAML devuelve un `datetime.date` (comprobado en yaml.org, el 8 de septiembre de 2026). Eso resulta cómodo hasta que entra en juego una zona horaria y un documento fechado el 18 se renderiza como el 17 en algún lugar al oeste de ti. Pon el valor entre comillas cuando quieras los caracteres exactos que escribiste.

**Los tipos de YAML son un peligro en sí mismos.** El caso clásico es el problema de Noruega. PyYAML es un analizador YAML 1.1 completo, y YAML 1.1 definió `y`, `yes`, `n`, `no`, `on` y `off` como booleanos, así que `country: NO` vuelve como `False` (PyYAML 6.0.3, comprobado en pypi.org, el 8 de septiembre de 2026). js-yaml dejó de convertir esas palabras en booleanos y lee números según las reglas de YAML 1.2, así que las mismas palabras vuelven como cadenas (js-yaml 5.4.1, comprobado en github.com/nodeca/js-yaml, el 8 de septiembre de 2026). La misma cabecera significa entonces cosas distintas en un build de Python y en uno de Node, que es un fallo de verdad desagradable cuando un sitio de documentación lo construye uno y lo revisa el otro. Y `version: 1.10` es el número 1.1 en ambos, porque es un flotante — pon comillas a los números de versión o pierde el cero final.

**Una coma en un título es un error de análisis.** Este es el defecto de front matter más común que hay. `title: Release 2.1: what changed` no es YAML válido: los dos puntos segundos empiezan un nuevo mapeo, y el analizador reporta una indentación incorrecta en una línea que a una persona le parece perfectamente normal. El arreglo son las comillas, y la razón para saberlo de antemano es que el mensaje de error nunca menciona los dos puntos.

**Los tabuladores son ilegales.** YAML prohíbe los tabuladores en la indentación, así que un editor configurado para insertarlos rompe una lista anidada dentro de una cabecera con un error sobre caracteres de tabulación, y nada en la pantalla se ve mal a simple vista.

**Una expresión regular no es un analizador.** Una eliminación hecha a mano — buscar del primer `---` al siguiente `---` y quitarlo — son tres líneas y funciona en casi cualquier archivo. Falla con un valor que contiene una línea de tres guiones, con un archivo cuya primera línea es una regla, y con una cabecera cerrada con `...`. Casi todos los archivos van bien; la excepción te cuesta un documento con el primer párrafo desaparecido y sin ningún error que explique adónde se fue.

**Y a veces los metadatos eran el objetivo.** Los archivos exportados de herramientas de notas y de conocimiento llevan propiedades en la cabecera — estado, responsable, fecha de revisión, etiquetas — y esas son con frecuencia la parte que alguien quería conservar. Eliminar el bloque tira la mitad estructurada de la exportación y solo se queda con la prosa, que es una pérdida real cuando la estructura era la razón de la migración. Vale la pena comprobarlo antes de un traslado masivo desde [Notion, Obsidian o Confluence](/blog/markdown-from-notion-obsidian-and-confluence), porque esas herramientas no están de acuerdo en si las propiedades salen como front matter, como simples líneas `clave: valor` sin ningún delimitador, o no salen en absoluto.

## Qué comprobar antes de entregar el archivo

1. **Convierte un archivo real y mira el principio de la salida.** Diez segundos de mirar te dicen con cuál de los cuatro destinos estás tratando, y ninguna lista de funciones lo hará: una regla y un encabezado significa que la herramienta renderiza, un primer encabezado limpio significa que elimina o lee, una tabla significa GitHub.
2. **Decide si necesitas los metadatos antes de elegir la herramienta.** Si un título, una fecha o una descripción tienen que llegar a la salida, necesitas una herramienta de la cuarta categoría o un paso de análisis propio, y poner `gray-matter` delante de un renderizador son dos líneas — barato de añadir, caro de descubrir que se olvidó después de publicar las páginas.
3. **Valida el YAML por su cuenta, una vez.** Pasa el bloque por un analizador YAML aparte y atrapas los dos puntos sin comillas, el tabulador, el booleano que antes era un código de país y el número de versión que perdió su cero. Sáltatelo y cada uno de esos llega más tarde como un fallo de build o, peor, como un valor equivocado que nadie revisa.
4. **Busca `---` en el documento antes de convertirlo o concatenarlo.** Cada coincidencia es una regla, un subrayado de encabezado o un delimitador, y cuál de los tres es depende enteramente de la línea de arriba. Reemplazar las reglas intencionales por `***` elimina la ambigüedad de forma permanente, y es un buscar y reemplazar, no un proyecto.
5. **Acuerda los nombres de las claves con quien las lea.** `weight` no significa nada para Jekyll, `layout` no significa nada para Docusaurus, `draft` no significa nada para un conversor simple, y una clave no reconocida no es un error — es silencio. Una clave que nadie lee es un comentario con pasos extra, y una clave mal escrita que sí lee algo es una página que se publica cuando querías que no lo hiciera.

## Conclusión

El front matter es una convención que superó su origen sin llegar nunca a formar parte del lenguaje, así que el bloque al principio de tu archivo no tiene un significado definido y cuatro destinos posibles. Los generadores lo leen, Pandoc lo lee cuando se le pide, las bibliotecas lo renderizan porque renderizar es el comportamiento honesto por defecto para un texto que un analizador no reconoce, y GitHub lo tabula para los lectores. Saber cuál aplica es la diferencia entre una página que empieza con tu primer encabezado y una que empieza con una línea horizontal y un encabezado lleno de dos puntos. Para averiguar en qué se convierte un archivo concreto, [convertilo y mira el principio](/) — la respuesta tarda menos en llegar de lo que tardaría discutirla. Cuando los metadatos importan, sepáralos con un analizador antes de que el renderizador los vea, y escribe tus reglas como `***` de aquí en adelante.

## Preguntas frecuentes

### ¿Qué es el front matter en un archivo Markdown?

Es un bloque de metadatos al principio del archivo, por convención YAML delimitado por líneas de tres guiones, que guarda cosas como el título, la fecha, las etiquetas y la plantilla. Lo popularizó Jekyll y lo copió casi todo generador de sitios estáticos desde entonces. No es parte de la sintaxis de Markdown, que es la razón por la que las herramientas no se ponen de acuerdo sobre él.

### ¿El front matter es parte de CommonMark o de GitHub Flavored Markdown?

No. Ninguna de las dos especificaciones lo menciona, y ninguna reserva el delimitador `---` para él. El soporte es una extensión o convención de cada herramienta por separado, así que un analizador estrictamente conforme tiene razón al renderizar el bloque como un corte temático seguido de un encabezado setext.

### ¿Por qué mi HTML convertido empieza con una línea y un encabezado lleno de dos puntos?

Porque el conversor no tiene soporte de front matter e interpretó el bloque literalmente. El `---` de apertura se volvió un `<hr>`, tus líneas `clave: valor` se volvieron un párrafo, y el `---` de cierre subrayó ese párrafo convirtiéndolo en un `<h2>`. Elimina el bloque antes de convertir, o usa una herramienta que lo reconozca.

### ¿Cómo quito el front matter antes de convertir un archivo?

En JavaScript, pasa el texto por `gray-matter` y entrégale su `content` a tu renderizador. En Python, usa `python-frontmatter`, o la extensión `meta` de Python-Markdown, que elimina el bloque antes de cualquier otro procesamiento. Con Pandoc, activa `yaml_metadata_block` para que el bloque se trate como metadatos y no como contenido.

### ¿GitHub muestra el front matter en YAML?

Sí, como una tabla encima del documento, con las claves en la fila de cabecera y los valores en la fila de abajo. Es una decisión deliberada y no un accidente de renderizado, y significa que un archivo puede verse correcto en GitHub y salir como una regla y un encabezado en un conversor sin soporte de front matter.

### ¿Puedo usar front matter en TOML o JSON en vez de YAML?

Puedes, y reduces el conjunto de herramientas que van a entender el archivo. TOML se delimita con `+++`, y JSON o va sin delimitar entre llaves o usa un delimitador de apertura `---json` según la herramienta; el soporte para ambos es mucho más irregular que para YAML. Un analizador de Markdown simple renderiza cualquiera de los dos como un párrafo visible en vez de como una regla y un encabezado.

### ¿Una regla horizontal al principio de mi documento se puede confundir con front matter?

Sí, puede pasar. Un analizador que busca front matter toma el primer `---` como delimitador de apertura y todo hasta el siguiente `---` como metadatos, así que un documento que abre con una regla puede perder su primer párrafo sin que se levante ningún error en ninguna parte. Escribe las reglas como `***` y mantén esa ambigüedad fuera de tus archivos.
