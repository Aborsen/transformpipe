---
title: "Caracteres de escape en Markdown: la referencia completa"
description: "Qué caracteres escapa una barra invertida, dónde escapar no hace nada, cuándo conviene mejor una referencia de carácter y qué casos reescriben tu texto en silencio"
updated: 2026-09-14
date: 2026-09-06
tag: Sintaxis
keywords: caracteres de escape markdown, escapar asterisco markdown, escapar guion bajo markdown, escapar barra vertical tabla markdown, referencias de caracteres html, caracteres especiales markdown, snake_case markdown, escapar backtick markdown, barra invertida markdown
---

Un asterisco que querías literal pone en cursiva media frase. Un año al principio de una línea se convierte en el elemento 1986 de una lista. Una ruta de Windows pierde una de sus barras invertidas por el camino hasta la página, y nadie lo nota hasta que alguien la copia en una terminal. Cada uno de estos casos es un carácter haciendo el trabajo que tiene documentado, en un sitio donde no estabas pensando en él.

### Resumen rápido

Una barra invertida escapa cualquiera de los **treinta y dos caracteres de puntuación ASCII**, y nada más — antes de una letra, un dígito, un espacio o un carácter que no sea ASCII es solo una barra invertida, impresa tal cual. Escapar **no hace absolutamente nada** dentro de un fragmento de código, un bloque de código con cercas o con sangría, un autoenlace o HTML crudo, que es la regla en la que termina casi todo problema de escape. Las **referencias de carácter** (`&amp;`, `&lt;`, `&#42;`, `&copy;`) son la otra vía, y la única que funciona donde una barra invertida está muerta o donde el carácter no es puntuación ASCII. La mayoría de los caracteres solo necesitan escaparse en una posición concreta — un almohadilla al principio de una línea, una barra vertical dentro de una celda de tabla — y un fragmento de código es la respuesta portable a todo esto, al precio de un texto en monoespaciado.

Las reglas vienen de un único lugar. CommonMark es la especificación que las fija, y la versión 0.31.2, del 28 de enero de 2024, es la vigente (comprobado en spec.commonmark.org, el 9 de septiembre de 2026). Dice dos frases sobre las barras invertidas que entre ambas decide cada caso de esta página: cualquier carácter de puntuación ASCII puede escaparse con una barra invertida, y las barras invertidas delante de otros caracteres se tratan como barras invertidas literales.

Lo que una especificación no puede arreglar es que escapar falla en las dos direcciones, y ninguno de los dos fallos avisa. Escapar de menos y el carácter se interpreta: tu prosa gana énfasis, un encabezado, una lista, un enlace. Escapar de más y la barra invertida desaparece de la salida igualmente — `\:` se renderiza como un simple dos puntos — así que el archivo se llena de barras invertidas que no hacen nada, y la siguiente persona que lo edite no puede saber cuáles importan. Ambos casos se ven bien en una vista previa que coincide con tu parser, y mal en cualquier otro sitio.

Hay una versión más corta de este material en [el artículo sobre saltos de línea y listas](/blog/markdown-line-breaks-and-lists), que cubre los caracteres que chocan con los marcadores de lista y las dos formas de romper una línea. Esta página es el resto: todo el conjunto escapable, los cuatro contextos donde una barra invertida está muerta, las referencias de carácter, lo que un conversor escapa por ti, y el puñado de casos reales — sintaxis de plantillas, rutas de Windows, signos de dólar, `snake_case` — que generan casi todas las quejas.

## Qué hace un escape con barra invertida, y los treinta y dos caracteres sobre los que actúa

Una barra invertida delante de un carácter de puntuación ASCII le quita a ese carácter su significado y se elimina a sí misma de la salida. El conjunto escapable es fijo, y son estos treinta y dos: ``!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~`` (comprobado en spec.commonmark.org, el 9 de septiembre de 2026). Eso es todo carácter ASCII imprimible que no es letra, ni dígito, ni espacio.

Todo lo demás es una barra invertida literal. `\q` se renderiza como `\q`, barra invertida incluida. Lo mismo pasa con `\3`, y con una barra invertida delante de una raya o de una comilla tipográfica, porque son puntuación pero no puntuación ASCII. Esta es la mitad de la regla que la gente olvida, y la razón de que una ruta de Windows normalmente sobreviva intacta y luego pierda exactamente un separador en un solo sitio.

Dos consecuencias vale la pena retener antes de la tabla. Primero, escapar es por carácter, no por región: no existe en Markdown una marca de «a partir de aquí, texto literal», así que `\*\*no en negrita\*\*` son cuatro barras invertidas para un solo efecto. Segundo, un escape está muerto pero no es invisible — desaparece de la página renderizada y se queda en el archivo, lo que significa que un Markdown sobreescapado se lee como ruido para una persona y se convierte de forma idéntica para una máquina.

