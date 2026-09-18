---
title: "Notas al pie en Markdown: la sintaxis, y quién la renderiza de verdad"
description: "Las notas al pie no están en ninguna especificación de Markdown: la sintaxis que aceptan GitHub y Pandoc, qué parsers la renderizan y qué hacer si uno no lo hace"
date: 2026-08-19
tag: Sintaxis
keywords: notas al pie markdown, sintaxis nota al pie markdown, nota al pie no funciona markdown, notas al pie github markdown, notas al pie pandoc, markdown-it-footnote, notas al pie en linea markdown
---

### Resumen rápido

Las notas al pie no están en CommonMark ni en la especificación de GitHub Flavored Markdown, así que cualquier herramienta que renderiza `[^1]` lo hace como una extensión, y cualquiera que no la renderiza imprime tus corchetes como texto literal. GitHub las renderiza en su sitio, Pandoc las renderiza, Hugo las renderiza, y markdown-it, remark, Python-Markdown y Goldmark las renderizan en cuanto añades el plugin o la extensión por su nombre. marked no lo hace, salvo con una extensión de terceros, y un parser estrictamente CommonMark nunca lo hará. Si una nota al pie tiene que atravesar una cadena de herramientas que no controlas, escribe la aclaración dentro de la propia frase o construye tú la referencia y el ancla a mano, porque una nota al pie que se convierte en silencio en `[^1]` en tu página publicada es la forma más común en que esta función falla.

Escribiste `[^1]` en un párrafo y `[^1]: la nota` al final del archivo. En GitHub se ve perfecto: un pequeño número volado, una línea cerca del final, la nota debajo, una pequeña flecha que te lleva de vuelta. Conviertes el mismo archivo con otra cosa, y la página contiene, en medio de una frase, los cuatro caracteres `[^1]`.

No hay nada roto. El conversor parseó tu archivo correctamente y renderizó exactamente lo que dice su especificación que hay que renderizar. Las notas al pie no están en esa especificación. No están en ninguna especificación — ni en CommonMark, ni en la especificación de GFM, ni en la página de sintaxis del Markdown.pl original. Existen porque PHP Markdown Extra inventó una sintaxis para ellas a mediados de los 2000, todo el mundo copió esa sintaxis, y GitHub terminó lanzándola en su propio sitio sin añadirla a la especificación que publica. Esa historia es toda la razón por la que este artículo tiene que existir.

Así que hay dos preguntas que merecen respuesta, y son distintas. La primera es cuál es la sintaxis, porque casi todas las implementaciones copiaron la misma y las diferencias están en los rincones. La segunda es qué herramientas la entienden, porque eso decide si tu documento sobrevive el viaje. Este artículo responde ambas, y luego cubre la parte que nadie escribe: qué hacer cuando la respuesta a la segunda pregunta es «esta no».

## La sintaxis, tal como la aceptan GitHub y Pandoc

Una nota al pie son dos fragmentos de texto en dos sitios distintos. La referencia va donde debería aparecer el número. La definición va donde tú quieras, y el renderizador la mueve al final.

```markdown
The estimate assumed a fixed exchange rate.[^1]

[^1]: Which it was not, for most of the period in question.
```

La referencia es un acento circunflejo dentro de corchetes. La definición es el mismo token, seguido de dos puntos, al principio de una línea. Esa es la forma que documenta GitHub, la forma que documenta Pandoc, la forma que documenta Python-Markdown, y la forma que implementa cada plugin de más abajo. Apréndela una vez.

**Los identificadores no tienen que ser números.** `[^longnote]`, `[^exchange-rate]` y `[^a]` son todos válidos, y usar palabras en vez de dígitos suele ser la mejor idea, porque el número que ve un lector se genera a partir del orden de las referencias, no de lo que escribiste. Pandoc lo dice sin rodeos: los identificadores no pueden contener espacios, tabulaciones, saltos de línea, ni los caracteres `^`, `[` o `]`. Todo lo demás vale.

**El número que ves no es el identificador que escribiste.** Esto sorprende a quien etiqueta sus notas `[^7]` y `[^2]` esperando que la salida diga 7 y 2. Los renderizadores numeran las notas al pie en el orden en que aparecen las referencias en el texto, y luego renumeran la lista del final para que coincida. Etiquétalas `[^precio]` y `[^fuente]` y la confusión desaparece, porque dejas de esperar que tus etiquetas sobrevivan.

