---
title: "El mejor conversor de CSV a Markdown en 2026: todas las opciones comparadas"
description: Comparamos conversores de CSV y TSV a tabla Markdown por cómo tratan los campos entre comillas, las comas incrustadas y los saltos de línea dentro de una celda
date: 2026-09-08
tag: Conversión
keywords: conversor csv a tabla markdown, convertir csv a tabla markdown, tsv a tabla markdown, csv a markdown linea de comandos, csv a markdown online, excel a tabla markdown, generador de tabla markdown desde csv, convertir csv a markdown sin subir archivo
---

Pasar un CSV a una tabla Markdown parece un simple buscar y sustituir. Pones una barra vertical donde había una coma, añades una fila de guiones bajo la primera línea, y listo. Funciona hasta que deja de funcionar, y el archivo que lo rompe tiene una coma dentro de un campo entre comillas, o una descripción de producto con un salto de línea en medio, o una columna de rutas de archivo con una barra vertical dentro, y la tabla que sale tiene el número de columnas equivocado en una fila que nadie va a notar hasta que lo note otra persona.

### Resumen rápido

La diferencia entre los conversores de CSV a Markdown no son las funciones, es si analizan CSV de verdad o simplemente dividen por comas. Una herramienta que sigue la **RFC 4180** maneja los campos entre comillas, las comas dentro de comillas, las comillas dobles que significan una comilla literal y los saltos de línea dentro de una celda; una herramienta que divide por comas destroza las cuatro cosas y no avisa de nada. Un conversor de navegador como **/csv-to-markdown** hace el análisis en tu propio navegador sin subir nada, y convierte un salto de línea dentro de una celda en `<br>` porque una tabla Markdown no puede llevar uno real. **Pandoc** y **Miller** leen CSV y TSV correctamente desde la línea de comandos; **pandas.to_markdown** es la opción correcta cuando la tabla es la última línea de un análisis. Sea lo que sea que elijas, comprueba una fila con una comilla dentro antes de fiarte del resto.

## Por qué un CSV no se convierte en tabla sin más

Un archivo CSV es un formato de texto con una especificación, y la especificación se lee en diez minutos. La RFC 4180 dice que los campos se separan por comas, los registros por CRLF, y que cualquier campo puede ir envuelto en comillas dobles. Una vez que un campo está entre comillas, puede contener comas, puede contener saltos de línea, y una comilla doble dentro de él se escribe dos veces. Eso es casi el documento entero, y cada regla existe porque los datos de alguien contenían el separador.

Así que la primera pregunta sobre cualquier conversor de CSV a tabla Markdown es si implementa esas reglas o las aproxima. La aproximación es un `split(',')` y está en todas partes: en comandos de una línea de shell, en la mitad de los fragmentos de código que circulan por internet, y dentro de más herramientas de las que te gustaría. Produce la respuesta correcta con datos limpios, que es justo lo que la hace tan difícil de detectar. `Smith, John` dentro de un campo entre comillas se convierte en dos celdas, la fila queda una celda más ancha que el encabezado, y según el escritor del otro lado esa celda extra se descarta en silencio o desplaza una tabla entera fuera de forma.

La segunda pregunta es qué pasa a la salida, porque las tablas Markdown tienen sus propias reglas y son más estrictas que las de CSV. Una barra vertical termina una celda dondequiera que aparezca, así que un valor que la contenga tiene que escaparse. Una celda no puede contener un salto de línea en absoluto —la tabla está organizada por líneas, una fila por línea, sin sintaxis de continuación— así que un campo de CSV con un párrafo dentro hay que aplanarlo o la tabla deja de ser una tabla. Y no existe una tabla Markdown sin fila de encabezado, porque la fila de guiones bajo el encabezado es justo lo que hace que un analizador reconozca una tabla como tal. Las tablas tampoco están en el CommonMark plano, lo que es otra trampa aparte que cubre [el artículo sobre los dialectos](/blog/commonmark-gfm-and-the-flavours).

Tercero, está a dónde va el archivo. Las hojas de cálculo son de los documentos más sensibles que convierte la mayoría de la gente: extractos de nóminas, listas de clientes, exportaciones de facturas, resultados aún sin publicar. Un conversor online que sube el archivo es un conversor online que ahora tiene tus filas. Eso está bien para una tabla de licencias de código abierto y es una transferencia de datos para casi todo lo demás, que es por lo que la pregunta merece hacerse antes de arrastrar el archivo a la primera página que salió en los resultados.

## Comparativa rápida: la chuleta

