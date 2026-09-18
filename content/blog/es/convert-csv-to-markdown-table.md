---
title: "Cómo convertir un CSV en una tabla Markdown sin romper los datos"
description: "Convierte un CSV en una tabla Markdown y evita las trampas: comas entre comillas, comillas dobles, saltos de línea, barras, punto y coma, BOM y cabecera ausente"
date: 2026-09-03
tag: Conversión
keywords: csv a tabla markdown, convertir csv a markdown, conversor de csv a tabla markdown, tsv a tabla markdown, csv con comillas a markdown, tabla markdown desde hoja de cálculo, csv con punto y coma a markdown
---

### Resumen

Convertir un CSV en una tabla Markdown son dos líneas de trabajo —una fila de cabecera, una fila
separadora de guiones, y una fila por línea— y unas nueve formas de hacerlo mal en silencio. Todos
los fallos vienen del mismo sitio: un CSV no es un archivo con comas dentro, es un formato con
comillas y con reglas, y un conversor que separa por comas produce una tabla que se ve bien y dice
algo distinto del archivo. Usa una herramienta con un analizador de CSV real, escapa las barras
verticales como `\|` al escribir la salida, sustituye los saltos de línea dentro de una celda por
`<br>` porque una tabla Markdown no puede contener un salto de línea, y añade una fila de cabecera
antes de convertir si tu archivo no tiene ninguna. Luego revisa una fila difícil de la salida, no
las primeras tres.

La mecánica es trivial. Eso es lo que hace peligroso este trabajo: como la salida siempre parece
una tabla plausible, nada te avisa cuando un valor se ha movido una columna a la izquierda, cuando
un nombre ha perdido su coma, o cuando una fila ha perdido en silencio su último campo. La tabla se
renderiza. Los datos están mal. Nadie se da cuenta hasta que alguien lee un número en voz alta en
una reunión.

La mayor parte del problema llega de las hojas de cálculo. Un CSV escrito por un programa y leído
por un programa suele estar limpio, porque los dos extremos implementaron las mismas reglas. Un CSV
que una persona exportó desde Excel, Numbers o un CRM contiene direcciones con saltos de línea
dentro, notas con comillas, una cabecera de la primera columna con un byte invisible pegado, y
—según dónde cree la máquina que está— puntos y coma donde esperabas comas.

Este artículo es el procedimiento y las trampas. El procedimiento se hace en un minuto. Las trampas
son el artículo, y están en el orden en que muerden: primero el entrecomillado, porque cambia lo que
significa siquiera una fila, luego el escapado al escribir la salida, y luego los problemas a nivel
de archivo que impiden que la conversión llegue a parecer una tabla en absoluto.

## Cómo convertir un CSV en una tabla Markdown

El formato de destino es fijo y pequeño. Una tabla de GitHub Flavored Markdown es una línea de
cabecera, una línea delimitadora de guiones, y una línea por fila, con las celdas separadas por
barras verticales:

```markdown
| id | name | role |
| --- | --- | --- |
| 1 | Ann Rowe | Ops |
| 2 | Li Wei | Sales |
```

Las barras verticales inicial y final son opcionales en la especificación y merece la pena
escribirlas de todos modos, porque hacen inequívoca una celda que empieza con un espacio y se leen
mejor en un diff. La línea delimitadora no es decorativa: es la línea que le dice al analizador que
el bloque de arriba es una cabecera y no un párrafo, y tiene que tener el mismo número de celdas
que la cabecera. Si te equivocas ahí, te queda un párrafo lleno de barras verticales. El resto de lo
que el formato puede y no puede hacer está en
[el artículo sobre las propias tablas de Markdown](/blog/markdown-tables-that-survive-conversion);
este artículo trata de meter tus filas en esa forma sin perder ninguna.

Aquí está el procedimiento completo.

1. **Abre primero el archivo en un editor de texto, no en una hoja de cálculo.** Una hoja de
   cálculo te mostrará su propia interpretación del archivo, que es exactamente lo que estás
   intentando comprobar. Un editor de texto te muestra los bytes: si el delimitador es una coma, si
   los campos van entre comillas, si hay una línea de cabecera, y si algún registro ocupa más de una
   línea. Treinta segundos aquí ahorran el resto.
2. **Confirma el delimitador.** Las comas son lo habitual y no la regla. Si la primera línea dice
   `id;name;role`, tienes un archivo de punto y coma y cualquier herramienta basada en comas te va
   a dar una celda por fila.
3. **Confirma que hay una fila de cabecera.** Si la primera línea son datos, añade una línea de
   cabecera antes de convertir. Una tabla Markdown no puede existir sin una, y toda respuesta
   automática a una cabecera que falta pierde algo.
