---
title: "Tablas Markdown que sobreviven la conversión: cada forma en que se rompen"
description: "Por qué no se muestra una tabla Markdown: la fila separadora, los dos puntos de alineación, las líneas en blanco, las barras escapadas y GFM frente a CommonMark."
date: 2026-08-29
tag: Sintaxis
keywords: tabla markdown, sintaxis de tabla markdown, tabla markdown a html, alinear tabla markdown, tabla markdown no se muestra, salto de línea en celda markdown, tabla markdown muy ancha
---

### Resumen rápido

Una tabla Markdown es una fila de encabezado, una fila separadora hecha de guiones y cuantas filas de cuerpo hagan falta — y la fila separadora es todo el truco. Quítala, o deja que su número de celdas no coincida con el del encabezado, y no hay tabla en absoluto: sale un párrafo lleno de barras verticales, sin ningún aviso. Las tablas tampoco forman parte de CommonMark; llegaron con GitHub Flavored Markdown, así que un analizador estrictamente conforme se comporta bien cuando rechaza la tuya. Deja una línea en blanco antes y después del bloque, escapa cualquier barra vertical literal como `\|`, y recurre a `<br>` cuando una celda necesite una segunda línea, porque una fila termina donde termina la línea.

Una tabla es la parte de un documento con más probabilidades de llegar rota. Los encabezados son difíciles de estropear. Una palabra en negrita o lleva sus asteriscos o no los lleva. Una tabla es una rejilla sostenida por signos de puntuación, y un solo carácter equivocado en cualquier punto del bloque no produce una tabla un poco mal — produce ninguna tabla, porque el analizador deja de reconocer la forma y trata todo el bloque como prosa.

Ese modo de fallo es lo que hace que las tablas frustren. No hay error, ni aviso, ni rejilla a medio mostrar. Aparecen cinco líneas de texto con barras verticales, justo donde antes estaba tu tabla, y nada en el resultado te dice cuál de esas cinco líneas era el problema. El archivo sigue viéndose bien en tu editor, porque el editor te está mostrando el origen.

La buena noticia es que los fallos son un conjunto cerrado. Casi toda tabla Markdown rota tiene una de unas diez causas, cada una con un síntoma reconocible. Esta página las recorre todas: qué es cada parte de la sintaxis, para qué sirve realmente, qué ocurre cuando está mal y qué cuesta arreglarla. Si tienes una tabla rota delante ahora mismo, empieza por la tabla de síntomas dos secciones más abajo.

## Qué es realmente una tabla Markdown

Tres partes, en este orden, en líneas consecutivas:

```markdown
| Flag | Long form | Takes a value |
| --- | --- | --- |
| `-o` | `--output` | yes |
| `-q` | `--quiet` | no |
```

La primera línea es la fila de encabezado. La segunda es la fila separadora — a veces llamada fila delimitadora — y es lo que convierte este bloque en una tabla en vez de un párrafo. El resto son filas de cuerpo. El bloque termina en la primera línea en blanco, o en la primera línea que empieza otra construcción de bloque, como un encabezado o una valla de código.

Convertido a HTML, queda más o menos así:

```html
<table>
<thead>
<tr><th>Flag</th><th>Long form</th><th>Takes a value</th></tr>
</thead>
<tbody>
<tr><td><code>-o</code></td><td><code>--output</code></td><td>yes</td></tr>
<tr><td><code>-q</code></td><td><code>--quiet</code></td><td>no</td></tr>
</tbody>
</table>
```

De ese resultado se derivan dos cosas, y ambas explican buena parte de los problemas posteriores. Primero, siempre hay exactamente una fila de encabezado, envuelta en `<thead>`. Markdown no tiene sintaxis para una tabla sin encabezado, ni para dos filas de encabezado. Segundo, cada celda es un `<th>` o un `<td>` que contiene contenido en línea. No existe mecanismo en la sintaxis para una celda que abarque dos columnas, una celda que abarque dos filas, una tabla anidada, ni una celda con un párrafo y una lista dentro.

Vale la pena saber esto antes de seguir leyendo: el analizador está buscando una forma, no reparándola. Si las dos primeras líneas no coinciden en cuántas celdas contienen, el bloque nunca se convierte en tabla, y cada línea de él se emite como texto. Esa única regla explica más tablas rotas que todo lo demás de esta página junto.

## Tabla Markdown que no se muestra: del síntoma a la causa

Busca el síntoma y lee la sección a la que apunta.