| Herramienta | Mejor para | Capacidad principal | Precio |
| --- | --- | --- | --- |
| TransformPipe | Un archivo que ya tienes y una tabla que necesitas ya | Análisis RFC 4180 en el navegador, nada se sube, `<br>` para los saltos dentro de una celda | Gratis |
| Pandoc | Un CSV que es un paso dentro de un documento más largo | Lectores `csv` y `tsv` hacia cualquier formato que escriba | Gratis, GPL |
| Miller | Filtrar o reestructurar el dato por el camino | `--c2m` convierte CSV a Markdown en una sola opción | Gratis, BSD de dos cláusulas |
| csvkit (`csvlook`) | Leer un CSV en la terminal antes de convertirlo | Muestra un CSV como tabla de ancho fijo compatible con Markdown | Gratis, MIT |
| csv2md | Una sola línea en un script | Varias herramientas distintas con este nombre; opciones de delimitador y encabezado | Gratis, MIT (las dos de abajo) |
| tablesgenerator.com | Editar la tabla después de importarla | Cuadrícula al estilo hoja de cálculo, subida de CSV, pegado desde Excel | Gratis (sin cuenta mencionada) |
| Extensiones de VS Code | El archivo ya está abierto en tu editor | Pegado del portapapeles como tabla Markdown; resaltado de columnas CSV | Gratis |
| `pandas.to_markdown` | La tabla es el final de un análisis | Un método sobre un DataFrame, vía `tabulate` | Gratis, BSD de tres cláusulas |
| `tabulate` | Filas en Python que no son un DataFrame | Formatos de tabla `github` y `pipe` | Gratis, MIT |
| Copiar y pegar desde una hoja de cálculo | Un rango seleccionado, no un archivo entero | TSV del portapapeles, más fácil de dividir que CSV | Gratis |
| Un comando de shell de una línea | Un archivo que ya leíste y sabes que está limpio | `awk` sobre un delimitador, sin instalar nada | Gratis |
| La ventana de chat de un asistente | Un puñado de filas que puedes revisar a ojo | Lee texto pegado, da formato de tabla | Varía |

## Las opciones de CSV y TSV a Markdown, una a una

### TransformPipe — mejor para un archivo que ya tienes y una tabla que necesitas ya

Lee un archivo `.csv` o `.tsv` en tu navegador y te devuelve una tabla Markdown, con la primera fila como encabezado. No hace falta instalar nada ni tener cuenta, y sin haber iniciado sesión el archivo no se manda a ningún sitio — el propio navegador lo lee del disco, lo analiza y lo escribe de vuelta como texto.

| A favor | En contra |
| --- | --- |
| Un análisis RFC 4180 de verdad: campos entre comillas, comas incrustadas, comillas dobles, celdas de varias líneas | Un archivo a la vez; no es un trabajo por lotes sobre una carpeta |
| Un salto de línea dentro de una celda se convierte en `<br>` en lugar de romper la tabla | La primera fila se trata como encabezado, así que un archivo sin encabezado necesita que le añadas uno |
| Las barras verticales y las barras invertidas dentro de los valores se escapan, así que una ruta o una expresión regular no divide una fila | Sin dos puntos de alineación: todas las columnas salen alineadas a la izquierda salvo que edites la fila separadora |
| El delimitador se detecta desde la primera línea, así que una exportación con punto y coma funciona sin ninguna opción | El navegador hace el trabajo, así que una exportación muy grande depende de la máquina |

**Precio:** gratis. Una cuenta añade historial, compartir y una API, también gratis.

**Detalles técnicos**

- El analizador implementa exactamente las reglas de la RFC 4180 y nada más: una comilla abre un campo, una comilla doble dentro de una es una comilla literal, y un salto de línea dentro de comillas pertenece a la celda en vez de terminar la fila
- El delimitador se cuenta fuera de las comillas en la primera línea, entre coma, tabulación, punto y coma y barra vertical, y gana el más frecuente; una extensión `.tsv` fuerza tabulación
- Se quita la marca de orden de bytes y se normalizan los finales de línea CRLF antes de analizar, así que un archivo exportado desde Excel en Windows se comporta como cualquier otro
- Las filas cortas se rellenan con celdas vacías hasta el ancho de la fila más ancha, así que un archivo irregular sigue produciendo una tabla rectangular
- El nombre del archivo se convierte en un H1 encima de la tabla, porque una tabla sin título es una tabla que nadie sabrá ubicar dentro de una semana
- La misma conversión funciona desde una API REST, una CLI sin dependencias que elige la conversión por la extensión del archivo, una GitHub Action y un servidor MCP

**¿Para quién es?** Para cualquiera con una exportación de hoja de cálculo y un documento donde pegarla, sobre todo si las filas no son públicas. Toda la conversión pasa por tu máquina, y lo puedes comprobar viendo cómo el panel de red no hace nada mientras se ejecuta.

### Pandoc — mejor cuando el CSV es un paso dentro de un documento más largo

Pandoc es un conversor de documentos de línea de comandos escrito en Haskell, y su lista de formatos de entrada incluye `csv` (que el manual describe como una tabla RFC 4180) y `tsv`. Eso lo convierte en la única herramienta de aquí que toma un CSV y te da Markdown, HTML, LaTeX, DOCX o EPUB con el mismo comando y una `-t` distinta.

| A favor | En contra |
| --- | --- |
| Lee CSV y TSV de forma nativa, sin script auxiliar | Exige instalar algo, y es grande |
| Escribe a cualquier formato de salida que Pandoc admita, desde la misma entrada | El dialecto de tabla Markdown depende de qué extensión del escritor esté activa |
| `--standalone` produce un documento completo en lugar de un fragmento | Sin control sobre el delimitador: coma para `csv`, tabulación para `tsv` |
| Ya instalado en muchísimas máquinas de compilación de documentación | Más herramienta de la que necesita una sola tabla |