**Las definiciones pueden vivir en cualquier parte del archivo.** La propia documentación de GitHub es explícita: el contenido de la nota al pie aparece al final del documento renderizado sin importar dónde esté la definición en el origen. La mayoría de las implementaciones se comportan igual. Poner cada definición justo después del párrafo que la referencia mantiene el origen legible; reunirlas todas al final mantiene la prosa limpia. Ambas se renderizan idénticas.

**Una nota al pie puede contener más de un párrafo, si la sangras.** Aquí es donde las sintaxis se separan un poco, y de donde salen la mayoría de las notas malformadas. La regla de Pandoc es que los bloques siguientes se sangran para mostrar que pertenecen a la nota, y que puedes sangrar todo el párrafo o solo su primera línea. Python-Markdown pide cuatro espacios o un tabulador en las líneas de continuación. Sangrar con cuatro espacios satisface a los dos.

```markdown
[^longnote]: Here is the first paragraph of the note.

    And here is a second, indented by four spaces so it stays
    attached to the footnote rather than ending it.

        A code block, indented eight, still inside the note.

    - A list item, also inside the note.
```

Esa muestra merece la pena escribirla en lo que sea que renderice tus documentos, porque el modo de fallo es instructivo: un párrafo de continuación que perdió su sangría no produce un error. Produce una nota con un solo párrafo dentro y un párrafo suelto de prosa justo debajo de la línea de definición, que el renderizador coloca luego en el cuerpo del documento en el punto exacto donde estaba la definición. Te queda una frase sobre tipos de cambio en medio de la sección cuatro.

**Los saltos de línea dentro de una nota al pie siguen las reglas de siempre.** La documentación de GitHub señala que añadir dos espacios al final de una línea rompe la línea dentro de una nota al pie, exactamente como en cualquier otro sitio. Las reglas dentro de una nota son las mismas que fuera de ella.

**Una definición que nadie referencia tampoco es un error.** Borra la frase que contiene `[^3]` y deja `[^3]: …` al final, y las implementaciones difieren: algunas descartan la definición huérfana, algunas la renderizan como una nota sin ninguna referencia que apunte a ella, y algunas imprimen la línea de definición como texto literal porque ya no forma parte de un grupo de notas. Ninguna te avisa. Esta es la causa más común de una nota que «desapareció» — la referencia se borró junto con la frase que la rodeaba.

## Comparativa rápida: quién renderiza una nota al pie y quién la imprime

| Herramienta o especificación | Notas al pie | Cómo se consiguen | `^[…]` en línea | Licencia |
| --- | --- | --- | --- | --- |
| Especificación CommonMark | No | No disponible; los corchetes se renderizan como texto | No | Gratis, especificación |
| Especificación GFM | No | No está en la especificación, a pesar del sitio | No | Gratis, especificación |
| El propio renderizador de GitHub | Sí | Activado por defecto, salvo en wikis | No | Alojado |
| commonmark.js | No | Implementación de referencia; solo la sintaxis básica | No | Gratis, BSD |
| markdown-it | Plugin | `markdown-it-footnote` | Sí | Gratis, MIT |
| marked | No | Una extensión de terceros, o nada | No | Gratis, MIT |
| remark / unified | Plugin | `remark-gfm`, junto a tablas y listas de tareas | No | Gratis, MIT |
| Python-Markdown | Extensión | La extensión oficial `footnotes` | No | Gratis, BSD |
| Goldmark | Extensión | `extension.Footnote` | No | Gratis, MIT |
| Hugo | Sí | La extensión de notas de Goldmark, activada por defecto | No | Gratis, Apache 2.0 |
| Pandoc | Sí | La extensión `footnotes`, activada en su propio dialecto | Sí, `inline_notes` | Gratis, GPL |

Dos filas de esa tabla merecen énfasis, porque son las que atrapan a la gente. La especificación de GFM no contiene notas al pie; la palabra aparece una vez en ella, históricamente, describiendo lo que otras implementaciones añadieron a la sintaxis original. Y el sitio de GitHub las renderiza igualmente. Un parser que anuncia cumplimiento total de GFM e ignora `[^1]` no está roto ni está mintiendo — [la brecha entre la especificación y el sitio](/blog/commonmark-gfm-and-the-flavours) es exactamente este tipo de función.

## El HTML en que se convierte una nota al pie

Cada implementación produce las mismas tres cosas estructurales, con nombres distintos. Conocer la forma te dice qué darle estilo, contra qué sanear, y qué ha fallado cuando un enlace de nota al pie aparece en el sitio equivocado.

