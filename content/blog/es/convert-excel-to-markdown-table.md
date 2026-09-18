---
title: "Excel a tabla Markdown: todas las rutas, y qué pierde cada una"
description: Cómo pasar un rango de Excel a una tabla Markdown, y qué le pasa a las fechas, los ceros iniciales, las celdas combinadas y la codificación
updated: 2026-09-14
date: 2026-09-03
tag: Conversión
keywords: excel a tabla markdown, convertir excel a markdown, pasar excel a markdown, xlsx a tabla markdown, csv de excel a markdown, copiar excel en markdown, hoja de cálculo a tabla markdown, codificación utf-8 csv excel
---

Una hoja de cálculo y una tabla Markdown parecen la misma cosa dibujada dos veces. No lo son. Una es una cuadrícula de celdas con tipos, formatos, fórmulas y regiones que abarcan varias columnas; la otra es un formato de texto basado en líneas, donde una fila es una línea, una celda termina en una barra vertical y todo es una cadena de texto. Pasar de la primera a la segunda no es un problema de renderizado. Es una decisión sobre qué se descarta.

### Resumen rápido

La vía que no necesita nada de Excel es **subir el propio archivo `.xlsx`** a un conversor que lea el zip de XML del libro — cada hoja se convierte en su propia tabla, con un índice en cuanto hay más de una. Cuando eso no es posible, guarda la hoja como **CSV UTF-8** y convierte ese CSV — la vía que funciona en cualquier sitio, y que te cuesta las fórmulas, el formato y todas las hojas salvo la activa. Para un rango seleccionado, **copiar y pegar** es más rápido: el portapapeles de Excel lleva una versión de las celdas separada por tabuladores, más fácil de dividir que un CSV porque un tabulador casi nunca aparece dentro de un valor. Espera problemas en tres sitios muy concretos: **los ceros iniciales y los números de 16 cifras**, que Excel ya destruyó en el momento en que se escribió el valor; **las celdas combinadas**, que no tienen ningún equivalente en Markdown; y **la codificación**, porque el `CSV (delimitado por comas)` normal escribe la página de códigos ANSI de tu sistema en vez de UTF-8. Revisa una fila con un carácter acentuado, otra con un número largo y otra con una coma dentro de un valor antes de fiarte de las otras novecientas.

La dificultad casi nunca está en la conversión. Está en que la tabla que recibes es sutilmente incorrecta de una forma que nadie nota hasta que ya está publicada. Un número de referencia que en la hoja se leía `00417` en la página se lee `417`. Una fecha que en Londres se leía `03/09/2026` se lee como el tres de septiembre para media audiencia y como el nueve de marzo para la otra mitad. Un encabezado que abarcaba tres columnas se ha colapsado en una celda y dos huecos, así que las columnas de debajo se quedan sin ninguna etiqueta.

Nada de eso es culpa del conversor, y ese es el punto que conviene entender pronto. La mayor parte del daño ocurre dentro de la propia hoja de cálculo — en el momento en que se escribió un valor, o en el momento en que Excel escribió un archivo de texto — y ninguna herramienta posterior puede revertirlo. Lo que hace una buena vía de conversión es hacer visible el daño mientras todavía puedes arreglarlo.

Está también la cuestión de a dónde va el archivo. Las hojas de cálculo son de los documentos más sensibles que convierte la mayoría de la gente: bandas salariales, listas de clientes, cifras sin publicar, una exportación de un sistema de facturación. Un conversor que sube el archivo es un conversor que ahora tiene esas filas, y eso importa aquí más que en un README.

## Lo que guarda una hoja de cálculo y una tabla Markdown no puede

Las tablas de Markdown vienen de GitHub Flavored Markdown, no del núcleo de CommonMark, y la sintaxis es deliberadamente pequeña: barras verticales entre celdas, una fila por línea, una fila de guiones bajo el encabezado para marcar que aquello es una tabla, y dos puntos opcionales en esa fila para la alineación. Ese es todo el conjunto de funciones. Todo lo que una hoja de cálculo hace más allá de eso tiene que descartarse, aplanarse o trasladarse a otro sitio.

| En el libro | En una tabla Markdown | Qué pasa en realidad |
| --- | --- | --- |
| Fórmulas | Nada | Se conserva el valor, la fórmula desaparece. La tabla deja de actualizarse |
| Formatos numéricos | Nada | Recibes la cadena mostrada, o el número crudo, según la vía |
| Negrita, color, relleno | Solo énfasis en línea, sin color | Una celda roja que significaba «atrasado» llega como un número corriente |
| Formato condicional | Nada | La regla y el significado desaparecen los dos |
| Celdas combinadas | Nada — ni colspan ni rowspan | El valor en la primera celda, huecos en el resto |
| Varias hojas | Una tabla por hoja | Una exportación CSV guarda solo la hoja activa |
| Un salto de línea dentro de una celda | Nada | Tiene que convertirse en `<br>` o en un espacio, o la tabla se rompe |
| Hiperenlaces | `[texto](url)` | Se conservan solo en las vías que leen el portapapeles enriquecido, no el texto plano |
| Comentarios y notas | Nada | Se pierden en silencio |
| Gráficos, imágenes, tablas dinámicas | Nada | No son tabulares, no son convertibles |
| Ancho de columna, paneles inmovilizados | Nada | El diseño es cosa del lector, no tuya |
| Alineación | `:---`, `:---:`, `---:` | El único formato que sobrevive, y normalmente lo pones a mano |