**Precio:** gratis, licencia GPL.

**Detalles técnicos**

- `pandoc -f csv -t markdown datos.csv` escribe una tabla con barras verticales; `-f tsv` para entrada separada por tabulaciones (comprobado en pandoc.org, el 8 de septiembre de 2026)
- El primer registro del archivo se lee como fila de encabezado, la misma suposición que hace cualquier otra herramienta de aquí
- Qué sintaxis de tabla Markdown sale depende de las extensiones de tabla del escritor — `pipe_tables` es la que coincide con GitHub, y una tabla de cuadrícula o simple no se renderizará en un analizador GFM
- El mismo archivo puede ir directo a HTML, y `--standalone` lo envuelve en un documento con cabecera y estilos en vez de dejarte un fragmento

**¿Para quién es?** Para quien tenga su CSV como una entrada más entre varias en una compilación que ya usa Pandoc. Si el destino es una página web en lugar de Markdown, ir directo suele ser el camino más corto — [la comparativa de conversores](/blog/best-markdown-to-html-converters) cubre qué usar para ese tramo.

### Miller — mejor para reestructurar el dato por el camino

Miller es un procesador de línea de comandos para CSV, TSV, JSON y JSON Lines, escrito en Go sin dependencias en tiempo de ejecución. Markdown es uno de sus formatos de salida, así que la conversión es una opción en vez de un script.

| A favor | En contra |
| --- | --- |
| `--c2m` convierte CSV a una tabla Markdown en una sola opción | Otra instalación, y un lenguaje de comandos que aprender |
| Filtra, ordena, recorta y renombra columnas en el mismo comando que convierte | La salida no viene alineada por defecto, más difícil de leer en el archivo en bruto |
| Lee tablas Markdown de vuelta, además de escribirlas | Verbos y opciones son una sintaxis real, no una sola opción |
| Un solo binario estático, sin runtime | Excesivo para convertir un archivo una vez |

**Precio:** gratis, licencia BSD de dos cláusulas (comprobado en github.com/johnkerl/miller, el 8 de septiembre de 2026).

**Detalles técnicos**

- `--omd` elige salida Markdown, `--imd` entrada Markdown, y los atajos `--c2m` y `--m2c` hacen CSV a Markdown y viceversa
- `--omd-aligned` rellena las columnas para que el origen de la tabla sea legible para alguien que la edite a mano
- `--right-align-numeric` escribe `---:` en la fila separadora para las columnas numéricas, que es la sintaxis de alineación que entiende GFM
- Como la conversión es un formato de salida y no un modo aparte, `mlr --c2m sort -f region cut -f region,total datos.csv` filtra y convierte en un solo paso

**¿Para quién es?** Para quien quiera un subconjunto del archivo en vez de todo — el último trimestre, tres de once columnas, filas por encima de un umbral. Hacer eso en el conversor gana a convertirlo todo y borrar filas en Markdown después.

### csvlook de csvkit — mejor para leer el archivo antes de convertirlo

csvkit es un conjunto de herramientas de línea de comandos para CSV escritas en Python. `csvlook` muestra un CSV en la terminal en lo que su propia documentación llama un formato de ancho fijo compatible con Markdown — una tabla que puedes leer, y pegar.

| A favor | En contra |
| --- | --- |
| La salida está documentada como compatible con Markdown, así que suele pegarse directamente | Pensado para mirar datos, no para producir archivos |
| Detecta el dialecto del CSV, así que los delimitadores raros se manejan a menudo sin ninguna opción | El relleno de ancho fijo hace el origen más largo de leer |
| El resto de csvkit —`csvcut`, `csvgrep`, `csvsql`— se combina con él | Necesita Python y pip |
| La inferencia de tipos alinea bien las columnas numéricas | Las opciones de truncado pueden acortar celdas anchas en silencio |

**Precio:** gratis, licencia MIT (comprobado en github.com/wireservice/csvkit, el 8 de septiembre de 2026).

**Detalles técnicos**

- `csvlook datos.csv` imprime la tabla; funciona con tubería, así que `csvcut -c 1,3 datos.csv | csvlook` la estrecha primero
- `--max-rows`, `--max-columns` y `--max-column-width` limitan lo que se muestra, y cada uno cambia la tabla en vez de solo la vista
- `--no-inference` desactiva la detección de tipo, que importa para columnas de identificadores que parecen números
- `--snifflimit 0` desactiva la detección de dialecto cuando la conjetura sale mal

**¿Para quién es?** Para quien vive en una terminal y quiere ver el archivo antes de decidir nada. Trata la salida Markdown como una comodidad y no como el objetivo, y comprueba las opciones de truncado antes de pegar una tabla ancha.

### csv2md — mejor para una línea en un script, una vez elijas cuál

No existe un solo csv2md. Hay varias herramientas sin relación entre sí con ese nombre, en lenguajes distintos, con opciones distintas, y buscar una devuelve las demás. Dos son fáciles de verificar: una en Python instalada con pip, y una en Ruby instalada como gema.