4. **Convierte con algo que analice en lugar de partir.** Eso significa un lector de CSV — un
   conversor en el navegador, una biblioteca, o una herramienta de línea de comandos hecha para
   datos tabulares. Un `cut -d,` o un `split(',')` es el instrumento equivocado y el daño que hace
   es invisible en la salida.
5. **Revisa el escapado al escribir la salida.** Las barras verticales en los valores tienen que
   convertirse en `\|`. Los saltos de línea dentro de una celda tienen que convertirse en `<br>` o
   en un espacio. Las comillas dobles tienen que haberse reducido a comillas simples.
6. **Mira la fila más difícil, no la primera.** Encuentra la fila que tenga una coma entre
   comillas, un apóstrofo, una comilla o una ruta de archivo, y lee esa fila en la salida contra la
   misma fila en el origen.

Para hacer concreto el sexto punto, aquí hay un archivo pequeño que lleva cinco de las trampas a la
vez. Guarda algo parecido; es la única prueba que importa.

```csv
id,name,role,notes
1,"Smith, John",Sales,"Joined 2019
Moved from Support"
2,"O""Brien, Ann",Ops,"Owns the a|b routing rule"
3,Li Wei,Support,"Said ""no"" twice"
```

Cuatro registros, no cinco, porque el registro 1 contiene un salto de línea dentro de un campo entre
comillas. Una conversión correcta produce esto:

```markdown
| id | name | role | notes |
| --- | --- | --- | --- |
| 1 | Smith, John | Sales | Joined 2019<br>Moved from Support |
| 2 | O"Brien, Ann | Ops | Owns the a\|b routing rule |
| 3 | Li Wei | Support | Said "no" twice |
```

Cada diferencia entre esa salida y el origen es deliberada: las comillas alrededor de los campos
han desaparecido porque eran sintaxis, las comillas dobles se han reducido a simples, el salto de
línea se ha convertido en `<br>`, y la barra vertical se ha escapado. Nada ha cambiado de columna.

Una separación ingenua por comas produce esto en su lugar, y esta es la parte que merece la pena
mirar con atención:

```markdown
| id | name | role | notes |
| --- | --- | --- | --- |
| 1 | "Smith | John" | Sales |
| Moved from Support" | | | |
| 2 | "O""Brien | Ann" | Ops |
| 3 | Li Wei | Support | "Said ""no"" twice" |
```

El puesto de John ahora es su apellido. El campo de notas ha desaparecido por completo de la fila 1,
porque Markdown descarta las celdas que sobran del número de la cabecera y `"Joined 2019` era la
quinta. La línea de continuación se ha convertido en su propia fila. Ann tiene el mismo problema más
comillas dobles visibles. Solo la fila 3 sobrevivió, y sobrevivió porque era aburrida. La tabla se
renderiza perfectamente.

## La hoja de trucos: cada trampa en una sola tabla

| Trampa | En el CSV | Qué hace una separación ingenua | Qué hace una conversión correcta |
| --- | --- | --- | --- |
| Campo entre comillas | `"Sales"` | Conserva las comillas como caracteres | Las quita; eran sintaxis |
| Coma dentro de comillas | `"Smith, John"` | Dos celdas; la fila gana una columna; se descarta el último valor | Una celda que contiene la coma |
| Comilla doble | `"Said ""no"""` | Deja `""no""` visible en la celda | Lo reduce a `"no"` |
| Salto de línea dentro de una celda | un campo entre comillas que ocupa dos líneas | Divide el registro en dos filas mal formadas | Sustituye el salto por `<br>` o un espacio |
| Barra vertical en un valor | una barra vertical suelta dentro de un campo | Añade una columna fantasma a esa fila | La escapa como `a\|b` |
| Sin fila de cabecera | la primera línea son datos | Promociona los datos a cabeceras, en silencio | Añades una línea de cabecera antes de convertir |
| Delimitador de punto y coma | `id;name;role` | Una celda por fila, la línea entera dentro | Lee el archivo con `;` como delimitador |
| Delimitador de tabulación | `id<TAB>name` | Una celda por fila | Lo lee como TSV |
| BOM de Excel | `EF BB BF` invisible antes de `id` | Se pega a la primera cabecera; las comparaciones fallan | Lo quita, o lee como `utf-8-sig` |
| Fin de línea CRLF | cada línea termina en `\r\n` | Deja un `\r` suelto en el último campo de cada fila | Lo gestiona el lector; nada visible |
| Filas desiguales | una fila más corta que la cabecera | La fila corta se rellena en silencio, la larga se recorta | Lo mismo, pero te avisaron, o lo comprobaste |
| Alineación | nada en el archivo la expresa | Todas las columnas alineadas a la izquierda | Dos puntos en la fila delimitadora, elegidos por ti |