Dos filas de esa tabla merecen destacarse aparte, porque son las que producen un documento roto en vez de uno simplemente más plano. Un salto de línea dentro de una celda no tiene representación en la sintaxis — la tabla está basada en líneas, así que un salto real termina la fila — y una región combinada tampoco tiene representación. Todo lo demás se degrada. Esos dos corrompen.

La otra regla que conviene conocer es la de la rectangularidad. La especificación de GitHub dice que la fila de encabezado fija el número de columnas: una fila posterior con menos celdas recibe celdas vacías de relleno, y una fila con más celdas ve ignoradas las que sobran. Es un comportamiento clemente y a la vez peligroso, porque una fila que perdió una celda por culpa de una barra vertical suelta no produce ningún error. Produce una tabla con un valor que falta en silencio al final de una línea. [Las tablas son lo que se rompe con más frecuencia al cruzar de un formato a otro](/blog/markdown-tables-that-survive-conversion), y esta es la razón: el modo de fallo es una tabla válida con el contenido equivocado.

## Comparativa rápida: las rutas de una hoja a una tabla

| Ruta | Mejor para | Conserva | Pierde | Instalación |
| --- | --- | --- | --- | --- |
| Subir el `.xlsx` directamente | Un libro entero, sin paso de exportación | Cada hoja, cada una como su propia tabla | Fórmulas, formatos — como cualquier ruta | Ninguna |
| Guardar como CSV UTF-8 y convertir | Una hoja entera, con fiabilidad | Valores, caracteres acentuados | Fórmulas, formatos, las demás hojas | Ninguna |
| Copiar el rango y pegarlo en un conversor | Una selección que puedes ver | Valores, en forma separada por tabuladores | Formato, hiperenlaces | Ninguna |
| Copiar el rango y pegarlo como HTML | Negrita, enlaces, estructura combinada | Énfasis, `<a href>`, colspan | Depende del conversor de HTML | Ninguna |
| Una fórmula en una columna auxiliar | Una tabla que regeneras a menudo | Lo que tú escribas en ella | Formatos numéricos, salvo que uses `TEXT` | Ninguna |
| Un complemento de Office | Hacerlo dentro de Excel, repetidamente | Lo que el complemento implemente | Varía; puede mandar el rango a un proveedor | Complemento, a veces con aprobación del administrador |
| Una macro VBA | Un libro que controlas tú | Exactamente lo que programas | Nada que no hayas elegido | Ninguna, pero el archivo pasa a ser `.xlsm` |
| Office Scripts | Excel en la web, automatización compartida | Exactamente lo que programas | Necesita una cuenta de Microsoft 365 apta | Ninguna |
| Descarga de Google Sheets | Evitarte las decisiones de codificación de Excel | UTF-8 sin discusión | Las mismas limitaciones que cualquier CSV | Ninguna |
| Exportación de LibreOffice Calc | Control explícito del archivo de texto | El juego de caracteres y el entrecomillado que elijas | Igual que cualquier CSV | LibreOffice |
| Volver a teclearlo | Cinco filas y cuatro columnas | Tu atención | Veinte minutos, a escala | Ninguna |

## Las rutas, una a una

### Subir el `.xlsx` directamente — saltándote la exportación por completo

El libro ya es un zip de XML — eso es lo que significa `.xlsx` — así que un conversor puede leerlo igual que lee un `.docx`, sin ningún paso intermedio de guardar como. [La conversión de Excel a tabla Markdown de TransformPipe](/excel-to-markdown) hace exactamente eso: suelta el libro, y cada hoja con filas se convierte en su propia tabla, con un índice en cuanto hay más de una hoja. Nadie abre Excel, nadie elige una codificación, y no hay ningún CSV intermedio que perder o renombrar mal.

| A favor | En contra |
| --- | --- |
| Sin diálogo de guardar como, sin codificación que elegir mal | Sigue siendo la lectura que hace un conversor de navegador del archivo — revisa las pérdidas de la chuleta de arriba |
| Todas las hojas del libro, no solo la activa | Fórmulas, formatos y celdas combinadas se descartan, igual que en cualquier otra ruta |
| Las fechas salen como fechas ISO normales en vez de números de serie | Nada rescata un valor que Excel ya estropeó al escribirlo |
| Corre en el navegador: el libro nunca se sube | Un `.xlsm` con macros o un archivo protegido con contraseña necesita otra ruta |