| Symptom in the output | Almost always because | Fix |
| --- | --- | --- |
| Toda la tabla es un párrafo de barras verticales | No hay fila separadora, o tiene un número de celdas distinto al del encabezado | Cuenta las celdas de las dos líneas; tienen que coincidir exactamente |
| Toda la tabla es un párrafo, y los guiones se ven raros | Un editor convirtió `---` en una raya, o las barras son de ancho completo `｜` por un método de entrada | Vuelve a escribir la fila separadora con guiones normales y barras ASCII |
| La fila de encabezado se pega al párrafo de arriba | No hay línea en blanco entre la prosa y la tabla | Una línea en blanco antes de la tabla, y otra después |
| La tabla se muestra, pero falta una columna | La fila separadora tiene menos celdas de las que sugiere el contenido del encabezado | Cuenta los guiones, no los encabezados |
| Una fila tiene una celda partida en dos, y se ha perdido su último valor | Una `\|` sin escapar dentro del valor de una celda | Escríbela como `\|`, comillas invertidas incluidas |
| Una celda está vacía cuando el origen claramente tiene texto | Esa fila tenía más celdas que el encabezado, así que se descartaron las que sobraban | Ajusta el número de celdas, o escapa la barra sobrante |
| La tabla se muestra como bloque de código | El bloque está sangrado cuatro espacios o más | Reduce la sangría a cero, o a la columna de contenido del elemento de lista |
| La tabla se muestra en todas partes salvo en una herramienta | Esa herramienta ejecuta CommonMark sin la extensión de tablas | Elige un analizador GFM, o acepta el resultado alternativo |
| Dos frases de una celda quedaron pegadas | Un `<br>` fue eliminado por un sanitizador, o nunca estuvo ahí | Revisa la lista blanca del sanitizador; no hay otra forma de partir la línea |
| Una lista con viñetas dentro de una celda salió como guiones literales | Las celdas solo admiten contenido en línea | Reestructura: la tabla es el resumen, el detalle va debajo |
| La alineación se ignora | Los dos puntos están en el lado equivocado de los guiones, o una hoja de estilos la sobrescribe | `:---`, `:---:`, `---:` — los dos puntos van dentro de la celda, contra los guiones |

Dos de esas merecen énfasis, porque son las que la gente mira sin ver. Una fila separadora mal contada y una barra sin escapar producen ambas un resultado que parece un problema de formato y en realidad es un problema de conteo.

## La chuleta: cada parte de una tabla, y lo que cuesta

| Part | What it is for | What it does | Price |
| --- | --- | --- | --- |
| Fila de encabezado | Nombrar las columnas | Se convierte en `<thead>`, una fila de `<th>` | Obligatoria; no existe tabla sin encabezado |
| Fila separadora | Decirle al analizador que esto es una tabla | Fija el número de columnas para todo el bloque | Una línea, y contar columnas dos veces |
| Guiones | Rellenar las celdas de la separadora | Un solo `-` por celda es válido; `---` es convención | Nada; la longitud es cosmética |
| Dos puntos de alineación | Alinear una columna a izquierda, centro o derecha | Emite un atributo `align` o un estilo `text-align` por celda | Un carácter por columna, y solo por columna |
| Barras exteriores | Enmarcar la fila | Opcionales en toda fila salvo en una tabla de una sola columna | Dos caracteres por línea, y mucha más legibilidad |
| `\|` | Poner una barra literal en una celda | Escapa el delimitador, comillas de código incluidas | Una barra invertida, y un origen algo más ruidoso |
| `<br>` | Cortar una línea dentro de una celda | HTML en línea, que GFM deja pasar | Una dependencia de lo que sea que sanee tu HTML |
| Línea en blanco antes y después | Marcar los límites del bloque | Mantiene el encabezado fuera del párrafo anterior | Dos líneas en blanco, a cambio de portabilidad |
| Sangría | Colocar una tabla dentro de un elemento de lista | De cero a tres espacios está bien; cuatro es un bloque de código | Cuidado, siempre que la tabla esté anidada |
| Número de celdas por fila | Rellenar la rejilla | Las filas cortas se rellenan, las largas se recortan | Silencio cuando está mal |
| Solo contenido en línea | Mantener las celdas analizables | Texto, énfasis, código en línea, enlaces, imágenes | Sin listas, párrafos, vallas ni anidamiento |
| Envoltorio con scroll | Sobrevivir a una página estrecha | Un `<div>` al que tu hoja de estilos puede darle `overflow-x: auto` | Líneas en blanco dentro del envoltorio, y control del CSS |