| Carácter | Qué significa sin escapar | Dónde significa eso | Cómo escribirlo literal |
| :--- | :--- | :--- | :--- |
| `\` | El propio carácter de escape | En cualquier parte del texto | `\\` |
| `` ` `` | Abre un fragmento de código | En cualquier parte del texto en línea | ``\` ``, o envolver el fragmento en más backticks |
| `*` | Énfasis y énfasis fuerte; una viñeta; una línea horizontal | En cualquier parte en línea, incluso en medio de una palabra; al principio de línea | `\*` |
| `_` | Énfasis y énfasis fuerte; una línea horizontal | Solo en límites de palabra; al principio de línea | `\_` — un guion bajo en medio de una palabra no necesita nada |
| `#` | Un encabezado ATX; una secuencia de cierre de encabezado | Al principio de línea, dentro de tres espacios del margen; al final de un encabezado | `\#` |
| `>` | Una cita en bloque | Al principio de línea | `\>` |
| `-` | Una viñeta; un subrayado setext de `<h2>`; una línea horizontal; una valla de frontmatter | Al principio de línea | `\-` |
| `+` | Una viñeta | Al principio de línea | `\+` |
| `=` | Un subrayado setext de `<h1>` | Una línea justo debajo de un párrafo | `\=` |
| `.` | Un delimitador de lista ordenada, tras dígitos | Al principio de línea | `1986\.` |
| `)` | Un delimitador de lista ordenada, tras dígitos; el fin del destino de un enlace | Al principio de línea; dentro de `(…)` | `1986\)`, `\)` |
| `(` | El inicio del destino de un enlace | Dentro de un enlace | `\(` |
| `[` `]` | Un enlace, una imagen, una referencia o una etiqueta de nota; una marca de lista de tareas | En cualquier parte en línea | `\[` `\]` |
| `!` | Una imagen, cuando le sigue `[` | En cualquier parte en línea | `\!` |
| `<` | Un autoenlace, una etiqueta HTML cruda, o un bloque HTML | En cualquier parte en línea; al principio de línea | `\<`, o `&lt;` |
| `>` | El fin de un autoenlace o de una etiqueta HTML cruda | Dentro de `<…>`, donde una barra invertida está muerta | `&gt;` en prosa; codificación por porcentaje dentro de una URL |
| `&` | El inicio de una referencia de carácter | En cualquier parte en línea | `&amp;` |
| `\|` | Un límite de celda en una tabla GFM | Solo dentro de una fila de tabla — incluso dentro de un fragmento de código | `\|` |
| `~` | Tachado en GFM, en pares; una valla de código alternativa | En cualquier parte en línea; al principio de línea | `\~` |
| `"` `'` | Nada, salvo que la puntuación tipográfica esté activa; delimitan el título de un enlace | Dentro de `(… "…")` | `\"`, o `&quot;` |
| `$` | Nada en CommonMark ni en GFM; un delimitador matemático donde esa extensión esté activa | Solo con una extensión matemática | `\$`, o un fragmento de código |
| `{` `}` | Nada en CommonMark; bloques de atributos y sintaxis de plantillas en otras herramientas | Solo en esas herramientas | `\{` `\}`, o un bloque con cercas |
| `:` | Nada en CommonMark; definiciones de notas y códigos cortos de emoji en otros sitios | Solo en esas herramientas | `\:` |
| `%` `,` `/` `;` `?` `@` `^` | Nada, en ningún lugar, en ningún dialecto habitual | En ningún sitio | Escapable, nunca necesario |

La cuarta columna es donde está el trabajo. Seis de estos caracteres — `#`, `>`, `-`, `+`, `.` y `)` — solo tienen significado al principio de una línea, así que un almohadilla en medio de una frase es solo un almohadilla y un guion entre dos palabras es solo un guion. Escaparlos siempre es una costumbre heredada de herramientas que escapan por precaución, y te cuesta un archivo lleno de barras invertidas sin ningún cambio en la salida.

## Dónde escapar no hace absolutamente nada

Esta es la regla que produce más confusión, y es una única frase en la especificación: los escapes con barra invertida no funcionan en bloques de código, fragmentos de código, autoenlaces ni HTML crudo (comprobado en spec.commonmark.org, el 9 de septiembre de 2026). En los cuatro casos, una barra invertida es contenido. Se imprime.

El orden en que la gente descubre esto es siempre el mismo. Escapan un carácter, sigue saliendo mal, así que también lo envuelven en backticks — y ahora la barra invertida está en la página.

```markdown
a `\*` span
```

se renderiza como la palabra «a», luego un fragmento de código que dice `\*`, y luego la palabra «span» — la barra invertida visible en la página, porque dentro del fragmento perdió su poder y conservó su anchura. El arreglo es borrar el escape, no añadir otro.

**Fragmentos y bloques de código.** Todo lo que va entre backticks, o dentro de una valla, o con sangría de cuatro espacios, es texto literal. `\\` se queda como dos barras invertidas; `\_` se queda como una barra invertida y un guion bajo. Es una característica, y es la razón de que un fragmento de código sea el contenedor correcto para un patrón glob, una expresión regular, una cadena de formato `printf` o una ruta de Windows — mira [qué más interpretan y qué no los bloques con cercas](/blog/code-blocks-in-markdown) para la parte de la cadena de información.