**Precio:** gratis, y el archivo se queda en tu máquina — algo que conviene confirmar en una hoja de cálculo, ya que suelen ser de los documentos más sensibles que convierte cualquiera.

**¿Para quién es?** Para quien quiera la tabla sin ningún paso de exportación, sobre todo un libro con varias hojas: una subida produce un documento con índice, en vez de una exportación CSV por hoja.

### Guardar como CSV y convertir — la ruta que funciona en cualquier otro sitio

Usa `Archivo > Guardar como`, elige `CSV UTF-8 (delimitado por comas) (*.csv)`, acepta los dos avisos que muestra Excel, y luego convierte el archivo de texto resultante. Es la opción más aburrida y la única que se comporta igual en cualquier máquina, cualquier configuración regional y cualquier tamaño de archivo.

| A favor | En contra |
| --- | --- |
| Produce un archivo de texto plano que cualquier conversor puede leer | Solo se guarda la hoja activa |
| CSV UTF-8 conserva los caracteres acentuados y los no latinos | Las fórmulas pasan a ser valores, los formatos pasan a ser cadenas |
| El archivo intermedio se puede inspeccionar — ábrelo y mira | El BOM del principio hace tropezar a los lectores descuidados |
| Funciona igual en toda versión de Excel que ofrezca el formato | Una configuración regional con coma decimal cambia el delimitador |

**Precio:** gratis. Excel no lo es, pero la exportación va incluida, y todo conversor que merezca la pena en el otro extremo es gratis.

**Detalles técnicos**

- La lista de guardar como de Excel tiene varios formatos de texto: `CSV`, `UTF8 CSV`, `Macintosh CSV`, `Windows CSV`, `MSDOS CSV` y `Unicode Text`, expuestos a las macros como `xlCSV`, `xlCSVUTF8`, `xlCSVMac`, `xlCSVWindows`, `xlCSVMSDOS` y `xlUnicodeText` (comprobado en learn.microsoft.com, el 8 de septiembre de 2026).
- Guardar como CSV muestra un diálogo que «recuerda que solo se guardará en el nuevo archivo la hoja de cálculo actual», y un segundo aviso de que la hoja puede contener funciones que el formato de texto no admite (comprobado en support.microsoft.com, el 8 de septiembre de 2026).
- El delimitador de campo sigue el separador de lista del sistema, que se puede cambiar en la configuración regional de Windows y en las propias opciones de separador de Excel (comprobado en support.microsoft.com, el 8 de septiembre de 2026).
- Lo que llega al archivo para una celda con formato suele ser la cadena que muestra la celda, no el valor subyacente. Eso significa que una celda con `2,3456` mostrada a dos decimales escribe `2,35`, y una fecha se escribe en el orden que use el formato de la celda. Abre el CSV una vez en un editor de texto y sabrás exactamente qué hace tu copia de Excel.

Luego convierte el CSV. [La conversión de CSV a tabla Markdown](/csv-to-markdown) de un conversor de navegador analiza el archivo correctamente en vez de dividirlo por comas, cosa que importa en el momento en que una celda contiene una, y lo hace en tu máquina, así que las filas no se suben — un documento guardado tiene un límite de 4 MB y la conversión en sí de 10 MB, mucho más de lo que nadie va a leer en una tabla. El campo más amplio de herramientas de línea de comandos y librerías se cubre en [la comparativa de conversores de CSV](/blog/best-csv-to-markdown-converters); Pandoc, Miller y `pandas.to_markdown` leen todos el CSV correctamente y son la respuesta acertada dentro de una compilación.

**¿Para quién es?** Para quien esté convirtiendo una hoja entera, y para quien vaya a tener que repetirlo el mes que viene. El CSV intermedio es la característica: es un archivo que puedes leer, comparar y revisar antes de que se convierta en una tabla.

### Copiar el rango y pegarlo — la ruta rápida

Selecciona las celdas, copia, y pega en un conversor que acepte texto pegado. Es la ruta correcta para un rango en vez de una hoja entera, y es más rápida que un guardar como por cerca de un minuto. Lo que la hace funcionar es que Excel no pone CSV en el portapapeles.

| A favor | En contra |
| --- | --- |
| Sin archivo, sin diálogo, sin codificación que elegir | Una celda con un salto de línea rompe el pegado |
| El texto separado por tabuladores es más fácil de dividir que el CSV | Los formatos numéricos llegan como cadenas de visualización |
| Funciona con una selección, no con una hoja entera | Fórmulas e hiperenlaces no están en el texto plano |
| Sin instalación, y nada se escribe en el disco | Solo lo que seleccionaste, así que el encabezado es cosa tuya |

**Detalles técnicos — lo que lleva de verdad el portapapeles**

