---
title: "Markdown a texto: quita la sintaxis, conserva las palabras"
description: Convertir Markdown a texto plano sin destrozarlo - por qué una expresión regular falla con fences, escapes, tablas y enlaces, y qué hacen Pandoc, remark y lynx.
date: 2026-08-23
tag: Conversión
keywords: markdown a texto, markdown a texto plano, quitar formato markdown, eliminar sintaxis markdown, markdown a txt, pandoc texto plano, contar palabras markdown
---

### Resumen rápido

Usa un analizador, nunca una expresión regular: el código delimitado, los escapes con barra invertida, las tablas, los enlaces de referencia y los bloques de HTML en crudo rompen todos la coincidencia de patrones, y la rompen en silencio. Para un documento entero, `pandoc -t plain` es el camino correcto más corto, con `--wrap=none` cuando la salida va a un diff o a un grep. Dentro de un build de JavaScript o Python, recorre el árbol de tokens que ya analizas —`strip-markdown` para remark, `md.parse()` para markdown-it— porque cada elemento necesita una decisión y esas decisiones deberían quedar visibles en tu código. Renderizar a HTML y luego aplanarlo con `lynx -dump` o el paquete `html-to-text` es la otra vía honesta, y la única que trata bien el HTML en crudo.

Markdown está pensado para leerse como texto, que es justo por lo que la gente subestima esta conversión. El archivo ya parece prosa. Quita unos asteriscos, elimina las almohadillas, y ya es texto plano — esa es la intuición, y sobrevive al contacto con unos cuatro archivos.

Entonces te topas con uno con un bloque de Python delimitado lleno de `*args`, una tabla cuyos números solo significan algo junto a sus cabeceras de columna, un conjunto de enlaces de referencia definidos al final, y un elemento `<details>` envolviendo media página de contenido. Ahora cada asterisco que quitas es una decisión. Algunos son formato. Algunos son código de alguien. Uno está escapado, y significa un asterisco literal en la página.

La pregunta real no es cómo borrar las marcas. Es qué haces con la información que esas marcas llevaban. Un título es un título por su tamaño; en un archivo `.txt` no hay tamaño. Un elemento de lista es un elemento por su viñeta; quita la viñeta y tres elementos se juntan en una sola frase que dice algo que nadie escribió. Ese es el trabajo: no borrar, sino un conjunto de decisiones sobre qué lleva la estructura una vez que no queda ninguna marca que la lleve.

## Comparativa rápida: la chuleta

| Vía | Mejor para | Qué necesita | Qué pasa con las tablas | Licencia y precio |
| --- | --- | --- | --- | --- |
| `pandoc -t plain` | Un documento entero, con fidelidad | Una instalación de Pandoc | Se conserva como tabla de texto, rellenada con espacios | Gratis, GPL |
| `pandoc -t plain --wrap=none` | Comparar prosa, hacer grep, un párrafo por línea | Lo mismo | Lo mismo | Gratis, GPL |
| remark + `strip-markdown` | Un paso en un build de Node | Node, tres paquetes | Eliminada por completo por defecto | Gratis, MIT |
| `mdast-util-to-string` | Una cadena para un campo de índice de búsqueda | Node, un analizador de Markdown | Texto de las celdas concatenado sin separador | Gratis, MIT |
| tokens de markdown-it | Ya renderizas con markdown-it | Node | Lo que escribas, token a token | Gratis, MIT |
| tokens de markdown-it-py | Lo mismo, en Python | Python | Lo que escribas | Gratis, MIT |
| `remove-markdown` | Una línea de vista previa o un fragmento | Node, un paquete pequeño | Barras verticales sueltas en casos límite | Gratis, MIT |
| Renderizar a HTML, luego `lynx -dump` | Leer un documento en una terminal | Lynx instalado | Dibujada como tabla de texto a `-width` columnas | Gratis, GPL |
| Renderizar a HTML, luego `w3m -dump` | Lo mismo, otro renderizador | w3m instalado | Dibujada como tabla de texto a `-cols` columnas | Gratis, código abierto |
| `html-to-text` (npm) | La parte de texto de un correo | Node | Un formateador por selector, `dataTable` para tablas reales | Gratis, MIT |
| BeautifulSoup `get_text()` | Una extracción rápida en Python | Python, bs4 | Aplanado, los límites se pierden sin separador | Gratis, MIT |
| `html2text` (Python) | En realidad querías Markdown | Python | Tablas de barras de Markdown — emite Markdown | Gratis, GPLv3 |
| La descarga de texto de un conversor en el navegador | Un archivo, ahora, sin instalar | Un navegador | La decisión del conversor, no la tuya | Gratis |
| `sed`, `awk`, una expresión regular que escribiste | Nada que quieras conservar | Nada | Destruido en silencio | Gratis |

Licencias y opciones documentadas en pandoc.org, github.com y linux.die.net (comprobado el 8 de septiembre de 2026).

## Quitar la marca es un conjunto de decisiones, no un borrado