La referencia se convierte en un superíndice que contiene un enlace, y el enlace lleva su propio id para que algo pueda apuntar de vuelta. markdown-it-footnote emite esto:

```html
<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup>
```

Las definiciones se convierten en un contenedor al final del documento, con una lista ordenada dentro, un elemento por nota, cada uno con el id al que apunta la referencia:

```html
<hr class="footnotes-sep">
<section class="footnotes">
  <ol class="footnotes-list">
    <li id="fn1" class="footnote-item">
      <p>Which it was not, for most of the period in question.
        <a href="#fnref1" class="footnote-backref">&#8617;</a></p>
    </li>
  </ol>
</section>
```

Y la tercera cosa es ese último ancla: el enlace de vuelta. Es la parte que la mayoría de los esquemas de notas hechos a mano olvidan, y la que hace que las notas al pie sean útiles en vez de decorativas. Sin ella, un lector que hace clic en la nota 4 de un documento largo no tiene forma de volver a la frase que estaba leyendo salvo el botón atrás del navegador — que funciona, hasta que la página se alcanzó desplazándose en vez de con un enlace, momento en el que atrás sale del documento por completo.

Las implementaciones exponen el enlace de vuelta como una cadena configurable, lo cual es un buen indicio de cuánto les importa. La configuración de Goldmark en Hugo tiene un ajuste `backlinkHTML` para el marcado que se muestra al final de una nota, con un valor por defecto de una entidad de flecha de retorno. Python-Markdown tiene `BACKLINK_TEXT`, con valor por defecto `&#8617;`, y `BACKLINK_TITLE`, con valor por defecto `Jump back to footnote {} in the text` — un atributo `title` que existe precisamente porque una flecha por sí sola no le dice nada a un lector de pantalla. markdown-it-footnote no usa opciones para esto; sobrescribes sus reglas de renderizado, que es la misma capacidad con más trabajo de tecleo.

El par de ids es el mecanismo, y también es la parte frágil. `#fnref1` y `#fn1` son globales a la página. Dos documentos renderizados en una misma página, o un documento renderizado dos veces, y el segundo conjunto de referencias apunta a las notas del primer conjunto. Cada implementación seria tiene un ajuste para esto, más abajo, y cada implementación lo trae apagado de fábrica.

## Implementación por implementación

### markdown-it — un plugin, y las clases vienen incluidas

markdown-it no renderiza notas al pie por sí mismo. El plugin oficial, `markdown-it-footnote`, tiene licencia MIT y se instala desde npm como una dependencia más:

```bash
npm install markdown-it-footnote
```

```javascript
const md = require('markdown-it')().use(require('markdown-it-footnote'));
md.render(source);
```

**Qué obtienes:** el HTML mostrado arriba, con las clases `footnote-ref`, `footnotes-sep`, `footnotes`, `footnotes-list`, `footnote-item` y `footnote-backref`, todas las cuales tendrás que estilizar con CSS propio porque ninguna trae estilo incluido. También acepta notas en línea, cubiertas en su propia sección más abajo, algo que pocas implementaciones hacen.

**Para quién es:** cualquiera que ya use markdown-it, que es el caso de un buen número de aplicaciones y configuraciones de sitios estáticos. Si estás eligiendo un parser de JavaScript y las notas al pie son un requisito, este es el camino más corto — [la comparativa completa de parsers de JavaScript](/blog/markdown-to-html-in-javascript) cubre el resto de la decisión, pero en esta única característica markdown-it gana solo por tener un plugin oficial.

### remark y unified — las notas llegan con remark-gfm

remark trata las notas al pie como parte de GitHub Flavored Markdown, lo cual es una lectura defendible de lo que GitHub realmente renderiza aunque no sea lo que dice la especificación de GFM. `remark-gfm` añade cinco cosas juntas: enlaces automáticos literales, notas al pie, tachado, tablas y listas de tareas. Tiene licencia MIT.

**Qué obtienes:** nodos de nota al pie en el árbol mdast, lo que significa que puedes hacerles cosas antes de que se conviertan en HTML — contarlas, moverlas, comprobar que cada referencia resuelve, extraerlas a un documento separado. Ese es el sentido de remark, y las notas al pie son una de las pocas construcciones donde tener el árbol vale el peso de la canalización.

**Para quién es:** proyectos que ya corren sobre unified, y cualquiera que necesite validar notas al pie en vez de solo renderizarlas. Una canalización que hace fallar la compilación cuando una referencia no tiene definición son unas quince líneas de código con remark, e imposible con cualquier otra cosa de esta lista.