El patrón de esa tabla merece nombrarse. Más o menos la mitad de estos fallos son ruidosos — un
archivo de punto y coma se convierte en una sola columna y lo ves de inmediato. La otra mitad son
silenciosos, y cada uno silencioso tiene que ver con el entrecomillado. Por eso la comprobación es
una fila difícil y no un vistazo a la salida.

## Del síntoma a la causa: qué ves y qué lo causó

Recorre esta tabla cuando una conversión ya haya salido mal. El síntoma es lo que notaste; la causa
es lo que hay que arreglar en el origen o en la herramienta.

| Síntoma | Causa | Solución |
| --- | --- | --- |
| Cada fila es una sola celda que contiene toda la línea | El delimitador es un punto y coma o una tabulación, y la herramienta asumió una coma | Fija el delimitador, o usa una herramienta que lo detecte |
| Un valor se ha movido a la siguiente columna, los valores posteriores se han desplazado a la izquierda | Una coma dentro de un campo entre comillas se trató como separador | Usa un analizador de CSV real |
| Falta el último valor de una fila | La misma causa: la fila se hizo más ancha que la cabecera, y GFM descarta las celdas de más | Usa un analizador de CSV real |
| Aparecen comillas alrededor de los valores en la tabla | Las comillas se trataron como caracteres en vez de como sintaxis | Usa un analizador de CSV real |
| Aparece `""` dentro de una celda | El escape de comilla doble no se colapsó | Usa un analizador de CSV real |
| Una fila aparece dos veces, la segunda mal formada y corta | Un campo entre comillas contenía un salto de línea y el registro se dividió por ahí | Convierte con un analizador que lea registros de varias líneas |
| Dos frases se han quedado pegadas sin espacio | Un salto de línea dentro de la celda se eliminó en vez de sustituirse | Sustitúyelo por `<br>`, o por un espacio |
| Aparece `<br>` como texto literal en la salida | El Markdown se está leyendo como texto plano, no se está renderizando como HTML | Usa un espacio en su lugar, o renderiza el Markdown |
| Una fila tiene una columna más que las demás | Una barra vertical sin escapar dentro de un valor | Escápala como `\|` |
| La cabecera de la primera columna no coincide con nada contra lo que la comparas | Tiene un byte order mark pegado | Lee el archivo como `utf-8-sig`, o quita el BOM |
| Los caracteres acentuados salen como mojibake | El archivo no está en la codificación que asumió el lector — a menudo Windows-1252 leído como UTF-8 | Convierte la codificación antes de analizar |
| Todo el bloque se renderiza como un párrafo de barras verticales | Falta la fila delimitadora, está mal formada, o tiene el número equivocado de celdas | Arregla la fila delimitadora |
| La tabla se renderiza pero la cabecera es tu primera fila de datos | El archivo no tenía cabecera y la herramienta promocionó la fila uno | Añade una línea de cabecera al origen |
| Aparece un `\r` final al final de la última celda de cada fila | Los finales de línea CRLF se dividieron solo por `\n` | Usa un lector que gestione CRLF |
| Los números salen como `0.4567` donde la hoja mostraba `45.67%` | La exportación escribió el valor, no el formato de visualización | Arregla la exportación, o la columna, antes de convertir |

## El entrecomillado: comas, comillas dobles y saltos de línea

Todo en esta sección viene de una regla del RFC 4180: un campo puede ir entre comillas dobles, y
dentro de esas comillas una coma es dato, un salto de línea es dato, y una comilla doble se escribe
como dos comillas dobles. Tres frases. Cada fallo silencioso en una conversión de CSV es una
herramienta que no implementó una de ellas.

### Una coma dentro de un campo entre comillas

`"Smith, John",Sales,2026` son tres campos. Un analizador lee la comilla de apertura, consume todo
hasta la comilla de cierre, y te entrega `Smith, John` como un solo valor. Una separación por comas
te entrega cuatro, y ahora la fila es una columna más ancha que su cabecera.

Este es el fallo que cuesta datos y no solo apariencia. La regla de tabla de GFM es que una fila con
más celdas que la cabecera pierde las celdas de sobra, así que la fila ensanchada no da error, no
avisa, y no se desborda — descarta su último valor y desplaza todo lo que sigue al campo culpable
una columna hacia la izquierda. Los nombres, las direcciones, los cargos y las notas de texto libre
son donde vive esto. Si una columna puede contener una coma, esta trampa se aplica a ella.