| A favor | En contra |
| --- | --- |
| Hace exactamente un trabajo, así que no hay nada que configurar | La coincidencia de nombre es un riesgo real al escribir instrucciones de instalación |
| La versión de Python acepta opciones de delimitador, carácter de comillas y alineación | Las herramientas pequeñas de un solo propósito aparecen y desaparecen |
| La versión de Ruby invierte la conversión, de tabla Markdown a CSV | Otro gestor de paquetes en tu compilación |
| Lee de la entrada estándar, así que entra en una tubería | El comportamiento varía entre las herramientas que comparten el nombre |

**Precio:** gratis, licencia MIT — tanto la implementación en Python como en Ruby (comprobado en github.com/lzakharov/csv2md y github.com/jonmagic/csv2md, el 8 de septiembre de 2026).

**Detalles técnicos**

- La herramienta de Python (`pip install csv2md`) documenta `-d` para el delimitador, `-q` para el carácter de comillas, `-C` para elegir columnas, `-c` y `-r` para alineación centrada y derecha, y `-H` para indicar que el archivo no tiene fila de encabezado — en cuyo caso genera encabezados al estilo hoja de cálculo: a, b, c
- Esa opción `-H` merece anotarse: es la única herramienta de aquí que responde a la pregunta del archivo sin encabezado con algo distinto de «tu primera fila de datos ahora es el encabezado»
- La herramienta de Ruby (`gem install csv2md`) convierte CSV a una tabla GitHub Flavored Markdown y acepta `-r` para hacer el camino contrario

**¿Para quién es?** Para scripts que convierten repetidamente un archivo de forma conocida. Fija el paquete exacto en tus instrucciones, porque «instala csv2md» es un consejo ambiguo.

### tablesgenerator.com — mejor para editar la tabla después de importarla

Tables Generator es una herramienta de navegador que te da una cuadrícula al estilo hoja de cálculo y genera marcado a partir de ella, Markdown entre varios formatos. Su valor no es la conversión, son los veinte minutos siguientes en los que arreglas la tabla.

| A favor | En contra |
| --- | --- |
| Importa un archivo CSV o pega un rango desde Excel, Google Sheets o LibreOffice | Tus filas pasan por una página alojada |
| Edita celdas, inserta y mueve filas y columnas, transpón la tabla entera | Una cuadrícula tiene límites prácticos: la página declara un rango válido de 1 a 500 filas y de 1 a 20 columnas (comprobado en tablesgenerator.com, el 8 de septiembre de 2026) |
| Controles de alineación por columna, y deshacer | La edición manual no escala más allá de una pantalla |
| Genera LaTeX, HTML y MediaWiki desde la misma cuadrícula | No se puede automatizar |

**Precio:** gratis; la página no menciona cuenta ni pago (comprobado en tablesgenerator.com, el 8 de septiembre de 2026).

**Detalles técnicos**

- Importa desde archivo CSV subido, desde un pegado de Markdown o HTML, o desde un rango copiado de una hoja de cálculo
- Buscar y sustituir, formato de números, inserción y eliminación de filas y columnas, transposición, guardado automático local
- La página declara compatibilidad con la sintaxis de tabla de GitHub Flavored Markdown, que es el dialecto en el que coinciden la mayoría de los analizadores
- Copia al portapapeles, o descarga el resultado como CSV

**¿Para quién es?** Para quien monte a mano una tabla a partir de más de una fuente, o arregle los encabezados y la alineación de una tabla convertida antes de publicarla. No es la herramienta para filas confidenciales, ni para un archivo con diez mil de ellas.

### Extensiones de VS Code — mejor cuando el archivo ya está abierto en tu editor

Si el CSV está en tu repositorio, el camino más corto es el editor donde ya está abierto. Dos extensiones cubren las dos mitades del trabajo: una pega un rango copiado de hoja de cálculo como tabla Markdown, la otra hace que el propio CSV se pueda leer.

| A favor | En contra |
| --- | --- |
| Ninguna aplicación nueva: la conversión pasa donde vive el archivo | La calidad y el mantenimiento de las extensiones varían |
| Funciona desde el portapapeles, así que sirve tanto para Excel y Sheets como para archivos | Cada extensión hace solo una parte del trabajo |
| Gratis | Solo dentro del editor: nada de esto corre en CI |
| El resaltado de columnas hace visible una comilla rota antes de convertir | El comportamiento con delimitadores raros depende de la extensión |

**Precio:** gratis (comprobado en marketplace.visualstudio.com, el 8 de septiembre de 2026).

**Detalles técnicos**

- Excel to Markdown table (csholmq) convierte un rango de hoja de cálculo copiado en el portapapeles en una tabla Markdown, desde la paleta de comandos o con Shift+Alt+V, y lee un prefijo `^l`, `^c` o `^r` en un encabezado para fijar la alineación de esa columna
- Rainbow CSV (mechatroner) colorea las columnas de un CSV o TSV para que una comilla mal colocada se note como un cambio de color, ofrece alineación de columnas, e incluye un comando de copiar en formato Markdown
- La documentación de Rainbow CSV declara que su tipo de archivo Dynamic CSV maneja campos de varias líneas escapados con comillas dobles, que es el caso RFC 4180 que más resaltadores fallan
- Las dos trabajan sobre el archivo tal cual está: ninguna añade un paso de compilación