Todo lo que sigue desarrolla una fila de esa tabla.

## Las partes, una a una

### La fila separadora — la línea que la convierte en tabla

Esta es la línea que sostiene todo. `| --- | --- | --- |` no es decoración entre el encabezado y el cuerpo; es la declaración que convierte tres líneas de barras en una rejilla. Bórrala y el analizador ya no tiene motivo para tratar ninguna de esas líneas como otra cosa que un párrafo, que es exactamente lo que sale al otro lado.

| Pros | Cons |
| --- | --- |
| Una sola línea marca toda la diferencia entre prosa y tabla | Su número de celdas tiene que coincidir exactamente con el del encabezado |
| Un solo guion por celda basta; nadie los cuenta | Nada avisa cuando los recuentos no coinciden |
| Lleva la alineación, así que el formato no necesita sintaxis aparte | La corrección tipográfica de un editor puede destruirla sin que se note |
| Es lo primero que hay que comprobar cuando una tabla se rompe | Tiene que ser la segunda línea — ni la tercera, ni tras un comentario |

**Precio:** una línea, y el hábito de contar columnas dos veces antes de culpar al conversor.

**Detalles técnicos y funciones**

- Cada celda de la separadora puede llevar guiones, un colon inicial opcional, un colon final opcional y espacios. Nada más. Una letra suelta o un punto y el bloque pasa a ser un párrafo.
- El número de celdas de la fila separadora tiene que igualar al de la fila de encabezado. Es la única regla estricta de toda la construcción.
- Una vez que esas dos coinciden, ese número de columnas queda fijado para cada fila de cuerpo que venga después.
- `-`, `--` y `-----------` son idénticos para el analizador. Alinear los guiones con la celda más ancha es cosa de quien edite el archivo después.
- Los procesadores de texto y algunos editores convierten `---` en una raya mientras escribes. Una raya es un carácter distinto, así que la fila separadora deja de serlo.

**¿Para quién es?** Para todo el mundo, en cada tabla, en la segunda línea. Si una tabla no se muestra, es lo primero que hay que mirar, y la mayoría de las veces ahí se puede parar.

### Los dos puntos de alineación — el único formato que recibe una columna

Los dos puntos en la fila separadora fijan la alineación de toda la columna, encabezado incluido:

```markdown
| Left | Centred | Right |
| :--- | :-----: | ----: |
| a | b | 1 |
```

Un colon a la izquierda alinea a la izquierda, a la derecha alinea a la derecha, en ambos lados centra, y ninguno deja el valor predeterminado del renderizador — que suele ser a la izquierda, pero es decisión de la hoja de estilos y no del documento.

| Pros | Cons |
| --- | --- |
| Cuesta un carácter y se aplica a toda la fila de la columna | Solo por columna: no existe alineación por celda |
| Los números alineados a la derecha quedan con las cifras en línea, que es justo el objetivo | Lo que se emite varía entre renderizadores |
| Funciona con un solo guion, así que `:-:` es una celda centrada válida | La lista blanca de un sanitizador puede eliminar el atributo o el estilo |
| Encabezado y cuerpo siempre coinciden, porque es una sola declaración | Sin alineación vertical, ni forma de alinear una tabla entera |

**Precio:** un carácter por columna, y una dependencia de lo que decida emitir tu renderizador.

**Detalles técnicos y funciones**

- El colon va dentro de la celda, contra los guiones. `| :--- |` está bien; `| : --- |` y `|:|` no lo están.
- Algunos renderizadores emiten `<th align="right">`, otros `<th style="text-align:right">`. Ambos se ven idénticos en un navegador.
- La diferencia importa en dos sitios: cuando escribes tu propio CSS contra el resultado, y cuando el HTML pasa por un sanitizador cuya lista blanca permite uno de `align` y `style` pero no el otro. [Sanear Markdown de forma segura](/blog/sanitising-markdown-safely) explica por qué merece la pena insistir en una única lista blanca compartida.
- La alineación es el único control por columna que tiene la sintaxis. Sin anchos, sin colores, sin reglas de ajuste de línea — eso vive en el CSS o en ningún sitio.

**¿Para quién es?** Para cualquiera con una columna de números, versiones o tamaños de archivo. Alinéalos a la derecha y deja las columnas de texto en paz; el texto centrado en el cuerpo se lee peor de lo que parece en el editor.