| Formato | Forma | Úsalo para |
| --- | --- | --- |
| Texto plano | Separado por tabuladores, `CRLF` entre filas, entrecomillado solo donde un valor contiene un tabulador, un salto de línea o una comilla | Casi cualquier conversión |
| HTML | Una `<table>` real con filas, celdas, estilos en línea, `colspan` y `rowspan`, y `<a href>` para los enlaces | Conservar el énfasis y los enlaces |
| Formatos propios de Excel | Binario, para pegar de vuelta en una hoja | Nada, fuera de Excel |

El formato de texto plano es en la práctica TSV con el entrecomillado al estilo CSV, y eso es mejor noticia de lo que parece. Una coma dentro de un valor no hace daño porque el delimitador es un tabulador, y los tabuladores son raros dentro de las celdas de una hoja de cálculo porque pulsar Tab mueve a la celda siguiente. Así que el caso patológico que arruina un análisis de CSV ingenuo — `Pérez, Juan` en un solo campo — no cuesta nada aquí.

El caso que sí lo arruina es una celda con un salto de línea, escrito con Alt+Intro. Excel pone ese valor entre comillas dobles y el salto de línea pasa intacto al portapapeles, así que una herramienta que divide el texto pegado por saltos de línea ve una fila convertirse en dos, y todas las filas posteriores se desplazan. Búscalas en la hoja antes de copiar: suelen ser direcciones, notas y descripciones de producto.

**¿Para quién es?** Para quien tenga el libro abierto y un rango concreto en mente. Es la ruta a la que recurrir cuando la respuesta solo necesita doce filas de las novecientas.

### Pegar como HTML y convertir el HTML — cuando el formato importa

Si el énfasis y los enlaces importan, no pegues como texto. Pega en algo que acepte el formato HTML del portapapeles — un campo de texto enriquecido, o un editor que pega contenido con formato — y convierte ese HTML a Markdown en su lugar.

| A favor | En contra |
| --- | --- |
| La negrita, la cursiva y los hiperenlaces sobreviven como Markdown | El HTML del portapapeles de Excel es verboso y lleno de estilos `mso-` |
| Las celdas combinadas llegan como `colspan` y `rowspan` de verdad | Que la tabla Markdown de todos modos no puede expresar |
| Los bordes de celda y la alineación son visibles para el conversor | La mayoría de conversores ignoran ambos |
| Sin instalación si el conversor corre en el navegador | Dos conversiones son dos ocasiones de perder algo |

El trato es honesto: conservas el formato en línea y sigues perdiendo la estructura, porque una tabla Markdown no tiene manera de decir que una celda abarca tres columnas. Un conversor al que le dan un `colspan` o lo descarta y produce una fila irregular, o repite el valor, o recurre a emitir una tabla HTML sin más. [Qué hace exactamente tu conversor de HTML a Markdown con eso](/blog/best-html-to-markdown-converters) conviene saberlo antes de pegar un encabezado combinado en uno.

**¿Para quién es?** Para tablas donde una columna lleva enlaces, o donde el énfasis lleva significado — una columna de estado, una lista de referencias.

### Construir la fila con una fórmula — la ruta que se queda en la hoja

Puedes hacer que el propio Excel escriba el Markdown. Pon esto en una columna auxiliar junto a una tabla de cinco columnas y arrástralo hacia abajo:

```
="| " & TEXTJOIN(" | ", FALSE, A2:E2) & " |"
```

`TEXTJOIN` toma un delimitador, un indicador `ignore_empty` y hasta 252 argumentos o rangos de texto (comprobado en support.microsoft.com, el 8 de septiembre de 2026). Pasa `FALSE` en `ignore_empty` y hazlo a propósito: con `TRUE`, una celda vacía se omite en vez de emitirse, la fila sale corta de una barra, y los valores tras el hueco se desplazan una columna a la izquierda. Es el error más habitual con este truco, con diferencia.

Dos detalles más. La concatenación ignora el formato numérico de la celda, así que una fecha llega como su número de serie y un valor de moneda pierde su símbolo; envuelve esas celdas en `TEXT(A2, "aaaa-mm-dd")` para controlar tú la cadena. Y un valor que contenga una barra vertical terminará una celda antes de tiempo, así que pásalo por `SUBSTITUTE(A2, "|", "\|")` en una columna de preparación si tus datos llevan rutas de archivo o listas de opciones.

La fila separadora se escribe a mano, una vez:

```
| Pieza | Descripción | Cant. | Precio | Estado |
| --- | --- | --- | ---: | --- |
```

Después copia la columna auxiliar y pégala bajo esas dos líneas. El portapapeles entrega las filas sin comillas, porque una fila así construida no contiene ni tabuladores ni saltos de línea.

| A favor | En contra |
| --- | --- |
| La tabla se regenera cuando cambian los datos | Estás escribiendo un conversor a base de fórmulas |
| Sin instalación, sin subida, sin una segunda herramienta | El escapado y los formatos numéricos son enteramente cosa tuya |
| Funciona sobre una vista filtrada u ordenada | Incómodo a partir de unas seis columnas |
| `TEXT` da control exacto sobre las fechas | Nada comprueba tu salida |