### Una comilla doble significa una comilla

Dentro de un campo entre comillas, `""` es una `"` literal. Así que `"She said ""no""."` es un solo
campo que dice: She said "no". Una herramienta que quita las comillas por patrón en vez de por
análisis deja los pares atrás y obtienes `She said ""no""` en la celda.

Esto es cosmético hasta que deja de serlo. En una columna de prosa, las comillas dobles son feas. En
una columna de medidas en pulgadas, de muestras de código, o de fragmentos JSON, cambian el valor.
Una celda que dice `{"id": 1}` que llega como `{""id"": 1}` ya no es JSON válido, y si alguien la
copia después de tu documento se pasará diez minutos con ella.

### Un salto de línea dentro de una celda

Esta es la trampa sin respuesta limpia, y merece la pena entenderla en vez de esquivarla.

El RFC 4180 permite un salto de línea dentro de un campo entre comillas, y las hojas de cálculo los
producen constantemente, porque Alt+Intro dentro de una celda es como la gente escribe bloques de
dirección y notas. Una tabla Markdown no tiene forma de representar eso. El formato está basado en
líneas: una fila por línea, sin sintaxis de continuación, sin escape para un salto de línea. Lo que
haga el conversor aquí, está elegido entre dos mentiras.

```csv
id,address
1,"12 Mill Lane
Bristol
BS1 4AA"
```