### Líneas en blanco — el límite que necesita el analizador

Escrita justo debajo de una línea de prosa, la fila de encabezado de una tabla puede ser tragada por ese párrafo. Los analizadores no se ponen de acuerdo sobre si una tabla puede interrumpir un párrafo, así que un archivo que se muestra bien en tu máquina puede no mostrarse en la siguiente herramienta de la cadena.

| Pros | Cons |
| --- | --- |
| Dos líneas en blanco vuelven el bloque inequívoco en todas partes | Fáciles de perder cuando los archivos se generan o se concatenan |
| Eliminan toda una clase de diferencia entre herramientas | Es espacio en blanco, así que un revisor no nota que falta |
| También arreglan tablas envueltas en HTML crudo | Algunos editores quitan las líneas en blanco finales al guardar |

**Precio:** dos líneas en blanco, a cambio de una tabla que se comporta igual en todo renderizador.

**Detalles técnicos y funciones**

- Una línea en blanco antes de la fila de encabezado la mantiene fuera del párrafo anterior. Una línea en blanco después de la última fila de cuerpo cierra el bloque con claridad.
- La tabla también termina en cualquier línea que empiece otro bloque: un encabezado, una valla, una cita, una línea horizontal.
- Dentro de un envoltorio de HTML crudo las líneas en blanco no son opcionales — ver la sección de tablas anchas más abajo.
- Los archivos ensamblados por un script suelen ser la fuente habitual de una línea en blanco perdida. Une documentos con una línea en blanco entre ellos, no con un simple salto de línea.

**¿Para quién es?** Para todo el mundo, siempre. Es la fiabilidad más barata que vas a comprar hoy.

### Barras dentro de una celda — el escape que se te olvidará

Una barra sin escapar termina la celda dondequiera que aparezca. Eso incluye dentro de una comilla de código, porque la fila se divide por barras antes de que el analizador de línea llegue siquiera a ver las comillas invertidas. Escribe una tubería de shell, una unión de tipos o una expresión regular con una alternancia dentro, y la fila gana una celda de más y pierde un valor en silencio.

| Pros | Cons |
| --- | --- |
| `\|` funciona en cualquier parte de una celda, comillas de código incluidas | Nada en el resultado roto señala la barra |
| El escape es un solo carácter y no necesita configuración | Un origen con varios escapes se lee peor |
| La codificación por porcentaje como `%7C` funciona dentro del destino de un enlace | La misma cadena en un bloque con valla no necesita escape, lo cual confunde |

**Precio:** una barra invertida por cada barra vertical, y un origen que se lee algo peor que el resultado.

**Detalles técnicos y funciones**

- Escapa una barra literal como `\|`. En GFM esto se respeta dentro de otros elementos en línea, así que `` `a \| b` `` se muestra como una comilla de código que contiene `a | b`.
- Una barra en el destino de un enlace es más segura codificada por porcentaje, como `%7C`, ya que las reglas de escape dentro de URLs son menos consistentes entre analizadores.
- Una barra dentro de un atributo HTML en una celda también divide la fila. El analizador no está leyendo tu HTML.
- La barra de ancho completo `｜` de un método de entrada chino o japonés no es el delimitador en absoluto, así que una fila escrita con ella nunca se convierte en celdas.
- Los bloques de código con valla fuera de una tabla no necesitan escape. Si una celda se está llenando de escapes, es una pista de que ese contenido pertenece a [un bloque de código](/blog/code-blocks-in-markdown).

**¿Para quién es?** Para cualquiera que documente una línea de comandos, una expresión regular, una condición OR o una unión de tipos — es decir, para casi todo el que escribe tablas técnicas.

### Saltos de línea dentro de una celda — imposibles, y `<br>` en su lugar

Una fila de tabla termina donde termina la línea. No hay sintaxis Markdown para un salto de línea dentro de una celda: dos espacios finales no hacen nada aquí, sea lo que sea que hagan [en otra parte de un documento](/blog/markdown-line-breaks-and-lists), y una barra invertida final tampoco ayuda, porque el analizador ya decidió que la fila terminó.

La solución es HTML en línea:

```markdown
| Step | Notes |
| --- | --- |
| Publish | Creates the link.<br>Sending it is your job. |
```