**¿Para quién es?** Para una tabla publicada desde la misma hoja cada semana. La columna auxiliar es un paso de compilación que vive dentro del libro.

### Complementos, macros y Office Scripts — convertir dentro de Excel

Hay tres formas de convertir la conversión en un botón dentro de Excel en vez de un viaje a otra herramienta, y se diferencian sobre todo en quién escribió el código y dónde se ejecuta.

Un **complemento de Office** instalado desde AppSource corre en una vista web dentro de Excel y lee el libro a través de la API de JavaScript de Office. Júzgalo por dos preguntas antes de instalarlo: si el rango se procesa localmente o se envía al servicio del proveedor, algo que su declaración de privacidad debería decir con claridad, y si tu organización permite complementos siquiera — en entornos de Microsoft 365 gestionados, a menudo un administrador tiene que aprobarlos. No supongas que la ficha del marketplace implica ninguna de las dos cosas.

Una **macro VBA** es la versión en la que el código es tuyo. No tiene dependencias, ni acceso a la red salvo que tú lo escribas, ni proveedor. Los costes son reales: el libro tiene que guardarse como `.xlsm` para conservar la macro, las macros en archivos que llegaron de internet se bloquean por defecto y hay que desbloquearlas a propósito, y ahora mantienes una rutina de escapado que alguien escribió una vez y nadie prueba. Dado que un guardar como cuesta diez segundos, una macro merece la pena solo cuando la conversión ocurre según un calendario.

**Office Scripts** es la automatización en TypeScript integrada en Excel en la web para las cuentas de Microsoft 365 elegibles. Es mejor sitio que VBA para automatización compartida y versionada, y no está disponible en toda licencia, así que compruébalo antes de planificar en torno a ello. **Python en Excel** es una cuarta posibilidad y lleva una advertencia concreta: el Python corre en la nube de Microsoft en vez de en tu máquina, así que los datos salen del edificio aunque el archivo no lo haga.

| A favor | En contra |
| --- | --- |
| Un botón, dentro de la aplicación | Alguien tiene que mantener el código |
| Sin manejo de archivos, sin portapapeles | Los complementos pueden transmitir el rango; los scripts pueden necesitar licencia |
| Repetible en todo un equipo | La configuración más laboriosa de esta lista |

**¿Para quién es?** Para equipos que convierten hojas con suficiente frecuencia como para que los diez segundos importen, y dispuestos a mantener algo por ello.

### Google Sheets y LibreOffice Calc — el mismo trabajo con mejores valores por defecto

Si el libro no está atado a Excel, otras dos hojas de cálculo hacen menos discutible el paso del archivo de texto.

Google Sheets exporta la hoja actual con `Archivo > Descargar > Valores separados por comas`, en UTF-8, sin diálogo y sin preguntas sobre página de códigos. Las limitaciones de la hoja de cálculo son idénticas — una hoja, valores en vez de fórmulas, celdas combinadas aplanadas — pero la pregunta de la codificación no llega a plantearse.

LibreOffice Calc va por el otro lado y te pregunta todo. Guardar como CSV de texto abre un diálogo con el juego de caracteres, el delimitador de campo, el delimitador de cadena, «Entrecomillar todas las celdas de texto» y «Guardar contenido de celda tal como se muestra» — esa última casilla es el control explícito que Excel no ofrece, porque al desmarcarla se escriben los valores subyacentes en vez de las cadenas mostradas. Si alguna vez has querido que una fecha se exporte como `2026-09-03` sin importar el formato de la celda, ese es el interruptor.

| A favor | En contra |
| --- | --- |
| Sheets: UTF-8 sin decisiones que tomar | Sheets: el archivo pasa por tu cuenta de Google |
| Calc: juego de caracteres, entrecomillado y delimitador explícitos | Calc: una instalación, y un diálogo que entender |
| Calc: valor mostrado o valor subyacente, a tu elección | Ambos: las mismas pérdidas que cualquier ruta CSV |

**¿Para quién es?** Para quien ya esté en Sheets, y para quien ya se haya visto una vez perjudicado por los valores por defecto de codificación de Excel y quiera que la decisión sea visible.

## Lo que Excel hace con tus valores cuando escribe CSV

Esta es la sección para leer dos veces, porque casi nada de esto es reversible y nada se anuncia.