**¿Para quién es?** Para desarrolladores que escriben documentación junto al dato. Combínalas — una para revisar el archivo, otra para producir la tabla.

### pandas.to_markdown — mejor cuando la tabla es el final de un análisis

Si las filas ya han pasado por pandas, la tabla Markdown está a un método de distancia. `DataFrame.to_markdown()` existe y exige que el paquete `tabulate` esté instalado.

| A favor | En contra |
| --- | --- |
| Un método, al final de un trabajo que ya estabas haciendo | El índice viene incluido por defecto, lo que produce una primera columna sin nombre |
| El lector de CSV de pandas maneja bien las comillas, las codificaciones y los delimitadores | Una dependencia pesada para una tabla |
| Filtra, agrupa y ordena antes de convertir, que es la razón habitual para estar aquí | No es un conversor: es una llamada de biblioteca dentro de tu propio código |
| `tablefmt` se pasa a tabulate, así que el estilo de tabla se puede elegir | |

**Precio:** gratis. pandas tiene licencia BSD de tres cláusulas; tabulate, que exige, es MIT.

**Detalles técnicos**

- `pd.read_csv('datos.csv').to_markdown(index=False)` es la conversión entera, y `index=False` es la parte que se olvida (comprobado en pandas.pydata.org, el 8 de septiembre de 2026)
- El parámetro `index` es `True` por defecto, así que la salida por defecto lleva los números de fila en una columna sin encabezado
- `tablefmt` se pasa a tabulate, y el valor por defecto documentado escribe dos puntos de alineación en la fila separadora
- Todo lo que pandas hace a un CSV al leerlo —inferencia de tipos, `na_values`, `thousands`, `encoding` explícito— pasa antes de escribir la tabla, para bien y para mal

**¿Para quién es?** Para quien produce una tabla a partir de un dato que ya está calculando: un informe semanal, el resultado de un notebook, un resumen que un script añade al final de un Markdown.

### tabulate — mejor cuando tienes filas pero no un DataFrame

tabulate es la biblioteca a la que llama pandas, y acepta una lista plana de listas. Si tus filas vienen de un cursor de base de datos, una respuesta JSON o `csv.reader`, esta es la dependencia más pequeña.

| A favor | En contra |
| --- | --- |
| Funciona sobre cualquier iterable de filas; no necesita un DataFrame | El análisis del CSV lo haces tú |
| Los formatos `github` y `pipe` producen ambos tablas Markdown | Nada que ejecutar: es una biblioteca, no un comando |
| Pequeña, sin cadena de dependencias detrás | Sin ninguna opinión sobre tus tipos de dato |

**Precio:** gratis, licencia MIT (comprobado en pypi.org, el 8 de septiembre de 2026).

**Detalles técnicos**

- `tabulate(filas, headers=encabezado, tablefmt='github')` produce una tabla al estilo GFM; `tablefmt='pipe'` añade dos puntos de alineación en la fila separadora (comprobado en pypi.org, el 8 de septiembre de 2026)
- Combínalo con el módulo `csv` de la biblioteca estándar, que implementa las reglas de comillas, en vez de con `linea.split(',')`
- El trato del encabezado es explícito: pasas `headers` tú mismo, así que un archivo sin encabezado es decisión tuya y no de la herramienta

**¿Para quién es?** Para scripts de Python que ya tienen filas en memoria y necesitan una tabla al final. Combina `csv.reader` para la entrada y tabulate para la salida, y te has ahorrado los dos fallos que tiene la versión ingenua.

### Copiar y pegar desde una hoja de cálculo — mejor para un rango, no un archivo

Copiar celdas desde Excel, Numbers o Google Sheets pone texto separado por tabulaciones en el portapapeles, no CSV. Eso importa: las tabulaciones casi nunca aparecen dentro de un valor, así que dividir por ellas es mucho más seguro que dividir por comas. Por eso el camino del portapapeles funciona tan a menudo como funciona.

| A favor | En contra |
| --- | --- |
| Ningún archivo que exportar, ninguna herramienta que instalar | Convierte una selección, no una fuente de verdad |
| El TSV del portapapeles evita del todo el problema de las comas incrustadas | Las fórmulas llegan como valores; el formato no llega en absoluto |
| Funciona desde un rango, que suele ser lo único que querías | Una celda con un salto de línea sigue pegándose como varias líneas |
| Cualquier conversor que entienda TSV lo acepta directamente | Las celdas combinadas se colapsan de formas que hay que revisar |

**Precio:** gratis.

**Detalles técnicos**

- Un rango copiado es TSV, así que un camino de conversión `.tsv` o una extensión de pegado lo maneja sin ninguna opción de delimitador
- Las celdas que contienen tabulaciones o saltos de línea van entre comillas en el portapapeles gracias a la hoja de cálculo, así que las reglas de comillas siguen aplicando
- El formato de número es una propiedad de visualización: una celda que muestra 1.234,00 € puede poner `1234` en el portapapeles, y una celda que muestra un valor redondeado puede poner ahí la precisión completa