### marked — GFM, menos las notas al pie

marked implementa CommonMark y GFM y se detiene ahí. Sus opciones documentadas son `async`, `breaks`, `gfm`, `pedantic`, `renderer`, `silent`, `tokenizer` y `walkTokens`; no hay ninguna opción de notas al pie, porque las notas al pie no están en ninguna de las dos especificaciones a las que apunta. Cualquier cosa más allá de esa superficie pasa por su mecanismo de extensiones, y existe un paquete de terceros, `marked-footnote`, para exactamente esto.

**Qué pasa sin uno:** la referencia se renderiza como el texto literal `[^1]` dentro de tu párrafo, y la línea de definición se renderiza como un párrafo de texto literal que dice `[^1]: Which it was not…`. Sin aviso, sin error, sin ningún mensaje de función faltante. Dos líneas de texto donde esperabas una nota.

**Para quién es:** aplicaciones que necesitan velocidad y no necesitan notas al pie — cajas de comentarios, mensajes de chat, paneles de vista previa. Es un buen parser, con un alcance estrecho y honesto. El alcance es el problema aquí: los conversores construidos sobre marked heredan la brecha, y hay muchos, incluido el que corre la conversión de Markdown a HTML de este mismo sitio. Conviene saberlo antes de pegar un documento con notas al pie en cualquier conversor de navegador y confiar en el resultado.

### Python-Markdown — una extensión oficial con opciones

Python-Markdown incluye las notas al pie como una de sus extensiones estándar, con licencia BSD, activada por nombre:

```python
import markdown
html = markdown.markdown(source, extensions=['footnotes'])
```

**Qué obtienes:** referencias en superíndice, un bloque de notas, enlaces de vuelta, y más configuración que ningún otro de esta lista ofrece. `PLACE_MARKER` (por defecto `///Footnotes Go Here///`) te deja decidir dónde caen las notas en el documento en vez de aceptar que vayan al final. `BACKLINK_TEXT` y `BACKLINK_TITLE` controlan el enlace de vuelta. `SEPARATOR`, por defecto `:`, fija la cadena entre el prefijo y el nombre en los ids que genera, que es por lo que sus ids de nota al pie no se parecen a los de nadie más. `UNIQUE_IDS`, por defecto `False`, evita colisiones entre varias llamadas a `reset()` — el arreglo para renderizar varios documentos en una sola página. `USE_DEFINITION_ORDER` decide si la lista del final sigue el orden de las definiciones o el de las referencias.

**Para quién es:** scripts de compilación en Python, y sitios de MkDocs, donde ya es el motor. La extensión está en modo de mantenimiento según su propia documentación, que para una función tan estable es una descripción y no una advertencia. Si Python es donde ocurre tu conversión, [las opciones de Python al completo](/blog/markdown-to-html-in-python) cubren qué parser elegir como punto de partida.

### Goldmark y Hugo — apagada por defecto en una, encendida en la otra

Goldmark es el parser CommonMark que usan la mayoría de programas en Go, con licencia MIT, e incluye una extensión de notas al pie que su propia documentación describe como la sintaxis de PHP Markdown Extra. La activas explícitamente, como `extension.Footnote`, al construir el parser.

Hugo, que usa Goldmark, la activa por ti. Su configuración de marcado tiene una sección de notas al pie con `enable` puesto en `true` por defecto, una cadena `backlinkHTML`, y `enableAutoIDPrefix` puesto en `false`. Esa última opción es el arreglo para las colisiones de ids, y su valor por defecto es la razón de que dos páginas de Hugo renderizadas en una página de listado puedan tener enlaces de nota que apunten a las notas del otro.

**Para quién es:** programas en Go, y cada sitio de Hugo, cuyos autores en su mayoría no se dan cuenta de que las notas al pie son una extensión porque nunca las han visto fallar.

### CommonMark y commonmark.js — los corchetes, tal cual se escribieron

CommonMark se detiene en un núcleo que todos ya tenían en común, y las notas al pie nunca estuvieron en él. commonmark.js, la implementación de referencia escrita por los propios autores de la especificación, no tiene soporte de notas al pie ni ningún punto de extensión para añadirlo, por diseño. Tiene licencia BSD.

**Qué pasa:** `[^1]` es un párrafo que contiene un acento circunflejo entre corchetes. La especificación lo dice, la implementación de referencia lo hace, y cualquier discusión sobre si ese es el comportamiento correcto se resuelve leyendo la especificación.