| El valor | Lo que sale | Por qué |
| --- | --- | --- |
| `00417` escrito en una celda General | `417` | Se convirtió en número al escribirse. Los ceros nunca estuvieron en el archivo |
| Un número de tarjeta o cuenta de 16 cifras | Las cifras a partir de la 15ª se vuelven ceros | Excel tiene «una precisión máxima de 15 cifras significativas» y «cualquier cifra a partir de la decimoquinta se redondea a cero» (comprobado en support.microsoft.com, el 8 de septiembre de 2026) |
| Un número muy grande | `1,23E+15` | La notación científica de la pantalla se convierte en notación científica en el texto |
| `2,3456` mostrado a dos decimales | `2,35` | La cadena mostrada, no el valor almacenado |
| Una fecha | El formato de visualización de la celda, en el orden de la configuración regional | Por lo que `03/09/2026` es ambigua fuera de la hoja |
| `=B2*C2` | El resultado | El CSV no tiene fórmulas |
| Un porcentaje | Normalmente con el signo `%` | La visualización otra vez — revisa tu archivo |
| Un valor con separador de millares | A menudo `1.234,50`, entrecomillado | La coma o el punto están en la cadena, así que el campo hay que entrecomillarlo |
| Una celda con Alt+Intro dentro | Un campo entrecomillado que contiene un salto de línea real | Que un lector basado en líneas manejará mal salvo que analice el CSV correctamente |
| Texto que empieza por `=`, `+`, `-` o `@` | El mismo texto | Inofensivo como Markdown; una hoja que reabra el CSV puede tratarlo como una fórmula |

Las dos primeras filas son las que cuestan dinero de verdad. Los ceros iniciales y los identificadores largos se destruyen al escribirlos, antes de cualquier exportación, y el remedio es la prevención: formatea la columna como Texto antes de pegar los datos, o antepón un apóstrofo a cada valor. La propia documentación de Microsoft es explícita en que estos pasos «solo afectan a los números introducidos después de aplicar el formato» y no restaurarán lo que ya se truncó (comprobado en support.microsoft.com, el 8 de septiembre de 2026). Si una columna de referencias ya se lee `417`, la hoja ya no sabe que era `00417`, y tampoco lo sabrá el Markdown.

La fila de la fecha es la que provoca discusiones en vez de pérdidas. Un CSV lleva la cadena que mostraba la celda, así que una hoja británica exporta `03/09/2026` y un lector americano lo interpreta como marzo. Si la tabla va a viajar a otro país, fuerza fechas ISO antes de exportar — una columna auxiliar con `TEXT(A2, "aaaa-mm-dd")`, o la casilla «Guardar contenido de celda tal como se muestra» de Calc desactivada.

## Las celdas combinadas no tienen equivalente en Markdown

No hay colspan en una tabla Markdown. No hay rowspan. La cuadrícula de barras verticales es estrictamente rectangular, una línea por fila, y la fila de encabezado fija el número de columnas para toda la tabla. Una región combinada no se puede expresar, ni aproximar, ni siquiera sugerir.

Lo que ocurre al salir es previsible: el valor se queda en la celda superior izquierda de la región combinada y las demás celdas quedan vacías. Así que un encabezado que abarca `T1`, `T2` y `T3` se exporta como `2026` seguido de dos huecos, y la tabla Markdown termina con una primera fila con una sola etiqueta y dos columnas sin nombre.

Cuatro salidas, en el orden en que yo las probaría:

1. **Separar y rellenar.** Desactiva Combinar y centrar, y luego repite la etiqueta a lo largo o hacia abajo. La tabla queda más fea en la hoja y correcta en todas partes.
2. **Sacar la etiqueta combinada fuera de la tabla.** Una celda combinada que abarca toda una tabla casi siempre es un título. Convierte eso en un encabezado por encima de la tabla, o en la frase de leyenda de la tabla, y borra la fila.
3. **Dividir en dos tablas.** Dos grupos de columnas combinadas suelen ser dos tablas que se pegaron para imprimirlas. Publicarlas por separado suele quedar más claro que el original.
4. **Emitir una `<table>` HTML sin más.** El HTML dentro de Markdown puede llevar `colspan`, y se renderiza donde se permita HTML sin filtrar. Se muestra como marcado literal donde no se permite, un filtro de seguridad estricto puede eliminarlo, y has renunciado a la fuente legible en texto plano que era la razón de usar Markdown. Es el último recurso, no la respuesta ingeniosa.

Ten en cuenta que las tablas no están en el CommonMark puro en absoluto, así que la tabla de barras verticales corriente ya es una extensión — una que GitHub Flavored Markdown y la mayoría de conversores implementan, y que un analizador CommonMark estricto renderiza como un párrafo lleno de barras verticales. [Qué motor está haciendo el renderizado](/blog/commonmark-gfm-and-the-flavours) decide si tu tabla es una tabla antes de que nada de esto importe.

## La cuestión de la codificación: un BOM, una página de códigos ANSI y un punto y coma

La exportación de texto de Excel tiene tres maneras distintas de entregarte un archivo técnicamente correcto y que se lee como jerigonza.

**El BOM.** `CSV UTF-8` escribe una marca de orden de bytes — los tres bytes `EF BB BF` — antes del primer carácter. La mayoría de lectores la eliminan. Los que no ponen un carácter invisible al principio de tu primera celda de encabezado, así que la columna se llama `﻿Pieza` en vez de `Pieza`. Se ve bien en pantalla y falla en cualquier comparación que hagas contra ella. Puedes verlo en un segundo:

```
head -c 3 pedidos.csv | xxd
```