| Pros | Cons |
| --- | --- |
| Lo único que funciona, y funciona en la mayoría de los renderizadores | Es HTML dentro de tu Markdown, y algunas cadenas de trabajo lo prohíben |
| GFM permite HTML en línea, así que el analizador lo deja pasar | Un sanitizador que elimina etiquetas desconocidas junta las frases |
| `<br>` y `<br />` se analizan ambos | Varios saltos en una celda suelen significar que la tabla está mal planteada |

**Precio:** una etiqueta HTML, y una dependencia de que lo que sanee tu HTML la conserve.

**Detalles técnicos y funciones**

- Pon la etiqueta en línea, sin espacio delante, justo donde va el salto.
- Que sobreviva depende del siguiente paso, no del analizador. Un conversor que escapa el HTML crudo por defecto muestra un `<br>` literal; uno que elimina etiquetas desconocidas lo descarta y junta el texto.
- TransformPipe sanea la vista previa y el archivo descargado contra una misma lista blanca compartida, así que el salto que ves en la vista previa es el salto del archivo que envías.
- Si una celda necesita dos saltos, o un salto más una viñeta, estás escribiendo un párrafo dentro de una rejilla. Sácalo de ahí.

**¿Para quién es?** Para cualquiera con una columna de «notas», con moderación. Una tabla donde cada celda lleva un `<br>` es una tabla que pelea contra su propia forma.

### Filas irregulares — rellenadas en silencio, recortadas en silencio

Una vez que el encabezado y la separadora coinciden en un número de columnas, ese número es ley. Una fila de cuerpo con menos celdas se rellena con celdas vacías. Una fila de cuerpo con más celdas pierde las que sobran. Ninguna de las dos produce un aviso, y las dos parecen pérdida de datos cuando las descubres una semana después.

| Pros | Cons |
| --- | --- |
| Las filas cortas son válidas, así que se pueden omitir las celdas vacías finales | Una fila mal contada pierde su último valor sin ningún aviso |
| Este comportamiento tolerante mantiene funcionando las tablas editadas a mano | Añadir una columna obliga a tocar cada fila una por una |
| El número de columnas es fácil de comprobar: cuenta las celdas de la separadora | Las tablas generadas heredan cualquier error de conteo del generador |

**Precio:** silencio. Es la única parte de la sintaxis que falla sin dejar un síntoma visible en el origen.

**Detalles técnicos y funciones**

- El número de celdas lo decide solo el encabezado y la separadora. Las filas de cuerpo se ajustan a ellas.
- Un último valor perdido en una fila suele ser una barra sobrante más atrás en esa misma fila — con frecuencia una que no se escapó dentro de un valor.
- Las columnas no tienen que alinearse en el origen. Un origen irregular produce el mismo HTML que una rejilla ordenada; ordénala igual, para quien la edite después.
- Si añades una columna, añádela al encabezado, a la separadora y a cada fila de cuerpo en una sola edición. Las tablas migradas a medias se siguen mostrando, que es justo por lo que sobreviven a una revisión.

**¿Para quién es?** Para nadie, a propósito. Conoce la regla para que un valor que falta te lleve a contar barras en vez de culpar al conversor.

### Barras al principio y al final — opcionales, hasta que dejan de serlo

Estos dos bloques producen el mismo HTML:

```markdown
| Name | Size |
| --- | --- |
| logo.svg | 4 KB |

Name | Size
--- | ---
logo.svg | 4 KB
```

| Pros | Cons |
| --- | --- |
| La forma desnuda se escribe y se genera más rápido | Más difícil de leer, y más difícil de detectar si falta una celda |
| La forma enmarcada hace visible el número de columnas de un vistazo | Dos caracteres extra en cada línea |
| Ambas son GFM válido, así que ninguna supone un riesgo de portabilidad | Una tabla de una sola columna necesita las barras exteriores para que se la reconozca siquiera |

**Precio:** dos caracteres por línea en la forma enmarcada. Merece la pena pagarlos.

**Detalles técnicos y funciones**

- Las barras exteriores son opcionales en el encabezado, la separadora y las filas de cuerpo, de forma independiente. Se pueden mezclar, aunque no hay motivo para hacerlo.
- Una tabla de una sola columna es la excepción: sin ninguna barra en la línea no hay nada que le diga al analizador que está ante una tabla, así que escribe `| Header |` y `| --- |`.
- Los espacios alrededor del contenido de una celda se recortan, así que rellenar celdas para alinearlas no cuesta nada al mostrarlas.
- Los tabuladores dentro de una fila se tratan como espacio en blanco, no como delimitadores. Una tabla separada por tabuladores no es una tabla Markdown.