**Para quién es:** para resolver justamente esa discusión. Cuando una diferencia de renderizado te hace dudar si una herramienta tiene un fallo o simplemente es estricta, este es el parser que te lo dice.

### Pandoc — el soporte más amplio, y la única opción de ubicación

El dialecto de Markdown propio de Pandoc tiene la extensión `footnotes` activada, y es la implementación más completa de la sintaxis que existe. Notas con varios bloques, identificadores con palabras, notas en línea, y la restricción sobre los caracteres del identificador están todas documentadas en vez de descubiertas por accidente.

**Qué obtienes además de la sintaxis:** dos opciones que nada más en esta lista tiene. `--reference-location` decide si las notas al pie van al final del bloque de nivel superior actual, al final de la sección actual, o al final del documento — la opción afecta a los escritores html, epub, markdown, muse y a varios de presentaciones. Y `--id-prefix` añade un prefijo a cada identificador y enlace interno en la salida HTML, que es la respuesta documentada al problema de ids duplicados cuando estás generando fragmentos para incluir en otras páginas. Si estás ensamblando una página a partir de muchos documentos convertidos, esa opción es la diferencia entre enlaces que funcionan y enlaces que todos apuntan a las notas del primer documento.

**Para quién es:** documentos en vez de páginas — cualquier cosa con notas, citas, o un formato de salida distinto de HTML. Es también la herramienta a la que recurrir cuando un archivo Markdown con notas al pie tiene que convertirse en un archivo de Word o un PDF, porque las notas al pie son una construcción nativa en ambos formatos y Pandoc sabe mapearlas. Pandoc es gratis y tiene licencia GPL, y la instalación es el único argumento real en contra para trabajos pequeños.

### GitHub — la razón por la que la gente escribe notas al pie

GitHub renderiza la sintaxis de notas al pie en archivos Markdown, issues, pull requests y discusiones, numerando las referencias en orden y reuniendo las notas al final del documento renderizado. Su documentación indica una única excepción sin rodeos: las notas al pie no están soportadas en wikis. Escribe una nota al pie en una página de wiki y obtienes los corchetes.

**Por qué importa más que las demás filas:** GitHub es donde la mayoría de la gente ve renderizarse una nota al pie por primera vez, y su comportamiento es lo que asumen que hace Markdown. Nada en el sitio te dice que esto es la extensión de un renderizador y no parte del lenguaje. El resultado es un suministro constante de archivos que funcionan en el único lugar donde se escribieron y en ninguna otra parte.

## Notas al pie en línea: el `^[…]` de Pandoc

Pandoc añade una segunda sintaxis que evita del todo el problema de las dos ubicaciones. Es una extensión separada, `inline_notes`, y la nota va donde habría ido la referencia:

```markdown
Here is an inline note.^[Inline notes are easier to write, since you
don't have to pick an identifier and move down to type the note.]
```

El manual dice que las notas en línea y las normales se pueden mezclar libremente en un documento, y que una nota en línea no puede contener varios párrafos — que es el trato que se hace. Renuncias a las notas largas y ganas no tener que inventar un identificador ni desplazarte hasta el final del archivo. Para una nota de una sola frase, es un buen trato.

Como es una extensión con nombre, puedes activarla y desactivarla explícitamente: `--from markdown+inline_notes` o `--from markdown-inline_notes`. Eso importa si estás consumiendo archivos de otra parte y quieres un dialecto predecible en vez de lo que sean los valores por defecto de Pandoc en ese momento.

`markdown-it-footnote` implementa la misma sintaxis, lo que la convierte en la única vía de JavaScript que acepta las dos formas. Nada más en esta lista lo hace. GitHub no: `^[una nota]` en GitHub es un acento circunflejo seguido de lo que parece un enlace roto, que es un fallo particularmente poco útil porque ni siquiera se parece a sintaxis de notas al pie para quien lee el origen.

La regla práctica es que las notas en línea son para documentos cuya cadena completa controlas tú. En el momento en que el archivo puede llegar a leerse en GitHub, o en un parser que no has comprobado, la forma con corchetes es la más segura de las dos, y el inconveniente de las dos ubicaciones es el precio de la portabilidad.

## Dónde fallan las notas al pie, y qué cuesta

La respuesta obvia — escribe notas al pie, funcionan bien — falla de cinco formas concretas, y las cinco son silenciosas.