**Autoenlaces.** Un autoenlace es una URL entre corchetes angulares, y su contenido es una URL, no Markdown. Escapa algo dentro de uno y la barra invertida pasa a formar parte de la dirección: `<https://example.com/a\_b>` produce un enlace cuyo `href` contiene `%5C`, la codificación por porcentaje de una barra invertida. El texto del enlace parece casi correcto y el destino está mal, que es la peor combinación posible.

**HTML crudo.** Dentro de una etiqueta, una barra invertida es una barra invertida. Intenta escapar unas comillas dentro de un atributo — `<div title="a\"b">` — y el atributo termina en las segundas comillas con una barra invertida suelta dentro, exactamente como pasaría en un navegador. Los atributos HTML se escapan con referencias de carácter, `&quot;`, nunca con barras invertidas.

**Bloques HTML.** Un bloque de HTML crudo se transmite entero, sin ningún análisis en línea dentro, así que nada en él necesita escaparse de entrada. Un asterisco dentro de un bloque HTML es un asterisco. Una barra invertida que añadas por precaución se imprimirá.

| Contexto | Qué hace ahí una barra invertida | Qué usar en su lugar |
| :--- | :--- | :--- |
| Fragmento de código, `` `…` `` | Se imprime, como contenido | Nada — el fragmento ya protege el texto |
| Bloque con cercas | Se imprime, como contenido | Nada |
| Bloque con sangría, cuatro espacios | Se imprime, como contenido | Nada |
| Autoenlace, `<…>` | Pasa a formar parte de la URL, codificada por porcentaje | Codificar el carácter por porcentaje correctamente |
| Etiqueta o atributo HTML crudo | Se imprime, y rompe el atributo | Una referencia de carácter: `&quot;`, `&amp;` |
| Bloque HTML | Se imprime | Nada — la sintaxis en línea no se analiza ahí |
| Destino de enlace, `(…)` | Funciona: `\(` y `\)` se respetan | Una barra invertida, o codificación por porcentaje |
| Título de enlace, `"…"` | Funciona: `\"` se respeta | Una barra invertida |
| La cadena de información de una valla | Funciona | Una barra invertida |

Las últimas tres filas son la imagen especular de las primeras seis, y sorprenden a la gente en la otra dirección: los escapes sí funcionan en destinos de enlace, títulos de enlace y cadenas de información. Un paréntesis dentro de una URL puede escaparse en vez de codificarse por porcentaje, y un título que contiene comillas puede llevarlas.

Hay exactamente una excepción documentada a la regla del fragmento de código, y pertenece a GitHub Flavored Markdown más que a CommonMark. La extensión de tablas dice que para incluir una barra vertical en el contenido de una celda hay que escaparla, incluso dentro de otros elementos en línea (comprobado en github.github.com, el 9 de septiembre de 2026, especificación versión 0.29-gfm del 6 de abril de 2019). La razón es mecánica: el parser de tablas divide una fila por las barras verticales antes de que ocurra ningún análisis en línea, así que `\|` tiene que gestionarse en esa etapa anterior, y por eso funciona en el único sitio donde los escapes normalmente no llegan. Escribe `` `x \| y` `` en una celda y obtienes un fragmento de código que contiene `x | y`. Escribe `` `x | y` `` y obtienes dos celdas.

## Referencias de carácter, y cuándo son la mejor respuesta

La segunda forma de escribir un carácter literal es nombrar su punto de código. CommonMark reconoce tres formas: `&` más un nombre de entidad HTML5 válido más `;`, `&#` más entre uno y siete dígitos decimales más `;`, y `&#` más `x` o `X` más entre uno y seis dígitos hexadecimales más `;`. Un punto de código inválido se sustituye por U+FFFD, el carácter de sustitución, y un nombre no reconocido se deja como texto literal (comprobado en spec.commonmark.org, el 9 de septiembre de 2026).

La propiedad que las hace útiles está en la misma sección: las referencias no se reconocen dentro de bloques de código ni fragmentos de código, y no pueden sustituir a un carácter estructural. `&#42;` es un asterisco literal en la salida y nunca el inicio de énfasis; `&#35;` al principio de una línea es un almohadilla, no un encabezado. Donde una barra invertida quita un significado, una referencia nunca tuvo uno que quitar — el carácter llega después de que el parser ya decidió qué es la línea.

| Referencia | Carácter | Por qué recurrirías a ella |
| :--- | :--- | :--- |
| `&amp;` | `&` | La que no puedes evitar: un `&` suelto puede iniciar una referencia |
| `&lt;` `&gt;` | `<` `>` | Prosa sobre HTML, y donde sea que se permita HTML crudo |
| `&quot;` | `"` | Dentro de un atributo HTML, donde una barra invertida rompe el valor |
| `&#42;` | `*` | Un asterisco literal que ningún parser puede leer como énfasis |
| `&#95;` | `_` | Lo mismo, para un guion bajo, en un dialecto con énfasis intrapalabra |
| `&#124;` | `\|` | Una barra vertical en una celda de tabla, en un renderizador cuyo manejo de `\|` no te fías |
| `&copy;` `&reg;` | `©` `®` | No son puntuación ASCII, así que una barra invertida no puede escaparlos de todos modos |
| `&nbsp;` | Un espacio irrompible | Mantener «10 MB» o «Figura 3» en una sola línea |
| `&#x2014;` | Una raya | Un carácter que la fuente o el teclado de tu editor hacen incómodo |