**¿Para quién es?** Para quien convierte parte de una hoja una sola vez. Si el mismo rango hay que convertirlo cada semana, exporta el archivo y hazlo con un script.

### Un comando de shell de una línea — mejor para un archivo que ya leíste

`awk -F, '{...}'` es el conversor de CSV a Markdown más rápido de escribir y el más fácil de hacer mal. Es una elección legítima en exactamente una situación: un archivo que has abierto, mirado, y sabes que no contiene comillas, ni delimitadores incrustados, ni saltos de línea dentro de una celda.

| A favor | En contra |
| --- | --- |
| Nada que instalar; funciona en cualquier máquina con un shell | `-F,` es una división, no un análisis de CSV |
| Funciona bien con archivos generados por máquina de forma fija | Falla en silencio con campos entre comillas, que es el peor tipo de fallo que existe |
| Fácil de leer y de adaptar | Escapar barras verticales y aplanar saltos de línea corre todo de tu cuenta |

**Precio:** gratis.

**¿Para quién es?** Para alguien que convierte una salida que generó él mismo, en un script que se va a borrar después. Para cualquier cosa que venga de una hoja de cálculo, una exportación de base de datos u otra persona, usa una herramienta con analizador de verdad. El coste del comando de una línea no es que se rompa; es que rompe una fila en medio de cien.

### La ventana de chat de un asistente — mejor para un puñado de filas que puedes revisar

Pegar filas en un asistente y pedirle una tabla Markdown funciona, y es la única opción de aquí que además te va a arreglar los encabezados. La trampa es que está generando texto en lugar de transformarlo, así que el resultado no está garantizado a llevar los mismos valores que la entrada.

| A favor | En contra |
| --- | --- |
| Maneja entradas desordenadas y a medio estructurar que un analizador rechazaría | Los valores pueden reformatearse, redondearse o reordenarse |
| Renombra encabezados y reordena columnas si se lo pides | Sin garantía de que sobreviva cada fila, sobre todo con entradas largas |
| Nada que instalar | Pegar significa que el dato sale de tu máquina |
| Útil para el último rincón incómodo de una tabla | No es reproducible: el mismo pegado dos veces puede dar resultados distintos |

**Precio:** varía según el asistente.

**¿Para quién es?** Para quien tenga veinte filas y ojos puestos en todas ellas. Para una exportación de nóminas, usa un analizador; para una lista garabateada de tres columnas, esto es más rápido que cualquiera de las opciones de arriba. [Sacar un resultado revisado de un asistente y llevarlo a una página](/blog/ai-output-to-a-shareable-page) es su propio ejercicio, y uno corto.

## Lo que la RFC 4180 le hace a un conversor

Esta es la sección que la propia página de una herramienta se salta, porque cada punto de la lista es una forma de fallar en silencio. Toma un archivo representativo —uno real, con las filas incómodas todavía dentro— y comprueba cada uno de estos antes de confiarte de nada.

**Una coma dentro de un campo entre comillas.** `"Smith, John",Ventas,2026` son tres campos, no cuatro. Un analizador lee las comillas y conserva la coma; una división produce cuatro celdas, y una fila una celda más ancha que el encabezado. La regla de GFM es que las celdas extra más allá del número del encabezado se descartan, así que «Ventas» y «2026» se desplazan a la izquierda y el último valor desaparece. Nada avisa de ello. La fila simplemente dice algo distinto de lo que dice el archivo.

**Una comilla doble es una comilla.** Dentro de un campo entre comillas, `""` significa una `"` literal. Así que `"Dijo ""no""."` es un solo campo que dice: Dijo "no". Una herramienta que quita las comillas con una expresión regular deja las dobles puestas, y te queda `Dijo ""no""` en tu tabla. Es cosmético hasta que el valor es una muestra de código o una medida en pulgadas, momento en el que es simplemente incorrecto.

**Un salto de línea dentro de una celda.** Este es el que no tiene respuesta limpia. La RFC 4180 permite un salto de línea dentro de un campo entre comillas, y las hojas de cálculo los producen constantemente — bloques de dirección, columnas de notas, cualquier cosa donde alguien escribió Alt+Intro. Una tabla Markdown no tiene forma de representarlo: la tabla es una fila por línea, y un salto de línea real dentro de una celda termina la fila. Toda herramienta tiene que elegir una mentira. Descartar el salto junta dos frases. Dividir la fila crea una segunda fila mal formada. Sustituir el salto por `<br>` conserva el salto visual cuando el Markdown se convierte en HTML, y deja una etiqueta HTML en un archivo que puede no renderizarse nunca como HTML. TransformPipe sustituye por `<br>`, con el argumento de que una etiqueta visible es mejor que una tabla rota en silencio — pero es una decisión con coste, y [lo que hace Markdown con los saltos de línea en general](/blog/markdown-line-breaks-and-lists) explica por qué no hay ninguna opción mejor disponible dentro de una tabla.