**El literal silencioso.** Un parser sin la extensión renderiza tu referencia y tu definición como texto. No hay aviso en la consola ni ninguna pista visual salvo los propios corchetes, que los lectores pasan por alto como una errata. El coste es un documento publicado con `[^1]` dentro, descubierto por otra persona, casi siempre después de haberlo enviado a la gente. Este es el que hay que planificar, porque es el único que no puedes ver en una vista previa que use el mismo parser que la exportación.

**Colisiones de ids.** Los ids de nota al pie son `fn1`, `fnref1` y similares, generados por documento y únicos dentro de él. Pon dos documentos renderizados en una misma página — un índice de blog con entradas completas, una página de documentación que ensambla varios fragmentos, una vista de impresión de una sección entera — y el `#fn1` del segundo documento resuelve a la nota del primero. Los enlaces funcionan. Van al sitio equivocado. Hugo trae `enableAutoIDPrefix` apagado, Python-Markdown trae `UNIQUE_IDS` apagado, y el `--id-prefix` de Pandoc es algo que tienes que pasar tú, así que el valor por defecto en cada caso es el que está roto. El coste es una página donde cada enlace de nota después del primer documento está mal, y nada en ningún registro de compilación lo menciona.

**El saneador se come el bloque.** La salida de las notas al pie usa etiquetas que una lista blanca pensada para Markdown a menudo no incluye. `<section>` es la baja habitual: un saneador construido para permitir exactamente lo que produce un renderizador de GFM tiene encabezados, párrafos, listas, tablas, `<sup>` y `<a>` en la lista, y ningún `<section>`, porque el GFM puro nunca emite uno. Pasa el HTML de las notas por ahí y las referencias sobreviven como enlaces en superíndice mientras el bloque entero de notas desaparece, dejando un documento lleno de números que apuntan a nada. El coste es peor que perder las notas, porque la página sigue pareciendo terminada. Si estás saneando una salida convertida — y para cualquier cosa que no hayas escrito tú, [deberías estarlo](/blog/sanitising-markdown-safely) — añade el contenedor de notas a la lista blanca al mismo tiempo que añades la extensión al parser, y pruébalo con un archivo que tenga notas.

**Los viajes de ida y vuelta las pierden.** Un archivo Markdown con notas al pie convertido a HTML y de vuelta, o a Word y de vuelta, puede salir con las notas convertidas en párrafos normales al final y las referencias en simples números en superíndice. Pandoc mapea las notas a construcciones nativas en los formatos que las tienen, que es por lo que es la herramienta correcta para ese viaje. Un conversor genérico de HTML a Markdown no tiene forma de reconocer que una `<section class="footnotes">` fue alguna vez sintaxis de nota al pie, así que produce fielmente una lista de párrafos. El coste es un archivo que se renderiza de forma aceptable y que ya nunca se puede editar como notas al pie.

**Sorpresas de orden.** El número que ve un lector viene del orden de las referencias, y la lista del final se ordena o por orden de referencia o por orden de definición según la implementación — Python-Markdown lo convierte en una opción, `USE_DEFINITION_ORDER`, lo que te dice que los dos comportamientos existen de verdad en la práctica. Mueve un párrafo y los números se renumeran, lo cual es correcto y también significa que una nota referida en prosa como «ver la nota 4» es un pasivo de mantenimiento. El coste es pequeño y constante: nunca te refieras a una nota al pie por su número en el texto.

Hay un coste más, y es la razón para pensarlo antes de escribir cien notas al pie y no después. Un documento con notas al pie ya no es Markdown portable. Depende de la lista de extensiones de una herramienta concreta, y cada paso que le añadas a su cadena es un paso que puede no tener esa extensión. Las tablas tienen la misma propiedad y reciben más atención, porque [una tabla rota es ruidosa](/blog/markdown-tables-that-survive-conversion) — una fila de barras verticales está obviamente mal. Una nota al pie rota es silenciosa, que es lo que la hace más peligrosa.

## Cómo hacer que una nota al pie sobreviva a un conversor que no las conoce

Algunas veces la cadena está fijada y el parser dentro de ella no hace notas al pie. Hay cuatro salidas, en orden de cuánto cuestan.

**Escribe la aclaración dentro de la propia frase.** La opción honesta, y la que merece probarse primero. La mayoría de las notas al pie de la mayoría de los documentos son un paréntesis que se hizo ambicioso. Si la nota es de una sola frase, ponla en la oración, entre paréntesis, y borra el mecanismo. Se renderiza en cualquier parser jamás escrito, sobrevive a cualquier conversión, y el lector no tiene que salir del párrafo. El coste es una frase algo más larga, que casi nunca es un coste real.