Si eso imprime `efbbbf`, hay un BOM. En Windows sin una shell POSIX, un editor que muestre la codificación en su barra de estado te dice lo mismo.

**La página de códigos.** El `CSV (delimitado por comas)` normal no escribe UTF-8. Escribe la página de códigos ANSI de tu sistema — Windows-1252 en Europa Occidental — y cualquier carácter fuera de ella se sustituye, de forma permanente, normalmente por un signo de interrogación. Una columna de nombres griegos o japoneses no sobrevive a ese guardado, y ningún conversor posterior puede recuperarla. Incluso dentro de la página de códigos, el archivo es mojibake para un lector UTF-8: la `£` llega como `Â£`, un apóstrofo curvo como `â€™`, una raya como `â€“`. Si alguna vez has visto una `Â` suelta esparcida por una tabla convertida, esta fue la causa.

**El delimitador.** El separador sigue el separador de lista del sistema, así que en configuraciones regionales donde el separador decimal es la coma, Excel escribe puntos y coma en su lugar. Un lector que solo entiende comas ve entonces una tabla enorme de una sola columna: cada fila se convierte en una celda que contiene todos los valores. Es un fallo evidente en cuanto lo conoces, y desconcertante la primera vez. O cambia el separador de lista en la configuración regional antes de exportar, o usa un conversor con una opción explícita de delimitador.

Una trampa más que merece nombrarse: `Unicode Text (*.txt)` es texto delimitado por tabuladores en UTF-16, con su propio BOM. Un conversor que espera UTF-8 ve un byte nulo entre cada letra y normalmente informa de que el archivo es binario.

La regla práctica es corta. Elige `CSV UTF-8`, comprueba los tres primeros bytes una vez para la máquina desde la que exportas, y si el delimitador es un punto y coma, sabe que es un ajuste regional y no un fallo.

## Dónde falla la ruta fiable, y lo que cuesta

Guardar como CSV es la opción correcta por defecto y tiene cinco costes que conviene decir con claridad.

**Una hoja a la vez.** Excel guarda la hoja activa y te avisa de que lo hace. Un libro de doce pestañas son doce exportaciones, doce conversiones y doce tablas, y no hay salida combinada porque el CSV no tiene ningún concepto de una segunda hoja. Si las pestañas son un mismo conjunto de datos dividido por mes, consolídalo dentro de Excel antes de exportar.

**Las fórmulas desaparecen, y con ellas la fuente de verdad.** Una tabla publicada de valores está bien hasta que alguien pregunta de dónde salió un número. El libro todavía lo sabe; el Markdown no. Para una tabla que regeneras, mantén la hoja como la fuente y el Markdown como un artefacto — nunca edites la tabla esperando que la hoja se entere.

**El significado que vivía en el formato.** El formato condicional, los rellenos y los colores de fuente llevan información en muchísimas hojas de cálculo reales: rojo para lo atrasado, gris para lo sustituido, negrita para un total. Todo eso se descarta, y el lector del Markdown no puede saberlo. El arreglo es trasladar el significado a los datos — añadir una columna `Estado`, marcar los totales con una palabra en vez de con un peso —, que es un trabajo que el conversor no puede hacer por ti.

**Lo que ocultaba el filtro.** Si dejaste un autofiltro o columnas ocultas, compara el archivo exportado con lo que veías en pantalla en vez de suponer; el hábito seguro es copiar el rango visible en lugar de exportar la hoja entera cuando hay un filtro activo.

**El ancho que nadie va a leer.** Una tabla de cuarenta columnas es Markdown legal e ilegible como salida: o se desplaza hacia los lados o se envuelve en pura pulpa, y el texto crudo se vuelve imposible de editar a mano. Es un fallo de diseño más que de conversión, y las respuestas son recortar columnas, transponer una tabla pequeña para que los campos corran hacia abajo, o aceptar que algunos datos quieren seguir siendo una hoja de cálculo y enlazar al archivo en su lugar.

Hay un sexto coste que no tiene que ver con los datos. Alguien tiene que revisar el resultado. Convierte la hoja y luego lee la primera fila, la última fila, una fila con un carácter acentuado y una fila con un número largo. Son cuatro comprobaciones y unos treinta segundos, y atrapan casi todo lo de esta página.

## Cómo elegir

1. **Empieza por cuántas veces vas a hacer esto.** Una vez, y guardar como CSV está terminado antes de que hayas acabado de leer la declaración de privacidad de un complemento. Cada semana, y una columna auxiliar o un script se amortizan en un mes.
2. **Decide si necesitas un rango o una hoja.** Una selección quiere el portapapeles; una hoja quiere un archivo. Usar la ruta del archivo para doce filas significa exportar novecientas y borrar la mayoría.
3. **Busca celdas combinadas y saltos de línea con Alt+Intro antes de convertir, no después.** Son las únicas dos funciones de la hoja de cálculo que producen una tabla rota en vez de simplemente más plana, y las dos se arreglan en un minuto dentro de la hoja y tardan mucho más en depurarse en la salida.
4. **Elige la codificación a propósito si los datos no son ASCII puro.** `CSV UTF-8` para cualquier cosa con un acento, un símbolo de moneda o una escritura no latina. La opción CSV normal pierde esos caracteres en el momento de guardar, y nada después puede devolverlos.
5. **Pregúntate a dónde van las filas.** Para una tabla de licencias de código abierto no importa. Para nóminas, datos de pacientes o cifras sin publicar es la pregunta entera, y un conversor que corre en tu navegador te deja verificar la respuesta mirando cómo el panel de red no hace nada.