Una referencia es la mejor respuesta en cuatro situaciones. Donde una barra invertida está muerta — dentro de HTML crudo, o en el valor de un atributo. Donde el carácter no es puntuación ASCII, así que no hay nada que escapar: `©`, `®`, `†`, un espacio irrompible, una raya tipográfica. Donde el archivo va a pasar por una herramienta que elimina o duplica barras invertidas, porque `&amp;` sobrevive a un reemplazo de texto ingenuo que `\&` no sobrevive. Y donde quieres que el carácter sea inmune a las diferencias entre dialectos, ya que `&#42;` se comporta de forma idéntica en cualquier renderizador que implemente referencias.

Los costes son reales y conviene decirlos. Una referencia es HTML, así que solo tiene sentido en una vía que acabe en HTML: convierte el mismo archivo [a texto plano](/blog/markdown-to-plain-text) o a un procesador de textos, y un conversor que no resuelva las referencias imprimirá `&nbsp;` como seis caracteres visibles. Las referencias son ilegibles en el origen — nadie que repase un párrafo reconoce `&#8212;` a simple vista. Y son una lista más corta de lo que parece: solo los caracteres con un nombre HTML5 funcionan en la forma nombrada, así que nombres inventados como `&asterisk;` se cuelan como texto.

## Los caracteres que solo importan en una posición

La mayor parte de lo que la gente escapa es innecesario, porque la mayoría de estos caracteres solo son especiales en un lugar concreto. Aprender las posiciones sale más barato que aprender la tabla.

**Al principio de una línea.** Aquí es donde se decide la estructura de bloque, y donde un carácter que había sido inofensivo todo el documento deja de serlo de golpe. Un `#` se convierte en un encabezado. Un `>` se convierte en una cita en bloque. Un `-` o un `+` se convierte en una viñeta — y un `-` en la línea bajo un párrafo se convierte en un subrayado setext de `<h2>`, transformando la frase de encima en un encabezado. Un `=` en esa misma línea la convierte en un `<h1>`. Los dígitos seguidos de `.` o `)` se convierten en el marcador de una lista ordenada, y el número se usa: un párrafo que empieza «1986. El año en que cambió la norma» se renderiza como una lista ordenada cuyo primer elemento está numerado 1986, porque el marcador fija el atributo `start` de la lista. Todos estos necesitan una barra invertida, puesta sobre el carácter y no al principio de la línea: `1986\.`, no `\1986.`.

La sangría también cuenta como posición. Un marcador de bloque sigue funcionando con hasta tres espacios delante, y cuatro espacios lo convierten en un bloque de código con sangría — así que empujar una línea un poco a la derecha no desarma un almohadilla, y empujarla más la convierte en otra cosa por completo.

**Al final de un encabezado.** Una secuencia final de almohadillas en un encabezado ATX es una secuencia de cierre y se elimina: `### Notas ###` se renderiza como «Notas». Si las almohadillas son parte del texto, escapa la secuencia — `### Notas \###` — y se quedan.

**Dentro de una celda de tabla.** La barra vertical es el único carácter cuyo significado especial se limita a una sola construcción, y ahí es absoluto: una barra vertical sin escapar cierra la celda, esté envuelta en lo que esté envuelta. Todo lo relacionado con [mantener una tabla intacta durante una conversión](/blog/markdown-tables-that-survive-conversion) empieza por ese único carácter.

**En el texto y en el destino de un enlace.** Los corchetes se anidan mal, así que un corchete dentro del texto de un enlace necesita escaparse: `[a \[b\] c](https://example.com)`. Dentro del destino, los paréntesis equilibrados suelen estar bien y uno desequilibrado necesita `\(` o `\)`. Un espacio dentro de un destino no es un problema de escape en absoluto — una barra invertida no lo va a salvar, y el enlace entero se degrada a texto plano; hay que codificarlo por porcentaje.

**Dentro del título de un enlace.** Unas comillas dentro de un título `"…"` necesitan `\"`, uno de los pocos sitios donde una barra invertida funciona y la gente da por hecho que no.

### La barra invertida al final de una línea

Hay una posición donde una barra invertida no es un escape en absoluto, y es la colisión que conviene conocer. La especificación lo dice sin rodeos: una barra invertida al final de la línea es un salto de línea forzado (comprobado en spec.commonmark.org, el 9 de septiembre de 2026). Así que una línea de párrafo que termina en una sola barra invertida no imprime una — emite un `<br>` y une la línea siguiente a sí misma.