Antes de cualquier herramienta, la lista de decisiones. Cada una tiene una respuesta defendible y una respuesta equivocada para tu caso, y un conversor que no te deja ver sus elecciones las ha tomado igualmente.

| Elemento | Qué llevaba la marca | Qué puede hacer el texto plano al respecto |
| --- | --- | --- |
| Título | Rango, y un corte visual | Una línea propia con líneas en blanco alrededor, mayúsculas, o un subrayado de guiones |
| Elemento de lista | «Este es uno de varios» | Conservar un marcador `- `, o perder el límite entre elementos |
| Elemento numerado | Un número que es contenido | Conservar el número; se menciona en otro sitio |
| Enlace | Texto más un destino | Solo texto, texto con la URL en línea, o una lista numerada de referencias |
| Imagen | Texto alternativo y un archivo | El texto alternativo, o nada |
| Tabla | Asociación de fila y columna | Columnas rellenadas, una línea por fila, o un bloque de un campo por línea |
| Bloque de código | «No toques nada de esto» | Verbatim, nunca envuelto, nunca despojado |
| Cita | Otro lo dijo | Conservar `> ` o una sangría; quítalo y se vuelve tu propia frase |
| Énfasis | Tono, o un término definido | Nada, o mayúsculas, o guiones bajos de vuelta |
| Nota al pie | Un marcador y una nota en otro sitio | Un marcador `[1]` y una lista al final |

### Títulos

Un título en texto plano no tiene rango disponible. Las respuestas habituales son: ponerlo en su propia línea con una línea en blanco arriba y abajo y dejar que la posición haga el trabajo; escribirlo en mayúsculas; o subrayarlo con guiones. Fíjate en que la tercera respuesta ha reintroducido marca en silencio — una línea de texto con `---` debajo es un título de estilo setext, Markdown válido, y tu archivo `.txt` vuelve a convertirse en un documento.

La posición sola es la opción más segura y la más débil. Un documento con seis niveles de anidación se aplana en un flujo donde un H2 y un H4 se ven idénticos, y un lector cuatro pantallas más abajo no puede saber en qué sección está. Si la jerarquía es el contenido —una especificación, un contrato, un manual de procedimiento— numera los títulos antes de aplanar, porque los números sobreviven donde los tamaños no.

### Listas

Conserva la viñeta. Esto sorprende a quien quiere «nada de marca en absoluto», pero `- ` y `* ` fueron convenciones de lista en texto plano en el correo electrónico mucho antes de que existiera Markdown, y se leen como listas para una persona y para casi cualquier tokenizador. Quítalas y los elementos consecutivos se concatenan: tres elementos que dicen «revisa el disco», «reinicia el servicio», «abre un ticket» se vuelven una línea que se lee como una sola instrucción.

Las listas numeradas son más estrictas. El número es contenido, no decoración, porque algo más en el documento dice «si el paso 3 falla». Un conversor que renumera, o que cambia números por viñetas, ha cambiado el documento. El anidamiento también necesita conservar su sangría, lo que te cuesta columnas del margen derecho — y si además estás ajustando a 72 caracteres, la sangría tiene que salir de ese presupuesto. La [distinción entre lista suelta y compacta](/blog/markdown-line-breaks-and-lists) decide si los elementos llevan líneas en blanco entre ellos, y merece la pena fijarla a propósito en vez de heredarla.

### Enlaces