**¿Para quién es?** Usa la forma enmarcada en archivos que la gente edita a mano. La forma desnuda está bien para la salida de un script, donde nadie lee el origen de todos modos.

### Sangría — tres espacios están bien, cuatro son fatales

Hasta tres espacios iniciales se ignoran. Cuatro o más convierten la línea en un bloque de código con sangría, y la tabla se muestra como texto monoespaciado dentro de un recuadro gris — que al menos es un síntoma distintivo.

| Pros | Cons |
| --- | --- |
| La tolerancia de tres espacios perdona la mayoría del espacio en blanco suelto | Cuatro espacios son una construcción completamente distinta |
| Las tablas se anidan dentro de elementos de lista, si se sangran bien | La sangría necesaria depende del ancho del marcador de la lista |
| El fallo es visible: un bloque de código, no un párrafo | Mezclar tabuladores y espacios hace ambigua la columna de contenido |

**Precio:** atención, siempre que la tabla viva dentro de una lista.

**Detalles técnicos y funciones**

- Dentro de un elemento de lista, cada línea de la tabla — encabezado, separadora y cuerpo — tiene que quedar en la columna de contenido del elemento, que es la columna donde empieza el propio texto del elemento.
- Dentro de una cita, cada línea necesita su marcador `>`, incluida la fila separadora.
- Una tabla dentro de una lista dentro de una cita es legal, y nadie te lo agradecerá.
- Si la tabla se muestra como bloque de código, la solución es espacio en blanco, no sintaxis.

**¿Para quién es?** Para cualquiera que escriba procedimientos, donde un paso quiere una tabla pequeña debajo. Considera un encabezado y una tabla a todo lo ancho en su lugar; las tablas anidadas quedan apretadas en un teléfono.

### El dialecto — las tablas son GFM, no CommonMark

Las tablas no están ni en el Markdown original ni en CommonMark puro. Varias extensiones las añaden, y la versión de GitHub Flavored Markdown es la que sigue la mayoría de las herramientas. Un conversor que ejecuta CommonMark estricto sin la extensión de tablas muestra tu tabla como un párrafo de barras — y hace bien. Nada está roto. La función no está ahí.

| Pros | Cons |
| --- | --- |
| La sintaxis de tablas de GFM es la que implementa casi toda herramienta moderna | Un analizador CommonMark conforme la rechaza, correctamente |
| El resultado alternativo es texto legible en vez de un error | El fallo es silencioso, así que viaja lejos antes de que alguien lo note |
| Pandoc, remark, markdown-it y otros ofrecen todos tablas | Las extensiones difieren en los bordes: tablas de rejilla, títulos, celdas multilínea |

**Precio:** ninguno en GFM. En una cadena mixta, el coste es comprobar cada analizador una vez.

**Detalles técnicos y funciones**

- GFM define las tablas como una extensión de CommonMark, junto a las listas de tareas, el tachado y los enlaces automáticos. Una herramienta puede implementar CommonMark por completo y no soportar ninguna de las cuatro.
- Algunos ecosistemas necesitan la extensión activada explícitamente — un plugin, un preajuste o una bandera — y vienen con ella desactivada.
- Otros dialectos añaden funciones de tabla que GFM no tiene, como celdas multilínea o títulos. Esas no viajan bien: un documento que depende de ellas se muestra como barras en un renderizador GFM.
- [CommonMark, GFM y los dialectos](/blog/commonmark-gfm-and-the-flavours) explica qué hace cada analizador, y [la comparativa de conversores](/blog/best-markdown-to-html-converters) cubre qué herramientas manejan tablas sin configuración.

**¿Para quién es?** Para cualquiera cuyo archivo pase por más de un renderizador. Convierte un documento representativo pronto y mira sus tablas antes de construir nada sobre ellas.

## Cuando una tabla Markdown es la forma equivocada, y lo que eso cuesta

La sintaxis de arriba cubre tablas que deberían funcionar y no lo hacen. Hay una segunda categoría: tablas que no pueden funcionar, porque los datos no encajan en lo que es una tabla Markdown. Esta es la parte que una referencia de sintaxis suele omitir, y merece la pena ser honesto sobre las alternativas, porque cada una cuesta algo real.