Esto importa en exactamente un caso frecuente, y es de Windows. Una ruta de directorio escrita como prosa y que termina en un separador, `C:\logs\`, cae al final de una línea y se convierte en un salto de línea, llevándose la barra invertida consigo. Dos barras invertidas, `C:\logs\\`, dan una barra invertida literal y ningún salto. Un fragmento de código da la ruta y nada más, que es la respuesta correcta.

Al final de un bloque — la última línea de un párrafo, el final de un encabezado — ninguna de las dos sintaxis de salto tiene una línea que romper, y la barra invertida se imprime en su lugar. Esa asimetría es la parte útil de comparar las dos formas de salto forzado: una barra invertida perdida es visible en la página, mientras que los espacios finales perdidos no lo son.

## Lo que un conversor escapa por ti a la salida

Escapar no es solo algo que le haces tú a un archivo de origen. Cada conversión, en cualquiera de las dos direcciones, inserta escapes, y saber cuáles te dice cómo leer una salida rota.

**De Markdown a HTML.** Tres caracteres de tu texto no pueden viajar como ellos mismos, porque el navegador los leería como marcado. Un conversor los sustituye, en silencio y siempre.

| En tu Markdown | En el HTML | Por qué |
| :--- | :--- | :--- |
| `<` en el texto | `&lt;` | De lo contrario el navegador empieza a analizar una etiqueta |
| `&` en el texto | `&amp;` | De lo contrario el navegador empieza a analizar una referencia |
| `>` en el texto | `&gt;` | Simetría, y seguridad en parsers antiguos |
| `"` en un atributo | `&quot;` | De lo contrario el valor del atributo termina antes de tiempo |
| `'` en un atributo | `&#39;` | Lo mismo, para atributos entre comillas simples |

Por eso un `<div>` literal escrito en una frase aparece como texto en la página en vez de desaparecer dentro del marcado, y no es una novedad moderna sino un comportamiento antiguo: el documento original de sintaxis de Markdown señala que dentro de fragmentos y bloques de código, los corchetes angulares y los ampersands siempre se codifican de forma automática (comprobado en daringfireball.net, el 9 de septiembre de 2026). Una referencia de carácter que escribiste tú mismo se deja tal cual — un conversor que reescapara `&amp;` en `&amp;amp;` rompería cada documento que ya tuviera una.

**De HTML, Word, CSV o JSON a Markdown.** Aquí el conversor tiene que insertar barras invertidas, y es una forma razonable de juzgarlo. Un párrafo que empieza «1986. El año» tiene que llegar como `1986\. El año` o el documento gana una lista que nadie escribió. Una frase que contiene un asterisco, una celda de tabla que contiene una barra vertical, un encabezado cuyo texto contiene un almohadilla, un nombre de producto con un guion bajo en un límite de palabra: cada uno necesita una barra invertida insertada durante la conversión, y un conversor que se salta ese paso devuelve un archivo que se renderiza como un documento distinto del que le entregaron. [Probar una conversión con un párrafo deliberadamente incómodo](/blog/convert-html-to-markdown) antes de confiarle cien páginas cuesta un minuto.

**De texto plano a Markdown.** El mismo problema aparece sin nada que convertir en absoluto: un `.txt` nunca fue Markdown, así que cualquiera de los treinta y dos caracteres de arriba que haya caído dentro de él — una viñeta escrita como guion, un marcador de nota escrito como guion bajo, un año al principio de una línea — se lee como formato en el momento en que el archivo se trata como Markdown, aunque nadie lo pretendiera. [La conversión de texto sin formato a Markdown de TransformPipe](/text-to-markdown) existe exactamente para este caso: escapa los propios caracteres de Markdown en el origen antes de que nada lo renderice, así que el archivo dice en la página exactamente lo que decía en el `.txt`, asteriscos incluidos.

**Por qué aparece `&amp;lt;` en una página.** Porque algo se escapó dos veces. `<` se convirtió en `&lt;`, y luego una segunda pasada trató esa cadena como texto plano y escapó su amperseand en `&amp;`, dando `&amp;lt;` — que el navegador renderiza fielmente como el texto visible `&lt;`. `&amp;amp;lt;`, tres capas de profundidad, significa tres pasadas. La causa suele ser una canalización donde dos etapas creen ambas que son la responsable de escapar: un conversor que emite HTML, alimentando un motor de plantillas que escapa sus entradas automáticamente; o un saneador ejecutado después del escape en vez de antes. El diagnóstico es aritmético — cuenta las capas de `amp;` y sabes cuántas etapas escaparon — y el arreglo es quitar un paso de escape, nunca añadir uno de desescape.

El síntoma reflejado es una barra invertida en la página renderizada donde esperabas un carácter limpio. Eso significa que un texto escapado para Markdown llegó a algo que no es un renderizador de Markdown: un campo de texto plano, un atributo `title`, un fragmento de código añadido después de los escapes. O los escapes no deberían estar ahí, o el texto no debería estar en ese contenedor.

## Los casos que realmente aparecen

Cinco situaciones explican casi todas las quejas reales sobre el escape. Ninguna es exótica, y solo una es de verdad un asunto de Markdown.

### Escribir sobre Markdown en Markdown

El documento más difícil de escribir en Markdown es un documento sobre Markdown, porque cada ejemplo es una construcción viva. Escapar carácter por carácter funciona y se lee terrible: `\*\*negrita\*\*` en el origen es peor que lo que describe.