## Conclusión

El resumen honesto de Excel a Markdown es que la conversión es fácil y la hoja de cálculo es difícil. Guarda la hoja como CSV UTF-8, convierte el CSV, y dedica el tiempo ahorrado a revisar las tres cosas que se rompen: identificadores cuyos ceros iniciales desaparecieron cuando se escribieron, fechas cuyo orden depende de quien las lee, y celdas combinadas que Markdown no puede expresar y que se aplanarán en silencio. Para un rango seleccionado, pégalo en su lugar — el formato separado por tabuladores del portapapeles es de verdad más fácil de analizar que cualquier CSV, y TransformPipe convierte las filas pegadas igual que convierte un archivo, en el navegador, sin subir nada cuando no has iniciado sesión. En cualquier caso, lee la primera y la última fila del resultado antes de publicarlo. La herramienta no puede saber que `417` fue antes `00417`, y tú sí puedes.

## Preguntas frecuentes

### ¿Cómo convierto un archivo de Excel a una tabla Markdown?

Guarda la hoja como `CSV UTF-8 (delimitado por comas)` y convierte ese CSV con cualquier conversor que analice el CSV correctamente en vez de dividirlo por comas. Para parte de una hoja en lugar de toda ella, copia el rango y pégalo en un conversor que acepte texto pegado — Excel pone en el portapapeles una versión separada por tabuladores de las celdas, más fácil de analizar que un CSV.

### ¿Puedo pegar directamente desde Excel en un archivo Markdown?

No de forma útil. Lo que llega a un editor de texto plano son valores separados por tabuladores sin barras verticales y sin fila separadora, así que se renderiza como un bloque de texto en vez de como una tabla. Pégalo en un conversor, o construye las filas en la hoja con `TEXTJOIN` y pega el Markdown ya terminado.

### ¿Por qué desaparecieron mis ceros iniciales?

Porque Excel convirtió el valor en número al escribirlo, mucho antes de cualquier exportación — `00417` se convirtió en el número 417 y el archivo nunca contuvo los ceros. Formatea la columna como Texto antes de introducir o pegar los datos, o antepón un apóstrofo a cada valor; ninguna de las dos cosas restaurará valores que ya se convirtieron.

### ¿Por qué mi CSV exportado usa puntos y coma en vez de comas?

Porque el delimitador sigue el separador de lista de tu sistema, y en configuraciones regionales que usan la coma como separador decimal ese ajuste es un punto y coma. Cambia el separador de lista en la configuración regional de Windows antes de exportar, o usa un conversor que te deje especificar el delimitador. Un lector que solo entiende comas convierte todo el archivo en una sola columna.

### ¿Qué pasa con las celdas combinadas?

Se aplanan: el valor va a la celda superior izquierda de la región combinada y el resto sale vacío. Las tablas Markdown no tienen colspan ni rowspan, así que los únicos arreglos son separar y repetir la etiqueta, sacar un encabezado combinado de la tabla y convertirlo en un título, dividir la tabla en dos, o recurrir a una tabla HTML sin filtrar.

### ¿Convertir una hoja de cálculo significa subirla?

Solo si la herramienta funciona así, y muchas lo hacen. Un conversor que corre en el navegador lee el archivo en tu propia máquina, cosa que puedes confirmar abriendo el panel de red y viendo que nada sale — algo que merece la pena hacer una vez con cualquier herramienta a la que planees darle datos reales, ya que las hojas de cálculo suelen guardar las filas más sensibles que convierte cualquiera.

### ¿Puedo conservar la negrita y los hiperenlaces de la hoja?

Solo a través del formato HTML del portapapeles, que lleva enlaces `<a href>` y estilos en línea, y solo si conviertes ese HTML a Markdown en vez de pegar como texto plano. El formato de texto plano tiene valores y nada más, y una exportación CSV no tiene ningún formato en absoluto.

### ¿Tengo que exportar primero a CSV?

No, si el conversor lee `.xlsx` directamente — el formato es un zip de XML, la misma forma que un `.docx`, así que un conversor que abre archivos zip puede leer las hojas de un libro sin ningún archivo de texto intermedio. La ruta del CSV sigue siendo útil para herramientas que solo aceptan texto plano, o para el momento en que quieres inspeccionar los valores en un editor antes de que se conviertan en una tabla.