**Celdas combinadas.** No existe colspan ni rowspan. Una tabla financiera con un encabezado que abarca varias columnas, o una matriz con una columna de etiqueta combinada, no se puede expresar. Las opciones son una `<table>` en HTML crudo dentro del archivo Markdown, o una presentación distinta. La tabla en HTML funciona, y cuesta tres cosas: nadie puede leerla en el origen, el diff de un solo valor cambiado se convierte en el diff de una fila HTML entera, y todo el bloque depende de que el sanitizador de tu conversor permita `table`, `tr`, `td`, `colspan` y `rowspan`. Muchas listas blancas permiten las etiquetas y eliminan los atributos, lo que produce una tabla que se muestra con los abarcados desaparecidos en silencio.

**Celdas con contenido real dentro.** Una celda que quiere un párrafo, una lista con viñetas, un bloque de código con valla, una cita o una tabla anidada no puede tenerlo. Las celdas solo admiten contenido en línea, punto. La solución habitual es también la correcta: mantén la tabla como resumen, un valor corto por celda, y pon el detalle en secciones con encabezado debajo. Se lee mejor también en un teléfono, donde una tabla de cinco columnas cuesta seguirla como sea que esté escrita.

**Cualquier cosa con casilla.** Las casillas de las listas de tareas vienen de elementos de lista, así que `- [ ]` dentro de una celda queda como texto literal en la mayoría de los renderizadores. Si necesitas una columna de marcas, pon un carácter y dile en el encabezado qué significa.

**Enlaces de estilo referencia definidos cerca.** Las definiciones de referencia de enlace son de nivel de bloque, así que no pueden vivir dentro de una tabla. Las referencias definidas en otra parte del documento funcionan bien dentro de las celdas; la definición solo tiene que estar fuera del bloque.

**Tablas que en realidad son datos.** Si las filas vienen de una hoja de cálculo, una exportación o una consulta, editar barras a mano es el trabajo equivocado — [convierte el CSV en su lugar](/blog/best-csv-to-markdown-converters). Cada columna añadida obliga a tocar cada fila, y una fila mal contada pierde un valor en silencio. Mantén el CSV o la consulta como fuente de verdad y genera el Markdown: [convertir CSV a una tabla Markdown](/csv-to-markdown) te quita el conteo de encima por completo y acierta el escape en valores que contienen barras, que es justo el error que la gente comete a mano.

**Tablas anchas.** Dos problemas se esconden detrás de una sola queja. El primero es el archivo de origen, donde una tabla de nueve columnas es miserable de editar e imposible de revisar. El segundo es la página: una tabla HTML toma el ancho que su contenido exige, así que una ancha o aprieta sus columnas en cintas o arrastra la página hacia los lados. Soluciones, más o menos en el orden en que deberían gustarte:

- Corta una columna. Las tablas anchas suelen tener una con el mismo valor en cada fila, o dos que podrían ser una.
- Acorta los encabezados. Un encabezado que no puede partirse en dos líneas fija el ancho mínimo de la columna, así que «Requiere autenticación» cuesta más que «Auth».
- Gírala. Cuatro columnas y tres filas a menudo se leen mejor al revés.
- Divídela en dos tablas que comparten una columna clave.
- Déjala hacer scroll, envolviéndola en un contenedor al que tu hoja de estilos le dé `overflow-x: auto`.

Esa última tiene una trampa que merece explicarse, porque es una forma habitual de romper una tabla que antes funcionaba bien:

```markdown
<div class="table-scroll">

| Column | Column |
| --- | --- |
| … | … |

</div>
```

Las líneas en blanco dentro del envoltorio son obligatorias. Sin ellas, la tabla queda dentro de un bloque de HTML crudo, el analizador deja todo el bloque en paz, y tus barras llegan a la página literalmente. Y el envoltorio solo ayuda donde controlas el CSS. En un archivo HTML independiente, si una tabla ancha hace scroll o se desborda lo decide la hoja de estilos que trae tu conversor.

## Cómo elegir la forma de tu tabla