**Una barra vertical dentro de un valor.** A CSV no le importan las barras verticales; a Markdown le importan mucho. Una `|` sin escapar termina la celda dondequiera que aparezca, incluso dentro de acentos graves, así que un valor que contenga `a|b` añade una columna fantasma a esa fila. Hay que escaparla como `\|` en la salida. Este es el fallo que hace tropezar a conversores escritos por gente que probó solo con nombres y números: aparece en rutas de archivo, expresiones regulares, comandos de shell y cualquier columna con una lista de opciones. Si conviertes datos así, pon una barra vertical en una celda de prueba a propósito y mira qué sale. [El artículo sobre tablas](/blog/markdown-tables-that-survive-conversion) cubre qué hace el escape en el otro lado.

**Un archivo sin fila de encabezado.** Los CSV generados por máquina a menudo no la tienen — una exportación de registro, un volcado de base de datos, un flujo de sensores. Una tabla Markdown no puede existir sin encabezado, porque la fila separadora que va debajo es lo que identifica la tabla ante el analizador. Así que cada conversor hace una de tres cosas: ascender tu primera fila de datos al encabezado, lo que pierde el significado de esa fila; generar encabezados de relleno como a, b, c o Column 1; o negarse. La mayoría elige la primera opción en silencio, que es por lo que un archivo de registro convertido tan a menudo tiene una marca de tiempo donde debería haber nombres de columna. Si tu archivo no tiene encabezado, añade uno antes de convertir. Es una línea, y es la única versión de esto que termina bien.

**El delimitador no siempre es una coma.** Un CSV exportado en un idioma que usa la coma como separador decimal muy a menudo lleva punto y coma, y aun así termina en `.csv`. Los archivos separados por tabulaciones son el mismo formato con otro separador. Un conversor que asume una coma convierte cada fila en una sola celda que lo contiene todo — un fallo obvio, al menos, que es más de lo que ofrecen los demás. Busca una opción de delimitador, o una herramienta que detecte la primera línea.

**Los bytes antes del primer campo.** Un archivo guardado desde Excel en Windows puede empezar con una marca de orden de bytes y usar finales de línea CRLF. La marca se pega a tu primer encabezado de columna, donde es invisible en el editor y rompe cualquier comparación contra ese encabezado. El CRLF deja un retorno de carro suelto al final de cada último campo. Los dos son triviales de manejar para un conversor y ninguno lo maneja una división ingenua.

**Filas que no tienen todas la misma longitud.** Las exportaciones reales tienen filas irregulares. El ancho de la tabla Markdown lo fija el encabezado, y las filas del cuerpo se rellenan o se truncan hasta encajar sin ningún aviso. Rellenar una fila corta casi siempre es correcto. Truncar una larga descarta datos, y la fila truncada suele ser precisamente la que tenía el problema de comillas — así que una fila irregular merece investigarse en vez de rellenarse sin más.

## Dónde una tabla Markdown simplemente no puede llegar

Parte de lo que guarda una hoja de cálculo no tiene ningún equivalente en Markdown, y saber qué parte te ahorra buscar un conversor que lo maneje. Ninguno lo hace.

**Las celdas combinadas.** No hay colspan ni rowspan en una tabla Markdown. Un encabezado combinado que abarca tres columnas tiene que volverse un solo título en una columna, con las otras dos vacías, o tres encabezados repetidos. Si el origen depende de celdas combinadas para su estructura, la tabla necesita rediseñarse en vez de convertirse.

**Las fórmulas y los formatos de número.** Una exportación en CSV contiene valores, no fórmulas — esa pérdida pasa antes de que el conversor vea el archivo. El formato de número sigue el mismo camino: símbolos de moneda, separadores de miles, porcentajes y formatos de fecha son propiedades de visualización de la hoja de cálculo, y lo que llega al CSV es lo que decidió escribir el exportador. Si la tabla convertida muestra `0.4567` donde la hoja mostraba 45,67 %, eso lo hizo la exportación, no la conversión.

**Las tablas muy anchas.** Las tablas Markdown no se envuelven ni se desplazan por sí solas. Doce columnas de prosa se renderizan como una tabla más ancha que la página, y qué pasa después depende de lo que renderice el HTML — desbordamiento horizontal, compresión, o una barra de desplazamiento si el HTML que la rodea la ofrece. Recorta columnas antes de convertir, o acepta que la tabla solo se va a leer bien en pantallas anchas.

**Ordenar, filtrar y totalizar.** Una tabla Markdown es texto. No tiene orden, ni filtro, ni fila de totales que se recalcule. Si el lector necesita interrogar los números, la tabla es el resultado equivocado y un enlace al CSV es el correcto. Las tablas Markdown son para datos suficientemente pequeños y suficientemente estables como para leerse.

## Cómo elegir