Las tres formas en que eso puede acabar en una tabla Markdown:

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane<br>Bristol<br>BS1 4AA |
```

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane Bristol BS1 4AA |
```

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane |
| Bristol | |
| BS1 4AA" | |
```

La primera conserva la estructura y mete una etiqueta HTML en tu Markdown. La segunda mantiene el
Markdown limpio y pierde la estructura, y si la herramienta une sin espacio obtienes
`12 Mill LaneBristol`. La tercera es lo que hace un separador ingenuo y sencillamente está rota.
Prefiere la primera cuando el Markdown se vaya a renderizar como HTML, que es el caso habitual, y
la segunda cuando no — un README de texto plano leído en una terminal, un mensaje de commit, un
mensaje de chat en un cliente que no renderiza HTML dentro de tablas. Por qué Markdown no tiene una
mejor opción disponible dentro de una tabla es consecuencia de
[cómo funcionan los saltos de línea en Markdown en general](/blog/markdown-line-breaks-and-lists): el
salto de dos espacios y el salto con barra invertida son construcciones en línea, y una fila de
tabla termina en el salto de línea sin importar eso.

Si tus datos tienen saltos de línea en una columna y la estructura importa, la respuesta honesta a
veces es que esa columna no debería estar en la tabla. Muévela debajo como una lista de
definiciones, o enlaza al origen.

## El escapado al salir: barras verticales, barras invertidas y alineación

Analizar bien el CSV deja los valores correctos. Escribir bien el Markdown los mantiene correctos.
Hay tres cosas que hacer al salir, y una de ellas es el error más común en los conversores hechos en
casa.

### La barra vertical

A CSV no le importan las barras verticales. A Markdown le importan enormemente: una `|` sin escapar
termina la celda donde sea que aparezca. Tiene que escribirse `\|`.

El detalle que la gente pasa por alto es que las comillas invertidas no la protegen. Una barra
vertical dentro de un tramo de código en línea dentro de una celda de tabla sigue terminando la
celda — la tabla se analiza en celdas antes de que se mire la sintaxis en línea, así que `` `a|b` ``
se convierte en dos celdas, la primera con un tramo de código sin terminar. La especificación de GFM
es explícita en que el escape es obligatorio incluso dentro de otros tramos en línea. No hay otro
mecanismo.

```csv
pattern,meaning
"^(a|b)$","a or b, anchored"
```

```markdown
| pattern | meaning |
| --- | --- |
| `^(a\|b)$` | a or b, anchored |
```

Dónde aparece esto: rutas de archivo en ejemplos de shell, expresiones regulares, tuberías de
shell, opciones enumeradas en una columna de documentación, y cualquier columna que contenga
`yes|no|maybe`. Los conversores escritos y probados contra nombres y números nunca se topan con
esto. Si estás evaluando una herramienta, pon una barra vertical en una celda de prueba
deliberadamente.

### La barra invertida

Menos común y merece la pena conocerla. Un valor que termina en barra invertida, o que contiene una
secuencia como `\n` como texto literal, puede interactuar con el propio escapado de Markdown — `\|`
es una barra vertical escapada, así que un valor que legítimamente termina en `...\` seguido de un
delimitador de barra vertical produce algo ambiguo. Un escritor cuidadoso escapa las barras
invertidas como `\\` en el contenido de la celda. La mayoría de los conversores no lo hacen, y la
mayoría de los datos nunca lo activan. Compruébalo solo si tus columnas llevan rutas de Windows o
código.

### Los dos puntos de alineación

Nada en un CSV expresa la alineación. La columna de números alineados a la derecha de una hoja de
cálculo es una propiedad de visualización de la hoja, y no sobrevive a la exportación, y mucho menos
a la conversión. Markdown te da tres opciones por columna, fijadas con dos puntos en la fila
delimitadora, y aplicarlas es una decisión que tomas después de la conversión:

```markdown
| Item | Qty | Price |
| :--- | ---: | ---: |
| Widget | 12 | 4.50 |
| Flange | 3 | 12.00 |
```

`:---` es izquierda, `---:` es derecha, `:---:` es centro, y un `---` a secas se lo deja al
renderizador, que en la práctica significa izquierda. Alinea a la derecha las columnas numéricas;
es la única edición manual que mejora de forma fiable una tabla convertida, porque una columna de
cifras alineadas a la derecha se puede comparar a ojo y una alineada a la izquierda no. Ten en
cuenta que muchos conversores emiten guiones a secas y te dejan esto a ti, y que los dos puntos son
el único formato de columna que tiene el formato — sin anchos, sin colores, sin alineación por
celda.

### El relleno, y por qué no importa

Algunas herramientas rellenan cada celda para que las barras verticales queden alineadas en el
origen. No tiene ningún efecto en absoluto sobre la salida renderizada; es puramente para quien lea
el Markdown como texto. El relleno hace que una tabla ancha sea agradable de leer en un editor y
horrible de comparar en un diff, porque cambiar un valor reescribe cada línea del bloque. Para una
tabla que vive en un repositorio y se edita, sin relleno es la mejor opción. Para una tabla que
alguien va a leer en texto plano, rellénala.

## La fila de cabecera, el delimitador y los bytes que no puedes ver

Estos tres son problemas a nivel de archivo. Suelen ser ruidosos, y todos se arreglan antes de la
conversión, no después.

### Un archivo sin fila de cabecera

Los CSV generados por máquina a menudo no tienen cabecera: una exportación de registro, un volcado
de base de datos, un feed de sensores, una respuesta paginada de una API escrita directamente a
disco. Una tabla Markdown no puede existir sin una cabecera, porque la fila delimitadora de debajo
es lo que identifica el bloque como tabla siquiera.

Así que cada conversor hace una de estas tres cosas, y ninguna es buena:

| Comportamiento | Resultado |
| --- | --- |
| Promocionar la primera fila de datos | Pierdes los datos de esa fila, y las cabeceras no significan nada |
| Generar nombres de marcador | `a, b, c` o `Column 1, Column 2` — la tabla se lee pero no dice nada |
| Negarse a convertir | Honesto, y raro |

La mayoría de las herramientas toman la primera opción en silencio, por eso un archivo de registro
convertido tan a menudo tiene una marca de tiempo donde debería ir el nombre de la columna. La
solución es una línea en un editor de texto: añade una cabecera. Sabes qué son las columnas, y
ninguna respuesta automática a esto produce jamás una tabla que alguien pueda leer dentro de seis
meses.

### Punto y coma, tabulaciones y otros delimitadores

Un archivo `.csv` no es necesariamente separado por comas. En regiones donde la coma es el separador
decimal, una hoja de cálculo que exporta CSV usa el separador de lista de la configuración regional
del sistema, que suele ser un punto y coma — y el archivo sigue teniendo la extensión `.csv`. Esta
es la causa más frecuente de «el conversor produjo una sola columna».

```csv
id;name;price
1;Widget;4,50
```

Fíjate en el segundo problema de ese archivo: `4,50` es cuatro con cincuenta, escrito en una región
que usa la coma como punto decimal. Convertir el delimitador no convierte los números. Si esos
valores van a ir a una tabla que la gente va a leer, decide si hay que normalizarlos primero, porque
una tabla mixta de `4,50` y `12.00` es peor que cualquiera de los dos por separado.

Los valores separados por tabulación son el mismo formato con otro separador, y son más fáciles de
manejar sin sobresaltos por una razón: las tabulaciones casi nunca aparecen dentro de los valores,
así que los problemas de entrecomillado casi se evaporan. Por eso también copiar un rango de una
hoja de cálculo y pegarlo suele funcionar mejor que exportar un CSV — el portapapeles lleva texto
separado por tabulaciones.

| Delimitador | De dónde viene | Qué hacer |
| --- | --- | --- |
| Coma | Lo habitual, y la mayoría de las exportaciones programáticas | Nada |
| Punto y coma | Exportaciones de hoja de cálculo en regiones con coma decimal | Fija el delimitador; comprueba también el separador decimal |
| Tabulación | `.tsv`, `.tab`, y cualquier cosa pegada desde una hoja de cálculo | Léelo como TSV |
| Barra vertical | Algunas exportaciones de bases de datos y de mainframe | Fija el delimitador, y recuerda que ahora cada valor necesita escapado en la salida |
| Ancho fijo | Informes heredados | No es CSV en absoluto; necesita primero un analizador por posición de columna |

Una fuente separada por barras verticales merece un momento de reflexión, porque el delimitador y la
sintaxis de salida son ahora el mismo carácter. Analízalo como separado por barras verticales, y
luego escapa cualquier barra vertical que estuviera dentro de los valores. Una herramienta que lo
lea como CSV producirá una tabla que se ve correcta y está mal en cada fila que tuviera una barra
vertical en sus datos.

### Los bytes antes del primer campo

Dos cosas invisibles viajan con los archivos escritos en Windows o exportados desde Excel.

Un **byte order mark** —los bytes `EF BB BF`— puede estar al principio mismo de un archivo UTF-8.
Excel escribe uno cuando eliges su formato de guardado `CSV UTF-8`, y está ahí para el beneficio de
programas que de otro modo tendrían que adivinar la codificación. Tu lector de CSV puede quitarlo o
no. Si no lo hace, la marca se pega a la cabecera de tu primera columna, donde es invisible en
cualquier editor y rompe toda comparación contra esa cabecera. Obtienes una cabecera que parece
`id`, no es igual a `id`, y no se puede explicar mirándola.

```python
# Lee el BOM y lo descarta si está presente.
with open('data.csv', newline='', encoding='utf-8-sig') as handle:
    rows = list(csv.reader(handle))