1. **Cuenta las columnas antes de escribir la fila de encabezado.** El número al que te comprometes en la fila separadora es el que toda fila tendrá que respetar desde entonces, y añadir una después significa editar cada línea — así que decide una vez, mientras la tabla todavía tiene tres líneas.
2. **Decide si los datos se escriben o se generan.** La prosa pertenece a una tabla escrita a mano. Las filas que vienen de una hoja de cálculo o de una API pertenecen a una generada, porque una persona reescribiendo cuarenta filas de barras se equivocará en al menos una, y el error será silencioso.
3. **Pregúntate si alguna celda necesitará una segunda línea.** Si la respuesta es sí, te estás comprometiendo con `<br>` y con un sanitizador que lo conserve. Si más de una celda lo necesita, la tabla es el contenedor equivocado, y la respuesta correcta es una tabla corta más secciones.
4. **Comprueba el analizador del otro extremo antes de confiar en una tabla.** Un archivo que se muestra bien en GitHub y se rompe en una compilación suele estar encontrándose con un analizador más estricto y con las tablas apagadas, y prefieres descubrirlo en un archivo de prueba y no en un documento ya publicado.
5. **Convierte una vez y lee el HTML, no la vista previa.** Una vista previa construida sobre el mismo analizador que tu editor coincide con tu editor por construcción. El elemento `<table>` del resultado es la única prueba, y un `<th>` que falte ahí te dice qué línea arreglar.

## Conclusión

Las tablas Markdown son fragiles de una forma muy concreta: fallan por completo en vez de a medias, y fallan sin decirlo, lo que las hace parecer impredecibles cuando no lo son. La fila separadora tiene que coincidir con el número de celdas del encabezado, el bloque necesita una línea en blanco en cada lado, una barra literal necesita una barra invertida, un salto de línea necesita `<br>`, y toda la función necesita un analizador que implemente GFM. Acierta esas cinco cosas y una tabla sobrevive a cualquier conversión por la que la hagas pasar. Toma la tabla más ancha y más escapada que tengas, pásala por [TransformPipe](https://transformpipe.com), y lee el origen HTML junto a la vista previa: una columna que falta significa que los guiones están mal contados, y una celda partida en dos significa una barra que no escapaste.

## Preguntas frecuentes

### ¿Por qué no se muestra en absoluto mi tabla Markdown?

Nueve de cada diez veces la fila separadora está mal: falta, está en la línea equivocada, o tiene un número de celdas distinto al del encabezado. Cuenta las celdas de la primera línea y las de la segunda y hazlas iguales. Si ya coinciden, comprueba si falta una línea en blanco antes de la tabla, y si hay una raya donde escribiste tres guiones.

### ¿Necesito una línea en blanco antes de una tabla Markdown?

Sí, en la práctica. Los analizadores no se ponen de acuerdo sobre si una tabla puede interrumpir un párrafo, así que una tabla escrita justo debajo de una línea de prosa se muestra en algunas herramientas y queda absorbida por el párrafo en otras. Una línea en blanco antes de la fila de encabezado y otra después de la última fila de cuerpo elimina el desacuerdo.

### ¿Cómo pongo un salto de línea dentro de una celda de una tabla Markdown?

Con `<br>`, escrito en línea justo donde va el salto. No hay sintaxis Markdown para ello, porque una fila de tabla termina al final de la línea, y dos espacios finales no hacen nada dentro de una celda. Que la etiqueta sobreviva depende del sanitizador de tu conversor, no de su analizador.

### ¿Cómo escapo una barra vertical en una tabla Markdown?

Escribe `\|`. Funciona en texto normal de celda y dentro de comillas de código, así que `` `a \| b` `` te da una comilla de código que contiene una barra. En el destino de un enlace, codifícala por porcentaje como `%7C` en su lugar, ya que el escape dentro de URLs se maneja de forma menos consistente entre analizadores.

### ¿Cómo alineo una columna en una tabla Markdown?

Pon dos puntos en la fila separadora: `:---` para la izquierda, `:---:` para el centro, `---:` para la derecha. La alineación se aplica a toda la columna incluido el encabezado, y no hay forma de alinear una sola celda. Lo que emita el renderizador — un atributo `align` o un estilo `text-align` — varía, y ambos se ven igual en un navegador.

### ¿Las tablas forman parte del Markdown estándar?

No. Las tablas no están ni en el Markdown original ni en CommonMark; vienen de extensiones, y la versión de GitHub Flavored Markdown es la que implementa la mayoría de las herramientas. Un analizador CommonMark estricto muestra tu tabla como un párrafo de barras verticales, y se comporta correctamente al hacerlo.

### ¿Qué hago con una tabla Markdown demasiado ancha?

Corta una columna, acorta los encabezados o gírala — eso arregla tanto el origen como la página. Si los datos realmente necesitan el ancho, envuelve la tabla en un `<div>` al que tu hoja de estilos le dé `overflow-x: auto`, recordando las líneas en blanco dentro del envoltorio, y acepta que el envoltorio solo ayuda donde controlas el CSS.