Usa fragmentos de código en su lugar, y usa la regla del relleno cuando la muestra contenga backticks. Un fragmento de código puede abrirse con cualquier número de backticks y se cierra con el mismo número, y un solo espacio inicial y final se elimina, así que un fragmento de dos backticks con espacios dentro contiene un backtick literal. Para mostrar un bloque con cercas, abre la valla exterior con cuatro backticks y pon el ejemplo de tres backticks dentro:

    ````
    ```js
    const x = 1;
    ```
    ````

Para algo corto — un fragmento de sintaxis, una opción, un marcador — un fragmento de código es a la vez correcto y más corto que escapar. **Para quién es:** cualquiera que escriba documentación, una guía de estilo o un README que cita sintaxis.

### Fragmentos con sintaxis de plantillas

`{{ }}`, `{% %}` y `${…}` generan un flujo constante de preguntas sobre escapes y ninguna de ellas es un problema de Markdown. Las llaves son escapables pero no significan nada en CommonMark: `{{ nombre }}` en un párrafo se renderiza como `{{ nombre }}`. Lo que se las come es un segundo procesador que trabaja sobre el mismo archivo — el motor de plantillas de un generador de sitios estáticos, una compilación de documentación, un framework de componentes — que corre antes de Markdown o después.

Así que una barra invertida no puede ayudar, porque el motor que consume las llaves nunca ha oído hablar de los escapes de Markdown. Cada motor tiene su propio mecanismo, y el de Liquid es el ejemplo más claro: su etiqueta `raw` desactiva temporalmente el procesamiento de etiquetas, y su documentación da la sintaxis de Handlebars como la razón por la que la querrías (comprobado en shopify.github.io, el 9 de septiembre de 2026). Un bloque de código con cercas tampoco protege aquí — un motor de plantillas que corre sobre el `.md` crudo no tiene ni idea de que la valla existe.

`${…}` es una tercera variante de la misma forma: dentro de una plantilla literal de JavaScript es interpolación, y el escape que la detiene es la barra invertida de JavaScript, en el código, no la de Markdown. Escaparla en el Markdown te da un documento que contiene `\${…}`, que está mal por partida doble.

**Para quién es:** cualquiera que documente un lenguaje de plantillas, un script de shell o una configuración de CI dentro de un sitio que está a su vez construido con plantillas. Busca primero la directiva «raw» del motor exterior; la capa de Markdown no es donde va el arreglo.

### Rutas de Windows