```

```bash
# Quita un BOM UTF-8 solo de la primera línea.
sed '1s/^\xEF\xBB\xBF//' data.csv > clean.csv
```

Los **finales de línea CRLF** son la otra cosa. El RFC 4180 de hecho especifica CRLF como separador
de registro, así que un CSV bien formado los tiene y un lector tiene que saber gestionarlos. Una
herramienta que divide solo por `\n` deja un retorno de carro pegado al último campo de cada fila,
lo cual es invisible hasta que comparas un valor o lo pegas en algo que muestre caracteres de
control.

La codificación es el tercer problema a nivel de archivo y el más ruidoso de los tres. Un CSV no
lleva ninguna declaración de su propia codificación. Un archivo guardado como Windows-1252 y leído
como UTF-8 te da mojibake en cada nombre acentuado; leído como UTF-8 cuando en realidad es UTF-16
puede que ni se analice. Convierte el archivo antes de convertir la tabla:

```bash
iconv -f WINDOWS-1252 -t UTF-8 data.csv > data-utf8.csv
```

Ninguno de estos tres es difícil. Los tres son invisibles, y los tres los gestiona un lector
adecuado y ninguno de los atajos de una sola línea a los que la gente recurre primero.

## Dónde una tabla Markdown es la respuesta equivocada

La sección honesta. Parte de lo que guarda una hoja de cálculo no tiene equivalente en Markdown, y
ningún conversor lo arregla, porque la limitación está en el formato y no en la herramienta. Saber
cuáles son esas partes te ahorra buscar una herramienta mejor.

**Las celdas combinadas.** No hay colspan ni rowspan. Una cabecera que ocupa tres columnas en la
hoja tiene que convertirse en una sola cabecera con dos vecinas vacías, o en tres cabeceras
repetidas. Si el origen depende de celdas combinadas para expresar su estructura, la tabla necesita
rediseñarse antes de convertirse.

**Las cabeceras anidadas o agrupadas.** Dos filas de cabecera —un grupo arriba, subcolumnas
debajo— es una forma habitual en las hojas de cálculo e imposible en Markdown, que tiene exactamente
una fila de cabecera. Aplánala en nombres compuestos como `2025 Q1` y `2025 Q2`, o usa HTML crudo, y
en ese punto ya no estás escribiendo una tabla Markdown.

**Cualquier cosa ancha.** Las tablas Markdown no ajustan ni se desplazan por sí solas. Doce columnas
de prosa se convierten en una tabla más ancha que la página, y lo que pasa después depende de
quien la renderice: desbordamiento, un apretón, o una barra de desplazamiento si el HTML alrededor
la proporciona. Recorta columnas antes de convertir, o transpón para que las filas se conviertan en
columnas, o acepta que se va a leer en una pantalla ancha.

**Cualquier cosa larga.** Una tabla de mil filas en un documento no es una tabla, es un volcado de
datos con bordes. No hay paginación ni orden. Por encima de unas cincuenta filas, lo útil es una
tabla resumen más un enlace al CSV.

**Cualquier cosa interactiva.** Sin ordenar, sin filtrar, sin una fila de totales que recalcule, sin
formato condicional. Si quien lea necesita interrogar los números en vez de leerlos, la tabla es el
artefacto equivocado.

**Las fórmulas y los formatos.** Estos ya han desaparecido antes de que el conversor vea el archivo.
Una exportación CSV contiene valores, y los símbolos de moneda, los separadores de miles, los
porcentajes y los formatos de fecha son propiedades de visualización que el exportador escribió o
no. Si la tabla muestra `0.4567` donde la hoja mostraba `45.67%`, eso lo hizo la exportación.

También hay costes propios de cada ruta. Un conversor en el navegador hace el trabajo en tu propia
máquina, por eso no se sube nada, y ese mismo hecho significa que un archivo muy grande está
limitado por la máquina y la pestaña: TransformPipe limita una conversión a 10 MB, y un documento
guardado con un enlace compartible a 4 MB, porque la función que lo almacena rechaza un cuerpo de
petición más grande. Una herramienta de línea de comandos no tiene ese techo y sí exige una
instalación y a alguien que recuerde los indicadores. Un plugin de hoja de cálculo es cómodo y ata
el trabajo a la aplicación. Ninguno de estos es un defecto; son la forma de cada ruta, y la
comparación de las rutas en sí es el tema de
[la comparativa de conversores de CSV a Markdown](/blog/best-csv-to-markdown-converters).

Un coste más que merece la pena nombrar: el dialecto. Las tablas no están en CommonMark. Son una
extensión de GitHub Flavored Markdown, así que un renderizador estrictamente conforme con CommonMark
muestra tu tabla convertida como un párrafo lleno de barras verticales. Antes de convertir cien
filas, confirma que lo que sea que vaya a renderizar el resultado admite tablas siquiera —
[los dialectos difieren exactamente en esto](/blog/commonmark-gfm-and-the-flavours), y es lo primero
que hay que comprobar y no lo último.

## Cómo elegir una ruta

1. **Empieza por si las filas pueden salir de tu máquina.** Los datos públicos convierten esto en
   una no-pregunta. Nombres, sueldos, identificadores de pacientes o cifras sin publicar la
   convierten en la única pregunta, y elimina todo conversor alojado que suba archivos. La
   conversión en el navegador y las herramientas locales de línea de comandos son las dos
   respuestas, y la diferencia entre ellas no aparece en ninguna lista de funciones.
2. **Cuenta cuántas veces vas a hacer esto.** Una vez es soltar un archivo y pegar. Cada semana es
   un script, y un script significa una herramienta de línea de comandos o una llamada a una
   biblioteca — porque la parte de un proceso semanal que se olvida siempre es la persona que
   tenía que abrir una pestaña del navegador.
3. **Comprueba si necesitas remodelar además de convertir.** Si la respuesta incluye seleccionar
   columnas, filtrar filas u ordenar, elige una herramienta que haga trabajo de datos y termine
   emitiendo Markdown. Borrar filas a mano de una tabla Markdown terminada es la ruta más lenta
   posible y la que introduce errores de transcripción.
4. **Prueba con tu peor fila, no con una muestra.** Toma la fila que tenga la coma entre comillas,
   la comilla y la barra vertical, convierte, y lee la salida contra el origen. Una herramienta que
   sobreviva a esa fila sobrevivirá al archivo; una que falle en ella falla en silencio y todo lo
   demás sobre ella es irrelevante.
5. **Decide qué hacer con los saltos de línea dentro de la celda antes de convertir, no después.**
   Si la salida se va a renderizar como HTML, `<br>` es correcto. Si se va a leer como texto plano,
   un espacio es correcto. La herramienta ya ha elegido por ti, así que averigua cuál y elige una
   que esté de acuerdo, porque arreglarlo después significa editar cada celda afectada.
6. **Mira el archivo en busca de una fila de cabecera antes de que decida la herramienta.** Diez
   segundos en un editor de texto, una línea escrita si falta. Este es el único punto de la lista
   que es gratis.

## Conclusión

La conversión en sí es una cabecera, una fila de guiones y una línea por registro, y podrías hacerla
a mano. Si las filas todavía están en una hoja de cálculo y no en un archivo,
[empieza por ahí en su lugar](/blog/convert-excel-to-markdown-table). Lo que no puedes hacer a
mano —de forma fiable, a cualquier volumen— es respetar las reglas de entrecomillado, y de ahí viene
cada fallo silencioso. Cualquier cosa que lea el archivo como un CSV en vez de como texto con comas
dentro va a acertar las comas, las comillas dobles y los registros de varias líneas; luego solo
tiene que escapar las barras verticales y decidir qué hacer con los saltos de línea en las celdas.
Si quieres que eso se haga en el navegador sin subir nada,
[la conversión de CSV a tabla Markdown de TransformPipe](/csv-to-markdown) hace el análisis RFC 4180,
escapa las barras verticales, convierte los saltos de línea dentro de la celda en `<br>` y gestiona
el BOM, gratis y sin instalar nada. Si lo quieres en un script, usa una herramienta hecha para datos
tabulares. En cualquier caso, guarda un archivo de prueba de cuatro filas con una coma entre
comillas, una comilla doble, un salto de línea incrustado y una barra vertical, y pasa por él
cualquier herramienta nueva antes de fiarle tus filas reales.

## Preguntas frecuentes

### ¿Cómo convierto un CSV en una tabla Markdown?

Escribe los nombres de las columnas como una línea de cabecera separada por barras verticales,
añade una línea delimitadora de celdas `| --- |` con una celda por columna, y luego escribe una
línea por registro con los valores separados por barras verticales. Hazlo con una herramienta que
analice el CSV de verdad en lugar de separar por comas, y escapa cualquier barra vertical de los
valores como `\|`.

### ¿Por qué mi CSV se convirtió en una sola columna?

Porque el archivo no está delimitado por comas. Las exportaciones de hojas de cálculo en regiones
que usan la coma como separador decimal suelen estar delimitadas por punto y coma y seguir
llamándose `.csv`, y los archivos TSV están delimitados por tabulación. Abre la primera línea en un
editor de texto, mira qué separa las cabeceras, y dile a la herramienta cuál es.

### ¿Puede una celda de tabla Markdown contener un salto de línea?

No. El formato es una fila por línea sin sintaxis de continuación, así que un salto de línea real
termina la fila. Un campo de CSV que contiene un salto de línea tiene que convertirse en `<br>`, que
se renderiza como un corte una vez que el Markdown se convierte en HTML, o aplanarse en un espacio.
El conversor elige una de las dos, así que averigua cuál.

### ¿Qué pasa con una coma dentro de un campo entre comillas?

Con un analizador real, nada: las comillas se consumen como sintaxis y la coma se queda dentro de
la celda. Con una separación por comas, el campo se convierte en dos celdas, la fila se hace más
ancha que la cabecera, y como Markdown descarta las celdas que sobran del número de la cabecera, el
valor al final de esa fila desaparece sin ningún aviso.

### ¿Cómo pongo un carácter de barra vertical en una celda de tabla Markdown?

Escápalo como `\|`. Ese es el único mecanismo, y se aplica también dentro de los tramos de código
en línea — las comillas invertidas no protegen una barra vertical, porque la fila se divide en
celdas antes de analizar la sintaxis en línea. Un conversor que no escapa las barras verticales
añadirá una columna fantasma a cada fila que contenga una.

### Mi CSV no tiene fila de cabecera. ¿Y ahora qué?

Añade una antes de convertir. Una tabla Markdown no puede existir sin una cabecera, así que un
conversor o promocionará tu primera fila de datos —perdiéndola— o inventará nombres de marcador
como `a, b, c`. Tú sabes qué contienen las columnas; escribir una línea es la única versión de esto
que produce una tabla que alguien pueda leer más tarde.

### ¿Por qué hay un carácter extraño antes de la cabecera de mi primera columna?

Un byte order mark, escrito al principio del archivo por la exportación `CSV UTF-8` de Excel y por
otras herramientas de Windows. Es invisible en los editores y se pega a la primera cabecera, así
que las comparaciones contra esa cabecera fallan sin ninguna razón visible. Lee el archivo con una
codificación que lo elimine, como `utf-8-sig` de Python, o quita los tres primeros bytes.

### ¿El origen de una tabla Markdown necesita las barras verticales alineadas?

No. Rellenar las celdas para que las barras verticales queden alineadas es puramente para quien lea
el Markdown como texto; la salida renderizada es idéntica de todos modos. El relleno ayuda a la
legibilidad y perjudica los diffs, ya que editar un valor reescribe cada línea del bloque, así que
sin relleno suele ser mejor para una tabla que vive en un repositorio.