**Construye la referencia y el ancla a mano.** Las notas al pie son dos enlaces y una lista ordenada. Puedes escribirlos, y el resultado funciona en un parser CommonMark puro porque no usa nada más que enlaces y HTML crudo:

```markdown
The estimate assumed a fixed exchange rate.<sup id="ref-1"><a href="#note-1">1</a></sup>

## Notes

1. <a id="note-1"></a>Which it was not, for most of the period in question.
   <a href="#ref-1">Back</a>
```

Eso es una nota al pie de verdad: un número en superíndice, un salto a la nota, un salto de vuelta. Te cuesta numerar a mano, lo que significa renumerar a mano cuando insertas una nota en medio, y depende de que el HTML crudo sobreviva. Dos advertencias antes de comprometerte con esto. Primero, un parser configurado para escapar HTML crudo — el valor por defecto de markdown-it es `html: false` — imprimirá tus etiquetas `<sup>` como texto, que es un fallo distinto en el mismo sitio. Segundo, un saneador tiene que permitir tanto las etiquetas como los atributos `id` y `href`, o los anclas se van y los enlaces quedan sueltos. Pruébalo en la cadena real, con el saneador real, con una sola nota, antes de escribir cuarenta.

**Usa la herramienta que tiene la extensión, una sola vez.** Si la cadena está fijada pero controlas un paso de ella, convierte con un parser que entienda las notas al pie y entrégale al siguiente paso el HTML en vez del Markdown. Pandoc leyendo `markdown` y escribiendo HTML, o un pequeño script de Node con markdown-it y su plugin de notas, es un trabajo de cinco minutos que elimina el problema de forma permanente. El coste es que el HTML se convierte en el artefacto que mantienes, así que esto solo funciona cuando el Markdown es una fuente que conviertes y no un documento que la gente sigue editando.

**Comprueba antes de escribir.** Sea cual sea la vía que elijas, averigua qué hace la cadena antes de tener cien notas en un documento. Pon esto en un archivo y convierte:

```markdown
A reference.[^probe]

An inline note.^[Inline.]

[^probe]: The note, with a second paragraph below.

    Indented four spaces.
```

Cuatro respuestas de un solo pegado. Un número en superíndice significa que la extensión está presente. La nota renderizada al final significa que se recolectó correctamente. Un segundo párrafo dentro de la nota significa que la regla de sangrado coincide con lo que escribes. Y un `^[Inline.]` visible significa que las notas en línea no están disponibles, que es casi siempre el caso. Luego revisa el HTML fuente y comprueba que el `href` de la referencia coincide con el `id` de la nota, porque ese par es lo que se rompe en silencio cuando dos documentos comparten una página.

## Cómo elegir: criterios antes de comprometerte con las notas al pie

1. **Decide si la nota es una nota al pie o un paréntesis.** Si es de una sola frase, ponla en la oración y evita cada problema de este artículo; un mecanismo que no usas no puede romperse en un conversor que no has probado.
2. **Nombra toda la cadena que va a recorrer el archivo, y luego revisa el eslabón más débil.** El editor del autor, el repositorio que lo alberga, el conversor, el saneador, el publicador — las notas al pie necesitan la extensión en cada paso que parsea Markdown, y un solo paso sin ella convierte tus notas en corchetes en la página publicada.
3. **Usa identificadores de palabras, no números.** `[^tipo-de-cambio]` sobrevive inserciones, borrados y reordenamientos, mientras que un documento etiquetado `[^1]` hasta `[^12]` acabará siendo renumerado a mano por alguien que no sabía que el renderizador ya lo hace solo.
4. **Activa la opción de prefijo de id si más de un documento puede compartir una página.** `enableAutoIDPrefix` de Hugo, `UNIQUE_IDS` de Python-Markdown y `--id-prefix` de Pandoc vienen todos apagados de fábrica, así que una página de listado o un fragmento ensamblado tendrá enlaces de nota que resuelven a la nota equivocada y ningún paso de compilación te lo dirá.
5. **Añade el contenedor de notas al pie a la lista blanca de tu saneador al mismo tiempo que la extensión.** Una lista construida para la salida de GFM no tiene ningún `<section>` dentro, y el resultado es una página donde cada referencia sobrevive y cada nota ha desaparecido, que parece terminada y no lo está.
6. **Reserva las notas en línea para cadenas que controlas por completo.** `^[…]` es una comodidad real en Pandoc y markdown-it, y falla en GitHub de una forma que ni siquiera se parece a una nota al pie, así que un archivo que pueda leerse ahí debería usar la forma con corchetes.
7. **Convierte un archivo con notas al pie y lee el final de la salida.** No el principio, y no la vista previa: el HTML renderizado, en un navegador, con un clic en una referencia y un clic en el enlace de vuelta. Diez segundos ahí atrapan los corchetes literales, el bloque que falta y el enlace que apunta al sitio equivocado, que son las únicas tres cosas que pueden salir mal.