Una ruta como `C:\Users\nombre\Documents` suele sobrevivir a un renderizador de Markdown, y esa es la trampa. Cada barra invertida va seguida de una letra, así que cada una es una barra invertida literal y se imprime. Luego una ruta del documento resulta seguida de puntuación ASCII y pierde un separador sin ningún aviso: `C:\temp\_new` se renderiza como `C:\temp_new`, y `C:\logs\` al final de una línea se convierte en un salto de línea.

Nada en la salida lo señala. La ruta sigue pareciendo una ruta plausible, que es justo por qué este fallo llega a un artículo de soporte y se copia en la terminal de alguien antes de que nadie lo note. Duplicar cada barra invertida funciona y deja el origen ilegible. Un fragmento de código funciona, es más corto y protege todo el fragmento a la vez — dentro de backticks una barra invertida es contenido, siempre, y no queda nada que se pueda estropear.

**Para quién es:** cualquiera que escriba instrucciones de instalación, ubicaciones de registros o rutas de configuración para Windows. Pon cada ruta en un fragmento de código por costumbre y esta clase de error desaparece.

### Divisas y matemáticas con signos de dólar

En CommonMark puro y en GFM, `$` no significa nada. «Cuesta entre 5 y 10 dólares» se renderiza exactamente como se escribió, y no hace falta escapar nada. El problema empieza donde una extensión matemática está activada, porque entonces `$…$` es un delimitador y dos signos de dólar en una línea se convierten en una expresión matemática que contiene tu frase.

GitHub es el sitio donde más gente se topa con esto. Su documentación dice que una expresión en línea va rodeada de símbolos de dólar, que dentro de una expresión matemática hay que poner una barra invertida antes de un `$` explícito, y — la parte que conviene recordar — que fuera de una expresión matemática pero en la misma línea conviene usar etiquetas `span` alrededor del `$` explícito (comprobado en docs.github.com, el 9 de septiembre de 2026). Esa es una instrucción a recurrir a HTML crudo en vez de a una barra invertida, lo que dice cuán firmemente ha quedado reclamado el signo de dólar en esa plataforma.

La respuesta portable es la de siempre: pon la cantidad en un fragmento de código, o escribe la divisa con palabras. **Para quién es:** cualquiera que escriba sobre precios, cifras financieras o unidades en un repositorio cuyo README lo renderiza una plataforma con matemáticas activadas.

### Guiones bajos dentro de identificadores

Es la queja real más común, y la buena noticia es que CommonMark ya resolvió la mayor parte. Un guion bajo solo puede abrir o cerrar énfasis en un límite de palabra, así que `snake_case_name` se renderiza como sí mismo, sin tocar, y no necesita ninguna barra invertida. No pasa lo mismo con los asteriscos: `a*b*c` pone en énfasis la `b`, porque `*` no tiene esa restricción.

Tres formas siguen rompiéndose, y son las que generan los reportes.

| Lo que escribes | Lo que obtienes | Por qué |
| :--- | :--- | :--- |
| `snake_case_name` | `snake_case_name` | Los dos guiones bajos están dentro de una palabra: sin énfasis |
| `__init__` | «init» en negrita | Ambos pares están en un límite de palabra, así que ambos pueden actuar como delimitadores |
| `_private and id_` | «private and id» en cursiva | Un guion bajo inicial abre; uno final, frases más adelante, cierra |
| `MAX_VALUE and MIN_VALUE` | Sin cambios | Ambos son intrapalabra |
| `a*b*c` | `a<em>b</em>c` | Los asteriscos no tienen regla de límite de palabra |

`__init__` es el caso que más tiempo cuesta, porque los nombres «dunder» de Python son exactamente el patrón que la regla de énfasis está diseñada para atrapar, y la salida — texto en negrita donde debería haber un nombre de método — parece un accidente de estilo y no uno de sintaxis. `\_\_init\_\_` lo arregla con cuatro barras invertidas. Un fragmento de código lo arregla con dos backticks, y además evita que el nombre se reajuste, se pase por el corrector ortográfico o acabe con comillas tipográficas.

La regla del límite de palabra es de CommonMark, que es la otra mitad de la respuesta: un renderizador anterior a ella, o uno que implemente una regla de énfasis distinta, puede acabar poniendo en énfasis los guiones bajos intrapalabra igualmente. **Para quién es:** cualquiera que escriba sobre código en prosa — identificadores, variables de entorno, columnas de base de datos, nombres de opciones. Un fragmento de código es correcto en cualquier dialecto y de propina comunica «esto es un símbolo».

## La parte honesta: escapar depende del dialecto en los bordes

Todo lo anterior es cierto para CommonMark, y CommonMark no es lo único que renderiza tu archivo. El conjunto de caracteres escapables es en sí mismo una decisión de dialecto, y la diferencia no es pequeña.

El documento original de sintaxis de Markdown enumera exactamente quince caracteres que se pueden escapar: barra invertida, backtick, asterisco, guion bajo, las llaves, los corchetes, los paréntesis, el almohadilla, el más, el menos, el punto y el signo de exclamación (comprobado en daringfireball.net, el 9 de septiembre de 2026). CommonMark amplió eso a los treinta y dos caracteres de puntuación ASCII. Así que `\|`, `\~`, `\$`, `\:` y `\=` son escapes en un renderizador CommonMark y barras invertidas impresas en uno anterior a CommonMark. Un archivo que escapa por precaución para uno es un archivo con barras invertidas visibles en el otro, y los dos renderizadores hacen exactamente lo que dice su documentación.

Los bordes también se mueven en la otra dirección. GFM le da a `|` y a `~` significados que CommonMark no tiene — un límite de celda y, en pares, tachado — y añade el escape de barra vertical dentro de fragmentos de código para lidiar con el primero (comprobado en github.github.com, el 9 de septiembre de 2026). Una extensión matemática reclama `$`. La sintaxis de bloques de atributos reclama `{` y `}`. Los códigos cortos de emoji y algunas sintaxis de notas reclaman `:`. Cada uno de ellos saca un carácter de la columna «nunca necesita escaparse» y lo mete en la que sí, y ninguno está en una especificación única a la que puedas señalar como la definitiva. [Cuánto se separan los dialectos y qué funciones pertenecen a cada uno](/blog/commonmark-gfm-and-the-flavours) es el trasfondo de todo esto.

Lo cual deja una sola respuesta portable, y tiene un coste fácil de pasar por alto. Un fragmento de código funciona en todas partes: ningún dialecto interpreta su contenido, ninguna extensión reclama un carácter dentro, y la pregunta del escape no llega a plantearse. Pero un fragmento de código no es un envoltorio neutro — cambia el texto. Se renderiza en monoespaciado, normalmente con un fondo resaltado y un tamaño algo distinto, y lleva la semántica de «esto es código». Eso es correcto para una ruta, una opción o un identificador. Es incorrecto para el nombre de una empresa que contiene un amperseand, un precio, una frase sobre un asterisco, o un encabezado. Envolver prosa en backticks para evitar un problema de escape cambia un error de sintaxis por uno tipográfico, y el tipográfico es el tipo que un diseñador nota y una persona que escribe defiende.

Así que no hay una única respuesta, solo una jerarquía corta. Dentro de un fragmento de código si el texto es código. Una barra invertida si es prosa y un dialecto concreto tiene que renderizarla. Una referencia de carácter si una barra invertida no puede llegar o el carácter no es puntuación ASCII. Y reescribir la frase — mover el año fuera del inicio de la línea, escribir la divisa con palabras — más a menudo de lo que la gente intenta, porque una frase que no necesita ningún escape se renderiza correctamente en cualquier dialecto que exista o que llegue a existir.

## Elegir un escape, en cinco criterios

1. **Decide si el texto es código, porque eso responde casi todo lo demás.** Una ruta, una opción, un identificador o un patrón pertenece a un fragmento de código, donde no hace falta escapar nada y nada se interpretará; si el texto es prosa, un fragmento de código es el instrumento equivocado y vuelves a las barras invertidas.
2. **Comprueba la posición antes de añadir nada.** Seis de los caracteres que importan solo importan al principio de una línea, así que una barra invertida en medio de una frase casi siempre es una barra invertida que tendrás que explicarle a alguien más adelante.
3. **Escapa una sola vez, y sabe qué etapa lo hace.** Una canalización donde dos etapas escapan produce `&amp;lt;` en la página, y el único arreglo es quitar una de ellas — añadir un paso de desescape para compensar tapa el fallo y rompe el siguiente documento.
4. **Usa una referencia de carácter cuando la barra invertida no puede llegar.** Dentro de HTML crudo, en el valor de un atributo, o para un carácter que no es puntuación ASCII, `&quot;` y `&copy;` funcionan donde `\"` y `\©` no hacen absolutamente nada.
5. **Renderiza el archivo donde va a vivir de verdad antes de comprometerte con un esquema.** El conjunto escapable, las reglas de énfasis y el significado de `$`, `|` y `:` varían por dialecto, así que un documento que se ve bien en la vista previa de tu editor puede llevar barras invertidas visibles en la plataforma que lo publica.