Tres opciones, ninguna cuarta. Quitar la URL y conservar el texto, que es breve y deja al lector sin poder seguir nada. Conservar ambos en línea como «la guía de despliegue (https://ejemplo.com/docs/deploy)», que es completo y convierte cualquier frase con una URL de seguimiento en un lío. O reunirlos como referencias numeradas al final, que es lo que hace Lynx por defecto y lo que su parámetro `-nolist` desactiva.

Elige según quién consume el texto. Para un correo que lee una persona, la lista de referencias al final es la versión educada. Para un índice de búsqueda, quita las URLs por completo — indexar `utm_source=newsletter` no le sirve a nadie, y los tokens que añade compiten con las palabras que importan. Para un recuento de palabras, quítalas, o tu recuento incluye una URL de 120 caracteres como una sola palabra y una acortada como cinco.

### Tablas

Esta es la decisión que no se puede posponer y la que más herramientas resuelven mal para tu caso. Las columnas rellenadas se ven bien, y solo con una tipografía monoespaciada a un ancho no menor que la fila más larga; reenviada a un cliente de correo con una tipografía proporcional, la alineación se colapsa y los números se desordenan. Una línea por fila con un separador sobrevive a cualquier ancho y pierde la asociación con la cabecera después de que la primera fila se desplace fuera de vista. Un bloque de un campo por línea —`Región: EMEA`, `Coste: 40`, una línea en blanco entre registros— es detallado, se lee correctamente a cualquier ancho, y es la única versión que tiene sentido leída en voz alta.

Cualquiera que elijas, comprueba qué hizo tu herramienta antes de confiar en ella, porque [las tablas son lo primero que se rompe en cualquier conversión](/blog/markdown-tables-that-survive-conversion) y el fallo se ve como un éxito. Y recuerda que las tablas de barras no están en la especificación de CommonMark en absoluto — llegaron con [GitHub Flavored Markdown y los otros dialectos](/blog/commonmark-gfm-and-the-flavours)— así que un analizador que corre CommonMark estricto nunca vio una tabla en primer lugar. Vio un párrafo lleno de barras verticales, y te va a entregar exactamente eso.

### Código, citas y el resto

Los bloques de código salen verbatim o salen mal. Sin envolver — un comando de shell envuelto es un comando de shell roto. Sin despojar nada dentro de ellos, nunca, por razones que la próxima sección cubre con detalle. Para algunos destinos la respuesta correcta es quitar el código por completo: una muestra de código de 400 tokens en una página de 600 palabras dominará un índice de búsqueda y hará que la página coincida con consultas sobre las que no tiene nada que decir. [Qué es en realidad un bloque delimitado](/blog/code-blocks-in-markdown) importa aquí, porque hay más formas de escribir uno de las que la mayoría de los despojadores conocen.

Las citas necesitan conservar su `> ` o una sangría. Quitar el marcador convierte una cita en tu propia afirmación, lo que es un cambio de significado y no de formato. Las imágenes se reducen a su texto alternativo o a nada, y si el texto alternativo está vacío —imagen decorativa, marcada correctamente— la salida honesta es nada en absoluto.

## Por qué la expresión regular que ibas a escribir está mal

El patrón es siempre el mismo. Alguien escribe seis sustituciones, las prueba en un README, las publica, y once meses después falta una fila en la factura de un cliente. Las expresiones regulares no pueden analizar Markdown porque Markdown depende del contexto: lo que significa un carácter depende de en qué bloque está, y un patrón no tiene idea de en qué bloque está.

Aquí están los cinco casos que la rompen, en el orden en que te van a morder.

### Código delimitado

Un fence no es un párrafo, y nada dentro de él es marca. El `*args` y `**kwargs` de Python, el `#include` de C, un glob de shell `*.log`, un diff cuyas líneas empiezan con `-`, un identificador snake_case lleno de guiones bajos, una tubería de shell hecha de caracteres `|` — un despojador que elimina marcadores de énfasis globalmente corrompe cada uno de ellos. Esto es peor que dejar la marca dentro, porque la salida sigue afirmando ser código y ahora está mal. Nadie se da cuenta hasta que lo ejecuta.

El propio fence es más variado de lo que espera el patrón ingenuo:

```text
~~~js
const total = a | b;
~~~
```

CommonMark permite tres o más comillas invertidas o tres o más virgulillas, una cadena de información después de la línea de apertura, y hasta tres espacios de sangría antes de él. Un fence puede contener tandas más cortas de su propio carácter sin cerrarse. Dentro de un elemento de lista se sangra hasta la columna de contenido del elemento. Y aparte de todo eso, cuatro espacios de sangría inicial son ya un bloque de código, sin ningún fence en ninguna parte. Una expresión regular ajustada a triples comillas invertidas al principio de una línea se pierde los fences de virgulilla, los fences con sangría y los bloques de código con sangría — tres formas de filtrar el manejo de marca dentro del código fuente de alguien.

### Caracteres escapados

En CommonMark, una barra invertida antes de un carácter de puntuación ASCII lo hace literal. `\*no es énfasis\*` es prosa sobre asteriscos. Un despojador que elimina las barras invertidas deja `*no es énfasis*`, que la siguiente herramienta de la cadena leerá como énfasis. Un despojador que elimina asteriscos deja `\no es énfasis\`. Los dos están mal, en direcciones opuestas, y ningún error se ve en un diff de la salida a menos que lo estés buscando.

Las entidades HTML son el mismo problema con otro disfraz. Un analizador decodifica `&amp;` a `&`, `&copy;` al símbolo de copyright y `&#42;` a un asterisco. Una expresión regular deja el texto de la entidad ahí en tu archivo de texto plano, así que el lector recibe `Smith &amp; Sons` en el cuerpo de un correo, y el recuento de palabras cuenta `&amp;` como una palabra. `\\` —una barra invertida escapada— es el caso que atrapa al arreglo listo, porque ahora necesitas saber si la barra invertida que estás mirando estaba a su vez escapada por la de antes.

### Tablas

Una fila de barras solo es una tabla si está presente la fila delimitadora. Sin `| --- | --- |` bajo la cabecera, es un párrafo. Con ella, las barras son estructura. Un patrón que borra caracteres `|` en cuanto los ve destruye ambos casos: el párrafo pierde su puntuación, y la tabla se vuelve una tirada de palabras sin límites. «EMEA 40 3 semanas» fue en su día cuatro celdas con cabeceras, y no hay forma de recuperar qué número era cuál.

Las celdas lo complican más. Una barra dentro de una celda se escapa como `\|`. Una barra dentro de código en línea no es un delimitador en absoluto. Los dos puntos de alineación —`:---`, `---:`, `:---:`— son estructura que no lleva palabras y tiene que desaparecer. Y las celdas contienen su propia marca en línea, así que lo que decidiste sobre enlaces y énfasis se aplica también dentro de cada celda.

### Enlaces de referencia

Cualquier expresión regular maneja `[texto](url)`. Markdown tiene otras cuatro formas de enlace y son todas comunes en archivos escritos por gente que los edita a mano:

```text
Consulta la [guía de despliegue][deploy] y el [manual].

[deploy]: https://ejemplo.com/docs/deploy "Despliegue"
[manual]: https://ejemplo.com/docs/manual
```

La forma de referencia completa `[texto][id]`, la forma colapsada `[texto][]` y la forma abreviada `[texto]` apuntan todas a una definición que puede estar a cientos de líneas de distancia, normalmente al final del archivo. Un patrón que solo conoce enlaces en línea deja los corchetes en la prosa y deja el bloque de definiciones como un párrafo final de URLs desnudas — que es exactamente la forma de salida que se ve bien en una revisión rápida y está obviamente rota para quien la recibe. Añade los autoenlaces con ángulos `<https://ejemplo.com>`, el autoenlazado de URLs desnudas de GFM, y la sintaxis de imagen que el patrón ingenuo convierte en `!texto alternativo`, y el número de formas a manejar no es cinco, es más cerca de una docena.

### Bloques de HTML

Markdown permite HTML en crudo, así que un archivo `.md` puede contener cualquier cosa que HTML pueda. En la práctica contiene `<details>` y `<summary>` alrededor de secciones plegables, `<img>` con un atributo de ancho, `<br>` para saltos de línea que la sintaxis no dará, `<sub>` y `<sup>`, tablas `<table>` enteras escritas a mano, y `<!-- comentarios -->` que nunca estaban pensados para publicarse.

Despojar etiquetas con un patrón falla en todo esto. `<!-- TODO: revisar estos números con legal -->` es un comentario cuyo texto una expresión regular promoverá alegremente a prosa, en un documento que estás a punto de enviar a alguien. Un elemento `<script>` es peor: despoja las etiquetas y el cuerpo de JavaScript se vuelve un párrafo. Los valores de atributo se filtran igual — un despojador que elimina tramos de `<` a `>` todavía tiene que decidir si el texto de un atributo `alt` es contenido, y un patrón no puede distinguir un atributo de un nodo de texto. Cualquier cosa que implique HTML en crudo en un archivo que no escribiste tú mismo pertenece a un analizador HTML de verdad, que es uno de los argumentos más fuertes para la vía de renderizar y luego aplanar de más abajo.

Hay un uso honesto para un despojador basado en expresiones regulares: una línea de vista previa. Si necesitas los primeros 140 caracteres de un documento para una tarjeta o un resultado de búsqueda, un asterisco equivocado es cosmético y el fallo es visible. En cualquier sitio donde el texto tenga que ser correcto, usa un analizador.

## Dónde el texto plano es de verdad la salida correcta

El texto plano no es una versión inferior del HTML. Para varios trabajos es el formato que el sistema receptor de verdad acepta, y entregarle Markdown a esos sistemas en su lugar es el error.

**Correo en texto plano.** Un correo HTML bien formado es un mensaje `multipart/alternative` cuyas partes están ordenadas de menos fiel a más fiel (RFC 2046), lo que significa que la parte `text/plain` va antes que la de HTML. Si construyes esa parte pegando la fuente Markdown, tu destinatario lee `**Importante**` y `[la factura](https://…)` con la puntuación visible. La RFC 5322 recomienda líneas de no más de 78 caracteres, así que ajusta a 72 y deja sitio para los marcadores de cita `> ` que añadirá una respuesta; si quieres que el cliente reajuste los párrafos por sí mismo, para eso está `format=flowed` (RFC 3676).

**Recuentos de palabras.** `wc -w` sobre un archivo `.md` en crudo cuenta las barras de tabla, las líneas de fence, las definiciones de referencia y cada URL como palabras. Un archivo que reporta 900 palabras puede ser 700 palabras de prosa y 200 palabras de sintaxis y código. `pandoc -t plain archivo.md | wc -w` da el número con el que una persona estaría de acuerdo, y quitar los bloques de código antes de contar lo cambia otra vez — por lo que un recuento de palabras solo tiene sentido junto con los parámetros que lo produjeron.

**Indexación de búsqueda.** Tokenizar Markdown en crudo mete `**`, `](` y `https` en tu índice, hace coincidir consultas dentro de muestras de código, y produce fragmentos con la sintaxis visible para el usuario. Las herramientas de búsqueda de sitios estáticos evitan esto indexando el HTML construido en vez de la fuente, que es la misma idea desde el otro extremo: indexa lo que ve el lector. Si construyes el índice tú mismo, aplana primero, y decide explícitamente si los bloques de código son contenido buscable o ruido.

**Voz y lectura en voz alta.** Un motor de texto a voz recibe una cadena. Dale Markdown y obtienes la puntuación leída en voz alta, o marcadores pegados en silencio a las palabras de alrededor. Merece la pena ser preciso aquí, no obstante: en la web, el HTML semántico gana siempre a texto aplanado — un lector de pantalla quiere títulos, listas y celdas de tabla reales como elementos, y despojarlos a texto elimina la navegación de la que depende el lector. El caso del texto plano es para cadenas que aceptan una string, no para páginas que abre una persona.

**Salida de terminal.** Un mensaje de commit, un texto de `--help`, una línea de log de CI, el cuerpo de una notificación. Ninguno de ellos renderiza marca, y a todos les pegan Markdown de todas formas. Fíjate en que `glow` y `mdcat` hacen el trabajo contrario — renderizan Markdown para una terminal usando secuencias ANSI y dibujo de cajas— lo cual es precioso de leer y no es un archivo `.txt`.

**Comparar prosa.** Este es el caso al que la gente llega último y valora más. Cuando dos versiones de un documento difieren solo porque alguien reajustó los párrafos, un diff de líneas reporta el párrafo entero como cambiado y no dice nada. Convierte las dos versiones con `--wrap=none` para que un párrafo sea una línea, y luego compáralas con `git diff --word-diff`, y lo que ves son las palabras que cambiaron. El mismo truco hace que un `.docx` convertido sea comparable contra el Markdown que se supone que debía coincidir con él.

## Las herramientas, una a una

### Pandoc — el camino correcto más corto

Pandoc tiene `plain` como formato de salida, así que todo el trabajo es un comando:

```bash
pandoc -t plain notas.md -o notas.txt
```

| A favor | En contra |
| --- | --- |
| Un analizador de verdad, así que cada caso de la sección anterior está manejado | Un binario de Haskell que instalar |
| El ajuste, las columnas y el manejo de comentarios son parámetros, no código | Las decisiones de su escritor de texto plano son propias, y solo parcialmente configurables |
| Las tablas sobreviven como tablas de texto en vez de desaparecer | Las tablas rellenadas necesitan una tipografía monoespaciada para leerse bien |
| Lee muchos formatos de entrada, así que el mismo comando sirve para `.docx` y HTML | Las diferencias de dialecto de Markdown significan que deberías nombrar el lector |

**Precio:** gratis, con licencia GPL.

**Detalles técnicos y funciones**

- `--wrap=auto` es el valor por defecto y ajusta a `--columns`, que por defecto es 72; `--wrap=none` pone cada párrafo en una línea, y `--wrap=preserve` conserva los propios saltos de línea de la fuente (comprobado en pandoc.org, el 8 de septiembre de 2026)
- `--strip-comments` elimina los comentarios HTML de la fuente en vez de dejarlos pasar
- Los enlaces salen como su etiqueta con la URL descartada; las imágenes salen como su texto alternativo entre corchetes; el código en línea sale como la cadena desnuda; las notas al pie se convierten en marcadores estilo `[1]` con una lista al final (comprobado en el código fuente del escritor en github.com, el 8 de septiembre de 2026)
- El énfasis y el texto en negrita salen como texto llano, salvo que actives la extensión `gutenberg`, que trae de vuelta `_guiones bajos_` para el énfasis y pone el texto en negrita en mayúsculas (comprobado en github.com, el 8 de septiembre de 2026)
- Nombra el lector cuando la entrada es GitHub Flavored —`-f gfm`— para que las listas de tareas y los autoenlaces se lean como se escribieron

**¿Quién debería usarlo?** Cualquiera que convierta documentos enteros y pueda instalar un binario. Es la respuesta por defecto, y la única razón para no elegirla es que necesitas que las decisiones vivan en tu propio código.

### remark y `strip-markdown` — un paso en un build de Node

La cadena unified analiza Markdown a un árbol mdast, y `strip-markdown` es el plugin que lo aplana: analizar, despojar, convertir a texto.

| A favor | En contra |
| --- | --- |
| Un árbol de verdad, así que nada depende de coincidencia de patrones | Tres paquetes y una cadena ESM que montar |
| Las opciones `keep` y `remove` hacen las decisiones explícitas | Los valores por defecto borran más de lo que la gente espera |
| Encaja dentro de un build que ya tienes | Más lento que un solo binario para un archivo |

**Precio:** gratis, con licencia MIT.

**Detalles técnicos y funciones**

- Su propia descripción es que elimina todo salvo párrafos y texto
- Por defecto elimina bloques de código, HTML, separadores temáticos, tablas y frontmatter YAML o TOML, y conserva el texto alternativo de las imágenes (comprobado en github.com, el 8 de septiembre de 2026)
- `keep` acepta una lista de tipos de nodo que dejar sin tocar; `remove` acepta tipos de nodo que eliminar o sustituir con un manejador
- Como corre antes que `remark-stringify`, «conservar» una tabla significa que el convertidor a texto la vuelve a escribir como tabla de Markdown — conservar los datos y eliminar la marca son dos peticiones distintas, y el punto medio necesita un manejador que tú escribas

**¿Quién debería usarlo?** Proyectos de JavaScript que ya analizan Markdown con remark, y quien quiera que las decisiones elemento por elemento queden escritas en configuración en vez de inferidas a partir de la salida.

### `mdast-util-to-string` — una cadena, para máquinas

A veces quieres una sola cadena para un campo de índice de búsqueda o un extracto, y la estructura no importa. Este utilitario obtiene el contenido de texto de un nodo, preferiendo campos de texto plano y si no serializando sus hijos.

| A favor | En contra |
| --- | --- |
| Una llamada, una cadena | Los hijos se unen con un separador vacío |
| Texto alternativo de imagen opcional vía `includeImageAlt` | Los límites de bloque desaparecen por completo |
| Diminuto, y ya está en el árbol si usas remark | No es para nada que lea una persona |

**Precio:** gratis, con licencia MIT.

El separador vacío es lo que hay que saber. Como la llamada de unión usa `''`, un título se pega directamente al párrafo que le sigue: «Precios» más «Cobramos por asiento» se vuelve `PreciosCobramos por asiento`. Para un campo de índice esto suele ser inofensivo, ya que el tokenizador divide por el límite de todas formas — pero para un fragmento que ve un usuario, o un recuento de palabras, produce un despropósito. El arreglo es recorrer el árbol tú mismo y unir los nodos de nivel de bloque con una línea en blanco.

**¿Quién debería usarlo?** Quien esté rellenando un campo que lee una máquina, y haya comprobado que la concatenación no importa.

### markdown-it y markdown-it-py — recorriendo el flujo de tokens

Si tu aplicación ya renderiza Markdown con markdown-it, ya tienes el analizador léxico. `md.parse(fuente, {})` devuelve un array plano de tokens con tipos como `heading_open`, `inline`, `fence` y `table_open`, y emites texto para los tipos que quieras.

| A favor | En contra |
| --- | --- |
| Cada decisión es una rama de un switch que puedes leer | Ahora eres dueño de cada decisión, incluidas las que olvides |
| Sin una segunda dependencia, ni un segundo analizador en desacuerdo con el primero | Más código que un parámetro |
| El mismo modelo de tokens existe en Python como markdown-it-py | La maquetación de tablas es enteramente tuya de calcular |

**Precio:** gratis, con licencia MIT.

**¿Quién debería usarlo?** Aplicaciones cuya salida tiene que coincidir con un formato propio de la casa —una plantilla de correo concreta, un informe de ancho fijo, una línea de log— y equipos que preferirían mantener cincuenta líneas de decisiones explícitas antes que discutir con los valores por defecto de un conversor.

### `remove-markdown` — la expresión regular honesta

Un paquete pequeño, basado en expresiones regulares, que despoja el formato de Markdown de una cadena. Es lo que se ve una versión cuidadosa del patrón que ibas a escribir tú, y falla en los mismos casos por las mismas razones.

**Precio:** gratis, con licencia MIT.

**¿Quién debería usarlo?** Nadie, para un documento. Es una opción razonable para una línea de vista previa, el subtítulo de una tarjeta o el cuerpo de una notificación, donde el texto es corto, la fuente es tuya, y un carácter perdido es cosmético.

### Renderizar a HTML, y luego aplanarlo

Dos saltos en vez de uno: Markdown a HTML con un analizador de Markdown de verdad, y luego HTML a texto con un consumidor de HTML de verdad. Suena derrochador y resuelve dos problemas a la vez. La cuestión del dialecto la responde el analizador de Markdown, y el HTML en crudo de la fuente lo maneja una herramienta cuyo único trabajo es HTML — algo que ningún despojador a nivel de Markdown puede reclamar.

| Herramienta | Qué es | Comportamiento notable |
| --- | --- | --- |
| `lynx -dump` | Un navegador de texto, que vuelca la salida formateada a stdout | Ajusta a `-width`, 80 por defecto; añade una lista de enlaces salvo que pases `-nolist`; `-stdin` lee de una tubería en UNIX |
| `w3m -dump` | Otro navegador de texto | `-cols` fija el ancho; dibuja tablas |
| `html-to-text` (npm) | Una biblioteca construida para esto | `wordwrap`, `selectors` y `formatters` por selector CSS, `preserveNewlines`, `ignoreHref`, `hideLinkHrefIfSameAsText`, `dataTable` |
| BeautifulSoup `get_text()` | El accesor de texto de un analizador HTML de Python | Concatena cadenas; pasa un separador o pierde los límites |

**Precio:** Lynx es gratis con licencia GPL; `html-to-text` es gratis con licencia MIT; BeautifulSoup es gratis con licencia MIT. Opciones citadas de linux.die.net y github.com (comprobado el 8 de septiembre de 2026).

La vía de la biblioteca es la que conviene elegir para correo, porque `html-to-text` expone sus decisiones de formato por selector: tú dices qué hace un elemento `a`, qué hace una `table`, y dónde cae el ajuste, y las respuestas viven en tu configuración en vez de en las convenciones de renderizado de un navegador. La vía del navegador es la que conviene elegir para leer, porque un navegador de texto lleva treinta años decidiendo cómo se ve un documento en 80 columnas y se le da mejor que a ti esta tarde.

Los dos saltos cuestan algo. Estás manteniendo dos conversiones en vez de una, y la etapa de HTML trae sus propias convenciones — Lynx numera tus enlaces y añade una lista de referencias, w3m maqueta las tablas a su manera. Ninguna está mal; las dos son sorpresas si no las esperabas.

### `html2text` — el nombre que confunde

Merece la pena nombrarlo con precisión, porque es el primer resultado de búsqueda y la herramienta equivocada para este trabajo. El `html2text` de Python se describe a sí mismo como un conversor de HTML a texto ASCII limpio y fácil de leer que además resulta ser Markdown válido. Ese es el punto: la salida es Markdown. `--ignore-links` y `--reference-links` cambian cuánto de eso hay, y `--mark-code` envuelve el código en sus propias marcas, pero estás convirtiendo [HTML a Markdown](/blog/convert-html-to-markdown), que es un trabajo distinto con un conjunto de herramientas distinto. Es gratis y tiene licencia GPLv3.

**¿Quién debería usarlo?** Cualquiera que quisiera Markdown. Quien quisiera texto debería mirar la fila de arriba.

### Un conversor en el navegador, cuando la instalación es el problema

TransformPipe convierte un archivo Markdown en el navegador y ofrece el resultado como descarga de texto plano junto a HTML y Markdown, sin que se suba nada mientras no has iniciado sesión y con un límite de 10 MB por conversión. Las decisiones sobre títulos, enlaces y tablas son de la herramienta y no tuyas, que es el trato: sin instalar, sin parámetros, y sin control.

**Precio:** gratis.

**¿Quién debería usarlo?** Alguien con un archivo y ningún deseo de instalar una cadena de herramientas de Haskell para aplanarlo — un documento para pegar en un ticket, un cuerpo de correo, una nota.

## Dónde falla quitar la sintaxis, y qué cuesta

Cada vía de arriba es un compromiso, y merece la pena decir sin rodeos cuáles son inevitables.

**La estructura no tiene dónde vivir.** El texto plano tiene un solo canal —la secuencia de caracteres— y tiene que llevar las palabras, la jerarquía, el énfasis y las relaciones tabulares todo a la vez. Una lista de treinta elementos en tres niveles de anidación se aplana en un muro que un lector no puede navegar. Numerar los títulos ayuda y no es gratis: has añadido texto que no estaba en el documento.

**Las tablas pierden la asociación, no los datos.** Cada valor sobrevive; lo que desaparece es a qué columna pertenecía. Rellenar lo conserva, al coste de exigir una tipografía monoespaciada y una ventana al menos tan ancha como la fila más larga, y no hay forma de garantizar ninguna de las dos en un cliente de correo. Un campo por línea lo conserva y triplica la longitud. Elige de antemano, porque el modo de fallo de elegir tarde es una tabla que se veía bien en tu terminal y llegó como números revueltos.

**Los enlaces no pueden ser cortos y completos a la vez.** Las URLs en línea destrozan la línea; las URLs descartadas quitan el destino; una lista de referencias al final le pide al lector que vaya a mirar. No hay ninguna opción que evite los tres costes, así que elige el que le convenga al lector que de verdad tienes.

**El énfasis a veces es significado.** Un término en negrita la primera vez porque se está definiendo, un aviso en negrita en un manual de procedimiento, una negación en cursiva — aplanar elimina la única señal de que esas palabras se diferencian de las de alrededor. Las mayúsculas son el sustituto habitual y se leen como gritos. En un documento donde el énfasis lleva obligación, eso es un cambio al documento.

**No hay vuelta atrás.** El texto de salida no es el Markdown de entrada. Una vez que el árbol se ha ido no puedes reconstruir los títulos, y cualquier cosa más adelante que quiera estructura tendrá que adivinar. Conserva el `.md` como fuente de verdad y trata el `.txt` como un artefacto, que se regenera en vez de editarse.

**El número se mueve con los parámetros.** Los recuentos de palabras, de caracteres y los tiempos de lectura dependen todos de si se quitaron los bloques de código, si se conservaron las URLs y si se contaron los títulos. Un recuento solo es comparable con otro recuento producido por el mismo comando, lo cual importa en el momento en que alguien escribe un límite de palabras en un acuerdo.

Y el más grande de todos: si la razón por la que quieres texto plano es que la marca molesta, comprueba si la respuesta es HTML en su lugar. Un documento renderizado conserva los títulos, las listas y las celdas de tabla, se abre en todas partes, y no te exige ninguna decisión sobre qué lleva la estructura. El texto plano es la salida correcta cuando algo más adelante toma una cadena. Es la salida equivocada cuando el lector es una persona con un navegador.

## Cómo elegir

1. **Nombra al consumidor antes de la herramienta.** Una persona en un cliente de correo, un tokenizador, un diff, un motor de voz y una terminal quieren cada uno un conjunto distinto de decisiones, y un conversor ajustado para uno produce una salida ligeramente equivocada en todos los demás.
2. **Resuelve primero la cuestión de las tablas.** Es la única decisión que no se puede posponer: las columnas rellenadas te comprometen a una tipografía monoespaciada y un ancho mínimo, y un campo por línea te compromete a tres veces el espacio vertical. Decidirlo después de publicar significa volver a decidir delante de un cliente.
3. **Usa un analizador, no un patrón.** Cualquier archivo con un fence, un escape, un enlace de referencia o un bloque de HTML en crudo va a romper una expresión regular, y la rompe en silencio — obtienes un texto que se lee bien y le falta una fila, que es el tipo de error más caro.
4. **Fija el ancho de ajuste una vez, en el límite.** `--wrap=none` para diffs y greps, 72 columnas para correo, el propio ancho de la terminal para una CLI. Ajustar dos veces —una en el conversor y otra en el cliente— es como un documento termina con líneas de tres palabras.
5. **Pruébalo con tu archivo más feo.** El que tiene la lista anidada, el bloque `<details>`, la tabla con una barra escapada en una celda y los enlaces de referencia definidos al final. Ese archivo decide si una herramienta funciona; un README limpio no decide nada.

## Conclusión

Markdown a texto es una conversión pequeña con una lista larga de decisiones de juicio, y las herramientas se dividen limpiamente por una línea: los analizadores lo hacen bien y los patrones lo hacen mal en silencio. Recurre a `pandoc -t plain` cuando quieras el documento entero y puedas instalar un binario, recorre el flujo de tokens cuando las decisiones tengan que vivir en tu código y coincidir con un formato que alguien más especificó, y renderiza a HTML antes de aplanar cuando la fuente contenga HTML en crudo que no escribiste tú. Cuando el trabajo es un archivo y la instalación es el obstáculo, [un conversor en el navegador](/) te dará una descarga de texto sin subir nada. Sea cual sea la vía que elijas, conserva el Markdown como fuente y trata el texto como salida — y pasa tu peor archivo por él antes de confiar en los buenos.

## Preguntas frecuentes

### ¿Cómo convierto Markdown a texto plano en la línea de comandos?

`pandoc -t plain entrada.md -o salida.txt` es la respuesta correcta más corta, y ajusta a 72 columnas por defecto. Añade `--wrap=none` si la salida va a un diff o a un grep, y `--strip-comments` si la fuente contiene comentarios HTML que no quieres promovidos a prosa.

### ¿Puedo simplemente usar una expresión regular para quitar Markdown?

Solo donde un error es cosmético, como una línea de vista previa o el subtítulo de una tarjeta. El código delimitado, los escapes con barra invertida, las tablas, los enlaces de referencia y los bloques de HTML en crudo rompen cada uno la coincidencia de patrones de una forma distinta, y la salida se ve plausible mientras está mal, que es por lo que el error suele encontrarlo un lector en vez de una prueba.

### ¿Por qué mi texto despojado todavía contiene corchetes o URLs sueltas?

Casi siempre son enlaces de referencia. Las formas `[texto][id]` y `[texto]` apuntan a definiciones que suelen estar al final del archivo, así que un despojador que solo maneja `[texto](url)` deja los corchetes en la prosa y las definiciones como un bloque final de URLs. Un analizador resuelve la referencia y te da la etiqueta, el destino, o ambos, según lo que hayas pedido.

### ¿Un recuento de palabras de Markdown difiere de uno de texto plano?

Sí, y normalmente por más de lo que la gente espera. Contar el archivo en crudo incluye las barras de tabla, las líneas de fence, las definiciones de referencia y cada URL como palabras, así que un archivo que reporta 900 palabras puede ser 700 palabras de prosa. Aplana primero, decide si los bloques de código cuentan, y anota el comando junto al número.

### ¿Qué pasa con las tablas cuando el Markdown se vuelve texto plano?

Depende enteramente de la herramienta, y las tres respuestas son: conservarlas como tablas de texto rellenadas, que necesitan una tipografía monoespaciada; aplanar cada fila a una línea, lo que pierde la asociación con la cabecera; o eliminarlas, que es lo que hacen varios despojadores por defecto. Comprueba qué hizo el tuyo con una tabla real antes de confiar en él, porque cada uno de esos resultados se ve como un éxito en una revisión rápida.

### ¿`html2text` es una herramienta de Markdown a texto?

No, dos veces. Convierte HTML en vez de Markdown, y su salida es deliberadamente Markdown válido en vez de texto plano — su propia documentación lo dice. Si tienes HTML y quieres texto, `lynx -dump` o el paquete `html-to-text` son las herramientas; si tienes HTML y quieres Markdown, `html2text` es exactamente correcto.

### ¿El texto plano es más accesible que el HTML?

No para nada que abra una persona en un navegador. Un lector de pantalla usa la estructura HTML —títulos para navegar, listas para contar elementos, celdas de tabla para relacionar un valor con su columna— y aplanar el documento elimina todo eso. El texto plano es la salida correcta para una cadena que acepta un pipeline, como un sintetizador de voz o un índice de búsqueda, no un sustituto de la marca semántica.