1. **Comprueba una fila difícil antes que nada.** Busca en tu archivo un valor con una comilla, una coma dentro de comillas o un salto de línea, convierte ese archivo, y mira esa fila en el resultado. Si sobrevive, la herramienta tiene analizador de verdad; si no sobrevive, ninguna otra función importa, porque el fallo es silencioso y el archivo ya está sutilmente mal.
2. **Decide si las filas pueden salir de la máquina.** Para una tabla de datos públicos esto no es una preocupación. Para cualquier cosa con nombres, sueldos o números sin publicar, la conversión en el navegador o una herramienta local de línea de comandos son las dos únicas opciones, y la diferencia no se ve en ninguna tabla comparativa.
3. **Cuenta cuántas veces vas a hacer esto.** Una vez es arrastrar un archivo. Cada semana es un script, y un script apunta a Pandoc, Miller o una llamada de biblioteca, porque una persona manejando una pestaña de navegador es la parte de un proceso semanal que termina olvidándose.
4. **Pregúntate si quieres todas las filas.** Si la respuesta es no, convierte con algo que también pueda filtrar. Borrar filas de una tabla Markdown a mano es la forma más lenta posible de hacerlo, y de ahí salen los errores de transcripción.
5. **Mira si tu archivo tiene encabezado, antes de que lo decida la herramienta.** Si no lo tiene, añade uno. La respuesta de cada conversor a un archivo sin encabezado pierde algo, y la versión donde tú das los nombres de columna es la única que produce una tabla que alguien pueda leer después.

## Conclusión

El mejor conversor de CSV a tabla Markdown es el que lee el archivo como CSV en lugar de como texto con comas dentro —[el cómo hacerlo recorre cada trampa por su síntoma](/blog/convert-csv-to-markdown-table)— porque todo lo demás del trabajo es fácil y esa es la única parte que falla sin avisar. Para un archivo en tu disco y un documento donde pegarlo, [la conversión de CSV a tabla Markdown de arriba](/csv-to-markdown) hace el análisis RFC 4180 en tu navegador, escapa las barras verticales, convierte los saltos de línea dentro de una celda en `<br>` y no sube nada — gratis, sin instalar. Para un trabajo que se repite, pon Miller o Pandoc dentro del script. Para una tabla al final de un análisis que ya corres en Python, `to_markdown` estaba ahí desde siempre. Sea lo que sea que elijas, guarda un archivo con una coma entre comillas y un salto de línea incrustado como tu prueba, y pasa por ahí cualquier herramienta nueva antes de confiarle filas reales.

## Preguntas frecuentes

### ¿Cómo convierto un CSV a una tabla Markdown sin subir el archivo?

Usa un conversor que corra en el navegador o uno que corra en tu propia máquina. Una herramienta de navegador lee el archivo con la propia API de archivos de la página y nunca lo envía, algo que puedes verificar abriendo el panel de red y viendo que no pasa nada; una herramienta de línea de comandos como Miller o Pandoc no toca la red en absoluto.

### ¿Qué pasa con las comas dentro de campos entre comillas?

En una herramienta con un analizador de CSV de verdad, nada — las comillas se leen, la coma se queda dentro de la celda, y la fila conserva su número de columnas. En una herramienta que divide por comas, el campo se convierte en dos celdas y la fila gana una columna, y como Markdown descarta las celdas más allá del número del encabezado, el valor al final de esa fila desaparece sin ningún aviso.

### ¿Puede una celda de una tabla Markdown contener un salto de línea?

No. Una tabla Markdown está organizada por líneas, una fila por línea, sin sintaxis de continuación, así que un salto de línea real dentro de una celda termina la fila. Los conversores tratan un campo de CSV con un salto de línea sustituyéndolo por `<br>`, que se renderiza como salto cuando el Markdown se convierte en HTML, o aplanándolo en un espacio — y la elección es de cada conversor, así que comprueba cuál hizo el tuyo.

### ¿Qué hacen los conversores con un CSV sin fila de encabezado?

La mayoría ascienden la primera fila de datos al encabezado, porque una tabla Markdown no puede existir sin uno. Algunas herramientas ofrecen una opción que genera nombres de relleno en su lugar — el csv2md de Python documenta `-H` justo para esto. La respuesta fiable es añadir tú mismo una línea de encabezado al archivo antes de convertir.

### ¿Cómo convierto un archivo TSV en vez de un CSV?

Cualquier herramienta con opción de delimitador acepta una tabulación; varias la detectan por la extensión del archivo. Pandoc tiene un lector `tsv` aparte, Miller lee TSV de forma nativa, y un conversor que detecta el delimitador desde la primera línea lo maneja sin que se lo pidas. El dato copiado del portapapeles de una hoja de cálculo ya viene separado por tabulaciones, que es por lo que pegar a menudo funciona mejor que exportar.

### ¿Una tabla Markdown conserva la alineación de columnas de la hoja de cálculo?

No, y no tiene noción de alineación más allá de tres opciones por columna, fijadas con dos puntos en la fila separadora. Algunas herramientas escriben esos dos puntos —el formato `pipe` de tabulate lo hace, su formato `github` no— y otras dejan cada columna alineada a la izquierda para que la edites tú. La alineación por celda, las celdas combinadas y el formato de número no existen en Markdown en absoluto.

### ¿Convertir Excel a Markdown es el mismo trabajo que CSV a Markdown?

Casi. Guarda la hoja como CSV y es el mismo trabajo, con las mismas reglas de comillas. Copia un rango al portapapeles en su lugar y obtienes texto separado por tabulaciones, más fácil de dividir con seguridad porque las tabulaciones casi nunca aparecen dentro de un valor — pero las fórmulas ya se han vuelto valores y el formato de celda ya se ha descartado en el momento en que se produce cualquiera de los dos formatos.