## Conclusión

Escapar en Markdown es una sola regla con una cola larga: una barra invertida desarma cualquier puntuación ASCII, no hace nada delante de cualquier otra cosa, y no hace absolutamente nada dentro de un fragmento de código, un bloque de código, un autoenlace o HTML crudo. Casi todo problema es la segunda mitad de esa frase encontrándose con un carácter que solo era especial en una posición. Las referencias de carácter cubren lo que la barra invertida no puede alcanzar, los fragmentos de código cubren lo que preferirías no pensar, y una frase reescrita cubre el resto. Si quieres ver qué produce de verdad un archivo concreto — qué escapes sobrevivieron, qué caracteres se interpretaron y qué dice el HTML — [convertirlo en TransformPipe y leer la salida](/) es más rápido que razonarlo, y es la única forma de encontrar el escape que desapareció sin dejar rastro.

## Preguntas frecuentes

### ¿Cómo escapo un carácter especial en Markdown?

Pon una barra invertida delante, siempre que sea uno de los treinta y dos caracteres de puntuación ASCII: `\*` para un asterisco literal, `\#` para un almohadilla al principio de línea, `\|` para una barra vertical en una celda de tabla. Delante de una letra, un dígito o un carácter que no sea ASCII, la barra invertida no es un escape y se imprime en la página.

### ¿Por qué me aparece la barra invertida en la salida?

Lo más probable es que el texto esté dentro de un fragmento de código, un bloque de código, un autoenlace o HTML crudo, donde los escapes no funcionan y una barra invertida es contenido normal. La otra posibilidad es que hayas escapado algo que no es puntuación ASCII — una letra, un dígito, una raya — que la especificación define como una barra invertida literal.

### ¿Cómo escribo un asterisco o un guion bajo literal en Markdown?

Escribe `\*` o `\_`, o usa `&#42;` y `&#95;` si quieres un carácter que ningún parser pueda leer como énfasis. Los guiones bajos dentro de una palabra no necesitan nada en CommonMark ni en GFM, así que `snake_case_name` ya está a salvo; `__init__` no lo está, porque los dos pares caen en límites de palabra.

### ¿Por qué se rompe mi tabla cuando una celda contiene una barra vertical?

Porque la barra vertical es un límite de celda y el parser de tablas divide la fila por ella antes de que ocurra nada más, incluso antes de reconocer los fragmentos de código. Escápala como `\|`, que es el único escape que funciona dentro de un fragmento de código, o usa `&#124;`.

### ¿Cuándo debería usar `&amp;` en vez de una barra invertida?

Cuando una barra invertida no puede llegar al carácter o no tiene nada que quitarle: dentro de HTML crudo, dentro del valor de un atributo, y para caracteres que no son puntuación ASCII, como `©` y un espacio irrompible. Las referencias de carácter también sobreviven a canalizaciones que eliminan o duplican barras invertidas, al precio de ser ilegibles en el origen.

### ¿Por qué veo `&amp;lt;` en mi salida convertida?

Algo escapó el texto dos veces: `<` se convirtió en `&lt;`, y luego una segunda etapa escapó ese amperseand en `&amp;`. Cuenta las capas de `amp;` para contar las etapas, y luego quita una de ellas — normalmente un motor de plantillas que escapa automáticamente una salida que un conversor ya había escapado.

### ¿Escapar funciona igual en todas las herramientas de Markdown?

No en los bordes. El conjunto escapable es de treinta y dos caracteres en CommonMark y de quince en el Markdown original, y las extensiones para tablas, matemáticas, atributos y emoji reclaman caracteres que CommonMark puro ignora. Un fragmento de código se comporta igual en todas partes, que es por lo que es la respuesta portable, y por lo que conviene saber que también cambia cómo se ve el texto.