## Conclusión

Las notas al pie son una convención ampliamente implementada sin ninguna especificación detrás, y todo lo incómodo de ellas se deriva de ese único hecho. La sintaxis es lo bastante estable para aprenderla una vez — `[^nombre]` en el texto, `[^nombre]:` al final, cuatro espacios para continuar una nota — y la pregunta que decide si funciona nunca es sobre la sintaxis. Es sobre si la herramienta concreta que tiene delante tu archivo tiene la extensión, y si la herramienta siguiente también la tiene. Revisa el eslabón más débil de la cadena, mantén los identificadores como palabras, activa el prefijo de id si dos documentos van a compartir alguna vez una página, y añade el contenedor de notas al saneador al mismo tiempo que el plugin al parser. Si quieres ver en qué se convirtió una construcción concreta en vez de adivinarlo, [convertir el archivo a HTML](/) con el origen visible junto a la vista previa lo responde de inmediato: un `<sup>` con un `id` que coincide significa que la nota es real, y un párrafo que contiene `[^1]` significa que has encontrado el eslabón más débil.

## Preguntas frecuentes

### ¿Las notas al pie forman parte de Markdown?

No. No están ni en la especificación de CommonMark ni en la de GitHub Flavored Markdown, y el Markdown original nunca las tuvo. La sintaxis que todo el mundo usa vino de PHP Markdown Extra y se difundió como una extensión, que es por lo que el soporte varía por herramienta y no por versión.

### ¿Por qué mi nota al pie aparece como `[^1]` en la salida?

Porque el parser que convirtió tu archivo no implementa notas al pie. Renderizó los corchetes con fidelidad, como exige su especificación. O añade la extensión o el plugin de notas a ese parser, o usa otro distinto — y revisa cada paso de la cadena, porque el fallo viene del eslabón más débil, no del primero.

### ¿Funcionan las notas al pie en GitHub?

Sí, en archivos Markdown, issues, pull requests y discusiones. La documentación de GitHub señala una excepción: las notas al pie no están soportadas en wikis. Ten en cuenta que el hecho de que GitHub las renderice no significa que la especificación de GFM las contenga, así que un parser que asegura cumplir GFM e ignora tus notas al pie se está comportando correctamente.

### ¿Puede una nota al pie contener una lista o un bloque de código?

Sí, si la sangras. Cuatro espacios en las líneas de continuación mantienen un párrafo, una lista o un bloque de código con sangría pegados a la nota tanto en Pandoc como en Python-Markdown. Pierde la sangría y el bloque se convierte en texto normal del cuerpo, en el punto del documento donde estaba la definición.

### ¿Cómo convierto un archivo Markdown con notas al pie a HTML?

Usa un parser con la extensión activada: Pandoc, que la trae encendida en su propio dialecto, o markdown-it con `markdown-it-footnote`, o Python-Markdown con `extensions=['footnotes']`, o remark con `remark-gfm`. Luego abre el resultado y haz clic en una referencia y en un enlace de vuelta, porque que la extensión esté presente no garantiza que los ids coincidan en cuanto la página contenga algo más.

### ¿Por qué mis enlaces de nota al pie saltan a la nota equivocada?

Porque los ids colisionan. Los ids de nota al pie se generan por documento y son únicos solo dentro de él, así que dos documentos renderizados en la misma página contienen ambos `fn1`, y el navegador va al primero. Activa la opción de prefijo de id de tu herramienta — `enableAutoIDPrefix` en Hugo, `UNIQUE_IDS` en Python-Markdown, `--id-prefix` en Pandoc — todas apagadas por defecto.

### ¿Cuál es la diferencia entre una nota al pie y una nota final aquí?

En Markdown, ninguna a nivel de sintaxis: escribes el mismo `[^1]` en los dos casos y el renderizador decide dónde caen las notas. Pandoc es la única herramienta que hace explícita la ubicación, con `--reference-location` eligiendo el final del bloque, el final de la sección o el final del documento. El `PLACE_MARKER` de Python-Markdown hace algo parecido dejándote poner el bloque donde quieras.
