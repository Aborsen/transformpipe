---
title: "Alternativas a Dillinger en 2026: agrupadas por qué lo estás dejando"
description: "Alternativas a Dillinger agrupadas por el motivo real de buscarlas: un conversor en vez de un editor, algo sin conexión, algo dentro de tu editor, o un script"
date: 2026-09-08
tag: Workflow
keywords: alternativa a dillinger, alternativas a dillinger, editor markdown online alternativo, editor markdown sin la nube, pasar markdown a html sin editor, editor markdown sin conexión
---

Dillinger es un programa bueno y es gratis, así que nadie sale a buscar una alternativa por hartazgo con la escritura. La gente busca porque algo en el borde de la herramienta no encajaba: un cuadro de diálogo pidiendo conectar un Google Drive, una exportación que no se abrió como se veía en pantalla, o la lenta certeza de que habían abierto un editor cuando lo que necesitaban era un conversor y un archivo.

### Resumen rápido

Si querías una conversión puntual y no una sesión de escritura, la respuesta es un conversor, no otro editor — Markdown Live Preview para echar un vistazo, un conversor de navegador para un archivo HTML completo que puedas enviar. Si la objeción era la conexión a la nube, ten en cuenta primero que Dillinger dice que los documentos se quedan en tu navegador y que no hay datos en sus servidores (comprobado en dillinger.io, el 9 de septiembre de 2026); la petición de acceso solo aparece cuando enlazas Dropbox, Drive, OneDrive, GitHub o Bitbucket, y sencillamente puedes no hacerlo. Si quieres la herramienta en tu propia máquina, StackEdit se queda en una pestaña y funciona sin conexión, y Typora, Obsidian y Zettlr son aplicaciones. Si el trabajo pertenece a una compilación, nada de lo anterior aplica y ahí está Pandoc.

«Alternativa a Dillinger» son cuatro búsquedas metidas en una sola frase. La primera es alguien que llegó con un archivo `.md`, quería sacar HTML de él, y encontró un editor de dos paneles con un menú de nube — más herramienta de la que pedía el trabajo. La segunda es alguien que se topó con el aviso de integración y se detuvo ahí, porque enlazar un Drive entero a un sitio web para mover un archivo es un mal trato. La tercera quiere el programa instalado, en un portátil, funcionando en un tren, con los archivos en un disco que pueda respaldar. La cuarta está escribiendo un paso de compilación y necesita un comando, no una pestaña.

Esas cuatro personas quieren cosas distintas y solo una de ellas quiere un editor. Eso conviene saberlo antes de leer cualquier lista, incluida esta, porque la mayoría de las páginas de «alternativas a Dillinger» responden a las cuatro preguntas con una pila de editores de Markdown ordenados por ranking, y tres de cada cuatro lectores se van con la herramienta equivocada.

Hay también un quinto caso que merece nombrarse, porque aparece en los hilos de soporte: la exportación salió y no se parecía a la vista previa. Eso no es una razón para cambiar de editor. Es una propiedad de cómo se escribió el HTML, y se arregla sin migrar nada.

## Dillinger en sus propios términos

Dillinger es un editor de Markdown en el navegador con vista previa en vivo, construido sobre el editor Monaco — el mismo componente de edición que usa VS Code. Ofrece vista previa sincronizada al hacer scroll, atajos de Vim y Emacs detrás de un ajuste, arrastrar y soltar archivos de Markdown, HTML e imagen, un modo oscuro y un modo Zen a pantalla completa. La exportación se describe como «Markdown, HTML con estilo, o PDF», con una descarga de un solo clic. Los documentos se guardan automáticamente en el almacenamiento del navegador, y el propio sitio lo dice sin rodeos: «No account required, no data on our servers» (comprobado en dillinger.io, el 9 de septiembre de 2026).

Es de código abierto. El repositorio declara la licencia MIT, y enumera como pila Next.js, Monaco, Tailwind CSS y Zustand, con un simple `npm run build` y `npm start` para ejecutarlo tú mismo (comprobado en github.com/joemccann/dillinger, el 9 de septiembre de 2026). MIT significa que puedes alojarlo, bifurcarlo y cambiarlo, que es más de lo que ofrecen la mayoría de las herramientas web gratuitas y es el contrapeso honesto a todo lo de abajo.

Las integraciones son la parte que provoca reacciones. Se listan cinco —GitHub, Dropbox, Google Drive, OneDrive y Bitbucket— para importar archivos y guardar de vuelta en ellos, y el sitio señala que la conexión con Dropbox se hace por OAuth (comprobado en dillinger.io, el 9 de septiembre de 2026). No hay nada inusual ni indebido en eso. Es sencillamente el punto en el que un editor gratuito pide algo que un conversor nunca tiene que pedir, y el punto donde mucha gente cierra la pestaña.

| A favor | En contra |
| --- | --- |
| Nada que instalar, y ninguna cuenta que crear | Es un editor: el camino más corto sigue siendo escribir y luego exportar |
| Monaco da edición de verdad — varios cursores, buscar y reemplazar | La página viene de un dominio alojado, así que la primera carga necesita red |
| Los documentos persisten en el almacenamiento del navegador, sin nada en sus servidores | El almacenamiento del navegador es por navegador y por perfil, y borrar datos del sitio lo borra |
| Exporta Markdown, HTML con estilo y PDF en un clic | La sincronización con la nube significa conceder a un sitio acceso a un disco o un repositorio |
| Con licencia MIT, así que puedes alojarlo tú mismo | El estilo de la exportación es propio de la herramienta, y «con estilo» no es lo mismo que autónomo |

**Licencia:** gratis, MIT (comprobado en github.com/joemccann/dillinger, el 9 de septiembre de 2026).

**¿Para quién es?** Para alguien escribiendo un documento ahora mismo, en un navegador, que quiere una vista previa en vivo y un archivo al final. En ese trabajo es difícil superarlo y no hay motivo para dejarlo. Cada razón de abajo trata sobre un trabajo distinto.

Hay dos cosas que merece la pena comprobar antes de concluir que la herramienta te falló. Primero, el almacenamiento del navegador no es una copia de seguridad: vive en un navegador en una máquina, y una caché borrada o una ventana privada se llevan el documento con ella. Segundo, una exportación «con estilo» y un documento HTML autónomo son propiedades distintas. Abre el archivo exportado con la red desconectada, en otro navegador. Si sigue viéndose bien, los estilos venían con él. Si se convierte en texto negro sobre blanco a todo el ancho de la ventana, el estilo apuntaba a algo que el archivo no puede alcanzar — un problema [que merece entenderse bien](/blog/self-contained-html-explained), porque te va a seguir a cualquier herramienta a la que cambies.

## Comparativa rápida: la chuleta

| Herramienta | Recurre a ella cuando | Dónde vive el texto | Funciona en | Licencia |
| --- | --- | --- | --- | --- |
| Dillinger | Estás escribiendo ahora y quieres vista previa | Almacenamiento del navegador, más una nube si enlazas una | Cualquier navegador | Gratis, MIT |
| Un conversor de navegador | Tienes un archivo y necesitas un HTML terminado | Nada sale de la máquina si no has iniciado sesión | Cualquier navegador | Gratis |
| Markdown Live Preview | Solo quieres ver cómo se renderiza | La página en la que estás | Cualquier navegador | Gratis, MIT |
| StackEdit | Quieres un editor de navegador que siga funcionando sin conexión | Almacenamiento del navegador hasta que conectas sincronización | Cualquier navegador | Gratis, Apache License 2.0 |
| Typora | Escribes casi todos los días y quieres una aplicación | Archivos `.md` locales | macOS, Windows, Linux | De pago, pago único |
| Obsidian | Muchas notas que se refieren entre sí | Una carpeta local que tú eliges | Escritorio, móviles, tablets | Gratis para cualquier uso |
| Zettlr | El documento tiene citas y una plantilla de destino | Archivos `.md` locales | macOS, Windows, Linux | Gratis, GNU GPL v3 |
| VS Code | El Markdown ya vive junto al código | Archivos en la carpeta que abriste | macOS, Windows, Linux | Licencia de producto; Code-OSS es MIT |
| Pandoc | La conversión tiene que correr sin nadie mirando | Donde ya estén tus archivos | Línea de comandos | Gratis, GPL |
| Una API REST o CLI | La conversión pertenece a un pipeline | Tu repositorio o tu runner | Servidor, CI, terminal | Varía |

## Razón uno: quiero un conversor, no un editor

Este es el grupo más grande y el que peor sirven las listas. Ya tienes un archivo `.md` —un README, una exportación de una app de notas, algo que escribió un modelo por ti— y el trabajo es convertirlo en una página que una persona pueda abrir. Dillinger puede hacerlo: pega el texto, usa el menú de exportar. Pero la forma de la herramienta no encaja con el trabajo. Pone un cursor delante de ti y te pide que escribas, cuando ya no queda nada que escribir.

Un conversor tiene una forma distinta. Le das un archivo, te devuelve un archivo, y no hay ningún documento que gestionar en medio. No se guarda nada, no se sincroniza nada, y no hay ningún estado que se pueda perder.

### TransformPipe — para un documento HTML terminado que puedas enviar

Un conversor de navegador toma el archivo Markdown y devuelve un documento HTML completo, con los estilos en línea, en un solo archivo. No hay instalación ni cuenta, y sin sesión iniciada no se sube nada — el archivo se lee, convierte y renderiza en la máquina que tienes delante, algo que puedes confirmar viendo la pestaña de red mientras trabaja.

| A favor | En contra |
| --- | --- |
| La salida es un solo archivo que no le pide nada a la red | No es un entorno de escritura: sin vista previa en vivo para teclear en ella |
| Nada se sube si no has iniciado sesión, y no se necesita cuenta | El trabajo lo hace el navegador, así que un archivo muy grande depende de la máquina |
| El HTML sin procesar en el origen pasa por una lista fija de permitidos antes de renderizarse | Sin lenguaje de plantillas para un diseño a medida |
| También convierte HTML, Word, CSV y JSON en el otro sentido | Un documento a la vez, o varios fusionados en uno |

**Licencia:** gratis para usar. La conversión tiene un tope de 10 MB, y un documento guardado en una cuenta uno de 4 MB, porque la función que hay detrás rechaza una petición o una respuesta de más de 4,5 MB.

**Detalles técnicos y funciones**

- GitHub Flavored Markdown: tablas, listas de tareas, texto tachado, autoenlaces, bloques de código con valla
- La salida es un documento completo — doctype, cabecera, un bloque `<style>` en línea, sin peticiones externas
- Se descarga como `.html`, `.md` o texto plano, o se imprime a PDF a través del propio diálogo del navegador
- La misma conversión está disponible desde una API REST, una CLI sin dependencias, una GitHub Action y un servidor MCP

**¿Para quién es?** Para cualquiera cuyo siguiente paso sea «enviarle esto a alguien». Si llegaste a Dillinger con un archivo y saliste con un documento que no estabas seguro de que se abriera en otra máquina, este es el cambio que lo arregla, y tarda tanto como tardaba la exportación.

### Markdown Live Preview — para mirar, no para entregar

Markdown Live Preview es exactamente lo que dice su repositorio que es: «a tiny web tool to preview Markdown formatted text», descrito ahí como un «markdown editor with live preview» y publicado bajo licencia MIT (comprobado en github.com/tanabe/markdown-live-preview, el 9 de septiembre de 2026). Su propio sitio rechazó una petición automatizada el día en que se escribió esto, así que todo lo anterior viene del repositorio y no de la página.

| A favor | En contra |
| --- | --- |
| El repositorio es lo bastante pequeño para leerlo, y tiene licencia MIT | Una vista previa, no un pipeline de exportación |
| Nada documentado en lo que iniciar sesión ni sincronizar | Su renderizado no tiene por qué ser el de tu renderizador de destino |
| Un solo trabajo, hecho en la página | Nada que conservar: es una superficie de borrador |

**Licencia:** gratis, MIT (comprobado en github.com/tanabe/markdown-live-preview, el 9 de septiembre de 2026).

**¿Para quién es?** Para alguien comprobando si una tabla está bien formada, o si una lista anidada anida correctamente. Es el tamaño justo para una pregunta de cinco segundos y el tamaño equivocado para producir un documento. Si tu único uso de Dillinger era pegar texto para ver si se veía bien, esto lo sustituye con mucho menos alrededor.

### Lo que aporta el grupo de los conversores

El hilo común es que no hay ningún documento que perder. Sin almacenamiento del navegador que limpiar, sin sincronización que configurar, sin aviso de OAuth, y sin ningún borrador a medias sentado en una pestaña que cerraste la semana pasada. El intercambio es un archivo por otro y luego se acaba. Para una parte sorprendente del tráfico detrás de esta búsqueda, eso es todo el requisito, y todo lo demás en la página es la respuesta a una pregunta que el lector no hizo.

También cambia lo que significa «seguro». Un conversor online que sube tu archivo tiene tu documento; uno que convierte en el navegador no. Esa distinción [merece comprobarse en lugar de darse por hecha](/blog/is-an-online-converter-safe) para cualquier herramienta de esta categoría, incluidas las de aquí, porque los dos diseños existen y la página rara vez dice de entrada cuál es el suyo.

## Razón dos: lo quiero sin conexión, o en algún sitio que controle

El segundo grupo quiere la herramienta en su lado de la red. A veces es política — una máquina de trabajo, el documento de un cliente, un sector donde «lo pegamos en un sitio web» no es una frase aceptable. A veces es práctico: un tren, un avión, un edificio con mal wifi. Y a veces es simplemente preferir software que sigue funcionando cuando una empresa pierde el interés.

Conviene ser precisos sobre lo que Dillinger hace y no hace aquí, porque la suposición automática suele estar equivocada. Su propia página dice que el editor sigue funcionando sin conexión una vez cargado, y que los documentos se guardan automáticamente en el almacenamiento local del navegador sin ningún dato en sus servidores (comprobado en dillinger.io, el 9 de septiembre de 2026). Lo que no puede hacer es existir sin la primera carga: la aplicación se sirve desde un dominio, así que el código llega por red cada vez que no está en caché, y la versión que obtienes es la que esté desplegada en ese momento. Eso es una propiedad distinta de una aplicación firmada sentada en tu disco, y para algunos lectores es toda la diferencia.

### StackEdit — el editor de navegador construido para funcionar sin conexión

StackEdit es un editor de Markdown en el navegador con vista previa en vivo y scroll sincronizado, y anuncia directamente el uso sin conexión: «Even when you travel, StackEdit is still accessible and lets you write offline just like any desktop application». Sincroniza archivos con Google Drive, Dropbox y GitHub, publica en Blogger, WordPress y Zendesk, y está bajo la Apache License 2.0 (todo comprobado en stackedit.io, el 9 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| El uso sin conexión es un objetivo de diseño declarado, no un efecto secundario | Sigue siendo una pestaña del navegador, con la misma dependencia de la primera carga |
| Más herramientas de escritura que Dillinger: controles WYSIWYG, comentarios | Los destinos de sincronización son las mismas nubes que quizá estabas evitando |
| Aguanta documentos largos sin quejarse | Su sintaxis extendida — diagramas, partituras — viaja mal a otros sitios |
| Apache License 2.0, así que se puede autoalojar | El estilo de exportación es propio |

**Licencia:** gratis, Apache License 2.0 (comprobado en stackedit.io, el 9 de septiembre de 2026).

**Detalles técnicos y funciones**

- GitHub Flavored Markdown, más matemáticas LaTeX, diagramas UML y extensiones de partitura musical
- Sincronización con Google Drive, Dropbox y GitHub; publicación en Blogger, WordPress y Zendesk
- Un componente incrustable, `stackedit.js`, para meter el editor dentro de otra aplicación
- Comentarios y funciones de colaboración pensadas para revisión más que para escritura en solitario

**¿Para quién es?** Para quien le gustaba la pestaña del navegador y quiere un editor más serio dentro de ella, sobre todo donde instalar software no es una opción. Es el cambio más parecido en esta página, y aplica la misma reserva: si te objetaba conectar un drive, StackEdit te va a ofrecer los mismos tres.

### Typora — la aplicación, si escribes casi todos los días

Typora es un editor de escritorio para macOS, Windows y Linux que elimina la ventana de vista previa, el interruptor de modo y las marcas de sintaxis, y renderiza el documento mientras escribes; sus temas se describen como «fully configurable by CSS» (ambos comprobados en typora.io, el 9 de septiembre de 2026). Su documentación dice que Typora «supports exporting the current document into PDF, HTML, HTML (without styles) and the Image format», y enumera Word, OpenOffice, LaTeX, EPUB y el resto como exportaciones que pasan por un Pandoc instalado (comprobado en support.typora.io, el 9 de septiembre de 2026). Como el tema es CSS, la exportación a HTML hereda la hoja de estilos activa en cada momento en lugar de un aspecto fijo de la casa.

| A favor | En contra |
| --- | --- |
| Un solo panel, sin vista dividida, sin ruido de sintaxis | De pago, y solo de escritorio |
| Los temas son CSS, así que las exportaciones pueden llevar tu propio estilo | Tres dispositivos por licencia |
| Archivos `.md` normales en un disco que controlas | Un documento a la vez; no es una herramienta por lotes |
| Sin integraciones que conceder, porque no hay ninguna | Sustituir la sintaxis mientras escribes le sienta bien a algunos y mal a otros |

**Precio:** 14,99 $ sin impuestos, una compra única que cubre hasta tres dispositivos, con quince días de prueba gratuita (comprobado en typora.io, el 9 de septiembre de 2026).

**¿Para quién es?** Para gente cuyo hábito de Markdown se le ha quedado pequeño a una pestaña. Es la única entrada de pago aquí y la única donde el motivo para pagar es la escritura y no la salida. Si ya estás comparando editores de escritorio, [las razones por las que la gente deja Typora a su vez](/blog/typora-alternatives) merecen leerse antes de comprar, ya que el tope de dispositivos pilla a la gente más tarde que pronto.

### Obsidian — cuando los documentos se refieren entre sí

Obsidian trabaja sobre una carpeta de archivos Markdown en tu propio disco, con enlaces entre notas como idea organizadora. No es un conversor y no es principalmente un editor para un documento; es una aplicación para una colección de ellos. Su propio sitio dice que «stores your notes locally as plain text Markdown files», ofrece compilaciones para Windows, macOS, Linux, iOS y Android, y describe «thousands of plugins» junto a una API abierta. Su página de licencia declara que se puede usar gratis para cualquier propósito, incluido uso personal, comercial y sin fines de lucro, con licencias de pago opcionales que no son obligatorias, y no describe la aplicación como de código abierto (todo comprobado en obsidian.md, el 9 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| Los archivos se quedan en una carpeta que elegiste tú, en Markdown plano | Sobrecarga enorme si tienes un solo documento |
| Gratis para cualquier uso, incluido comercial | La página de licencia no reclama código abierto, así que no hay fuente que alojar tú mismo |
| Funciona en escritorio, móviles y tablets | Sus enlaces y embebidos al estilo wiki no son Markdown estándar |
| Un ecosistema de plugins enorme, incluidos plugins de exportación | La calidad de la exportación depende de qué plugin instales |

**Licencia:** gratis para cualquier uso; las licencias de pago Catalyst y Commercial son opcionales (comprobado en obsidian.md, el 9 de septiembre de 2026).

**¿Para quién es?** Para alguien cuyo uso de Dillinger se había convertido, sin darse cuenta, en un sistema de archivo — varios documentos, cada uno en una pestaña, ninguno localizable después. Ese es un trabajo para una carpeta y una aplicación encima. Es un movimiento grande para una molestia pequeña, y la [comparativa de editores en esa categoría](/blog/best-markdown-editors) es mejor punto de partida que esta página.

### Zettlr — cuando el documento tiene bibliografía y un formato de destino

Zettlr es una aplicación de escritura para Windows, macOS y Linux que trata la exportación como un paso de primera clase, impulsado por Pandoc a través de un sistema de perfiles: «you can export any paper with a template in just one click». Se integra con gestores de referencias incluidos Zotero y JabRef, y trabaja con plantillas de LaTeX y Word (todo comprobado en zettlr.com, el 9 de septiembre de 2026). Está bajo la GNU GPL v3 (comprobado en github.com/Zettlr/Zettlr, el 9 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| Perfiles de exportación impulsados por Pandoc, con plantillas de verdad | La capacidad de Pandoc viene con la curva de aprendizaje de Pandoc |
| Citas desde Zotero o JabRef, dentro del documento | Más pesado que cualquier otra cosa de este grupo |
| GPL v3, y tus archivos se quedan donde los pusiste | Orientado a escritura académica, lo cual da forma a cada valor por defecto |
| Búsqueda en todo el texto de un proyecto | No es una herramienta de conversión rápida de un archivo |

**Licencia:** gratis, GNU GPL v3 (comprobado en github.com/Zettlr/Zettlr, el 9 de septiembre de 2026).

**¿Para quién es?** Para gente que escribe algo con referencias y un formato de salida obligatorio — un artículo, una tesis, un manuscrito. Si exportabas desde Dillinger y luego arreglabas el resultado a mano cada vez, una herramienta con plantillas es el arreglo estructural.

## Razón tres: lo quiero en el editor que ya tengo

El tercer grupo son desarrolladores, y la respuesta es corta: si el archivo ya está abierto en tu editor, ahí es donde debería pasar la conversión. Cambiar a una pestaña del navegador para renderizar un archivo que está en el disco a dos pasos es el tipo de costumbre que sobrevive mucho después de que desapareciera la razón que la provocó.

### VS Code — la vista previa ya está instalada

VS Code trae de serie una vista previa de Markdown construida sobre markdown-it, que es la misma familia de renderizador en la que vive el problema de vista previa de Dillinger, y se abre junto al archivo con una pulsación de tecla. Exportar no viene incluido; lo dan extensiones, y su calidad varía. El repositorio de origen, Code - OSS, tiene licencia MIT, mientras que el producto de marca que distribuye Microsoft lleva una licencia de producto de Microsoft (comprobado en github.com/microsoft/vscode, el 9 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| Ya instalado, para la mayoría de desarrolladores | Exportar necesita una extensión, y las extensiones varían |
| La vista previa refleja el comportamiento CommonMark de markdown-it | El estilo de la vista previa no es el estilo de la exportación |
| El archivo nunca sale de la carpeta en la que vive | No es un pipeline: convierte lo que está abierto |
| Atajos de Vim, varios cursores, todo lo que ya daba Monaco | Sin sincronización con la nube en vivo, que para este grupo es justo el punto |

**Licencia:** el producto está bajo una licencia de producto de Microsoft; el código fuente de Code - OSS es MIT (comprobado en github.com/microsoft/vscode, el 9 de septiembre de 2026).

**Detalles técnicos y funciones**

- Vista previa en paralelo con scroll sincronizado, desde un atajo de teclado
- markdown-it debajo de la vista previa, así que el comportamiento CommonMark es la base y las funciones GFM vienen de los presets
- Extensiones para exportar a HTML, PDF y diapositivas, cada una envolviendo el fragmento de forma distinta
- Un espacio de trabajo basado en carpetas, así que el Markdown vive junto al código que documenta

**¿Para quién es?** Para cualquiera que convierta un README o una nota de paso mientras ya está en el editor. Hay una simetría divertida aquí: el componente de edición de Dillinger es Monaco, que es el editor de VS Code extraído para el navegador, así que un desarrollador que deja Dillinger por VS Code no está aprendiendo ningún editor nuevo. Está quitando un navegador de entre él y sus archivos.

Si el Markdown vive en un repositorio, ahí es también donde está el resto de la cadena de herramientas — linting, ortografía, diffs, revisión. Un documento que se edita a través de una herramienta web y se pega de vuelta es un documento sin historial, y el historial era la principal razón de tener un repositorio.

## Razón cuatro: lo quiero dentro de un script

El cuarto grupo dejó de querer una herramienta con un cursor dentro. La conversión pasa cincuenta veces, o en cada commit, o a las tres de la madrugada, y cualquier respuesta que involucre una pestaña del navegador no es una respuesta. Nada de la categoría de los editores sirve para esto, que es por lo que es el grupo al que más probablemente se le da la recomendación equivocada.

### Pandoc — la respuesta general

Pandoc es un conversor de documentos de línea de comandos que lee y escribe una gran cantidad de formatos de marcado. Su propio sitio afirma: «Pandoc is free software, released under the GPL.» (comprobado en pandoc.org, el 9 de septiembre de 2026). Para este trabajo, las opciones relevantes están documentadas en su manual: `--standalone` (`-s`) produce «output with an appropriate header and footer (e.g. a standalone HTML, LaTeX, TEI, or RTF file, not a fragment)», y `--embed-resources` produce «a standalone HTML file with no external dependencies, using `data:` URIs to incorporate the contents of linked scripts, stylesheets, images, and videos» (comprobado en pandoc.org, el 9 de septiembre de 2026).

```sh
pandoc notes.md -s --embed-resources -o notes.html
```

| A favor | En contra |
| --- | --- |
| Un comando, repetible, programable, sin ninguna pestaña | Exige una instalación y una terminal |
| `--standalone` y `--embed-resources` producen un archivo único de verdad | Las plantillas y los filtros son un tema aparte |
| `--template` da control exacto sobre el envoltorio | Sin saneado: el HTML sin procesar pasa directo |
| Lee y escribe mucho más que Markdown y HTML | Sus dialectos de Markdown difieren de GFM en algunos puntos |

**Licencia:** gratis, GPL (comprobado en pandoc.org, el 9 de septiembre de 2026).

**Detalles técnicos y funciones**

- `--standalone` envuelve la salida en un documento completo en vez de emitir un fragmento
- `--embed-resources` incrusta hojas de estilo, scripts e imágenes como URIs `data:`
- `--template` elige un archivo o una URL de plantilla, e implica `--standalone`
- `--sandbox` restringe el acceso a archivos del lector y del escritor a los archivos nombrados en la línea de comandos, lo cual importa cuando la entrada no es tuya

**¿Para quién es?** Para cualquiera con una conversión que se repite, un directorio de archivos, o un formato de salida distinto de HTML. El trato es una instalación y algo de lectura a cambio de una conversión que ya nunca necesita a una persona. Si el terminal es donde pertenece esto, la [pregunta más concreta de pasar Markdown a HTML ahí](/blog/markdown-to-html-from-the-command-line) cubre también las alternativas a Pandoc.

### Una API, una CLI o una acción de CI — cuando la instalación es el problema

La otra forma de esta respuesta es una conversión alojada sin ningún runtime que instalar: un endpoint REST que llama tu script, una CLI sin dependencias que ejecutas sin un gestor de paquetes, o una acción que corre en un pull request. Es la misma conversión que la del navegador, movida a donde vive la automatización.

| A favor | En contra |
| --- | --- |
| Nada que instalar en el runner | Una llamada de red, con todo lo que eso implica |
| La misma salida que la conversión interactiva | Los límites de tamaño se aplican a lo que puedas enviar |
| Encaja en un pull request o una tarea nocturna | Menos flexible que un Pandoc local con plantillas |

**¿Para quién es?** Para equipos cuyos runners de CI están cerrados a instalaciones, o para cualquiera que no quiera meter un Haskell en un contenedor para convertir un archivo en una página. Merece decirse con claridad que Pandoc es la herramienta más capaz y una llamada alojada es la más cómoda, y que la comodidad es una razón legítima para elegir la opción más pequeña.

## Dónde falla la respuesta obvia, y qué cuesta cambiar

Aquí está la parte que las listas de alternativas —y esta, hasta ahora— han estado evitando. **Un editor y un conversor son herramientas distintas, y la mayoría de la gente que busca «alternativa a Dillinger» quiere la segunda.** Recomendar otro editor a alguien que sostiene un archivo es la respuesta equivocada dicha con seguridad, y es la respuesta más común en internet.

La pista es qué estabas haciendo cuando te molestaste. Si estabas escribiendo, querías un editor y Dillinger estaba cerca: el arreglo es StackEdit, o una aplicación, o nada en absoluto. Si estabas pegando, querías un conversor, y cada editor de cada lista es un desvío con un cursor dentro. Pegar un documento terminado en un editor solo para llegar a su menú de exportar es una manera de compensar no tener la herramienta correcta, y es invisible como tal porque solo tarda un minuto.

Los costes de cambiar merecen decirse también, porque «cambiar» no es gratis.

**Cambiar de editor es una migración, no un clic.** Los documentos en el almacenamiento del navegador de Dillinger están en el almacenamiento del navegador de Dillinger. No están en una carpeta, no están en un repositorio, y ninguna otra herramienta los va a encontrar. Antes de moverte, abre cada uno y descarga el Markdown, porque en el momento en que inicias sesión en otra cosa, los borradores antiguos están a una caché borrada de desaparecer. Esto no es una crítica a Dillinger — toda herramienta con almacenamiento de navegador tiene la misma propiedad—, pero es el paso que la gente se salta.

**Un editor de escritorio traslada el problema a tus copias de seguridad.** Los archivos locales son tuyos, lo cual significa que el archivo que ya no existe también es tuyo. La sincronización en la nube de Dillinger existía por una razón, y rechazarla es una decisión de ser responsable de las copias.

**La sintaxis a medida no viaja.** Los diagramas y partituras de StackEdit, los enlaces y embebidos de wiki de Obsidian, las claves de citas de Zettlr: cada una es útil dentro de su propia herramienta y ninguna es Markdown estándar. Un documento escrito con ellas es portátil de la misma manera en que lo es un documento escrito en un dialecto — casi siempre, hasta las partes interesantes.

**Una exportación no es un documento hasta que se abre en otro sitio.** Este es el fallo que la gente le echa en cara al editor. Una exportación con estilo todavía puede hacer referencia a un estilo que no lleva consigo, y la única prueba que lo detecta es abrir el archivo en otro navegador, en otra máquina, con la red desconectada. Haz eso una vez con tu exportación actual antes de concluir que la herramienta era el problema, porque si la herramienta nueva tiene el mismo comportamiento habrás migrado para nada. La propiedad que estás probando tiene [un nombre y una definición](/blog/best-markdown-to-html-converters) que merece conocerse, y decide si un archivo enviado por correo funciona.

**Rechazar la integración suele ser gratis.** La razón más común de esta búsqueda es el aviso de acceso a la nube, y el arreglo más pequeño posible es no conectar nada: escribe en la pestaña, exporta, descarga, listo. Dillinger funciona así por defecto y lo dice. Dejarlo por un cuadro de diálogo que puedes cerrar es la única migración de esta página que nadie necesita hacer.

## Cómo elegir

1. **Decide si estás escribiendo o convirtiendo, y sé honesto al respecto.** Si no queda nada que teclear, un editor es la forma equivocada y vas a seguir pagando por ello en pasos extra cada vez.
2. **Comprueba adónde va el archivo antes de pegarlo.** Una herramienta de navegador convierte en tu máquina y una alojada recibe tu documento; los dos diseños son legítimos, y solo uno de ellos es aceptable para algo confidencial.
3. **Prueba la exportación en otro sitio, con la red desconectada.** Un archivo que se ve bien en la herramienta y mal en un correo es el defecto que cuesta más reputación por el menor esfuerzo de detectar.
4. **Cuenta las instalaciones frente al número de ejecuciones.** Una conversión no debería exigir un gestor de paquetes; cincuenta conversiones no deberían exigir a una persona pulsando un botón, y el punto de cruce llega antes de lo que nadie espera.
5. **Prefiere la herramienta que deja tus archivos en una carpeta.** El almacenamiento del navegador es cómodo hasta que se borra una caché, y un documento que no puedes encontrar con un gestor de archivos es un documento que ya has perdido en parte.
6. **Concede acceso a la nube solo cuando la sincronización sea la función que querías.** Enlazar un Drive o un repositorio entero para mover un archivo es un permiso permanente cambiado por una comodidad de una sola vez, y ese archivo se podría haber descargado sin más.

## Conclusión

Dillinger es un editor de Markdown gratuito, con licencia MIT, basado en el navegador, que mantiene tu documento en tu propio navegador y no pide nada hasta que tú le pides sincronizar — y si el trabajo era escribir, sigue siendo un sitio razonable para hacerlo. La razón por la que existe la búsqueda es que la mayoría de la gente llega hasta él sosteniendo un archivo terminado, y un editor es la herramienta equivocada para un archivo terminado. Para ese caso, [la conversión de Markdown a HTML de TransformPipe](/) devuelve un documento completo y autónomo en el navegador, sin nada subido y sin cuenta, que es el trabajo en sí y no un hogar nuevo para tu escritura. Si quieres el software en tu propio disco, StackEdit, Typora, Obsidian y Zettlr son las alternativas reales, con sus licencias arriba. Y si la conversión va a pasar más de un puñado de veces, deja de evaluar editores por completo e instala Pandoc.

## Preguntas frecuentes

### ¿Sigue manteniéndose Dillinger y es seguro usarlo?

El repositorio es público bajo licencia MIT y el sitio actual describe una pila de Next.js y Monaco, así que está en desarrollo y no abandonado (comprobado en github.com/joemccann/dillinger y dillinger.io, el 9 de septiembre de 2026). Sobre seguridad, sus propias páginas afirman que los documentos persisten en el almacenamiento de tu navegador y que no hay datos en sus servidores, una postura más firme que la de la mayoría de editores web gratuitos.

### ¿Cuál es la mejor alternativa gratuita a Dillinger?

Depende de qué mitad de Dillinger estabas usando. Para el editor, StackEdit es gratis bajo la Apache License 2.0 y está construido para funcionar sin conexión en una pestaña del navegador. Para la conversión, un conversor de navegador que devuelve un solo archivo HTML autónomo es gratis y se salta el editor por completo.

### ¿Hay una alternativa a Dillinger que no se conecte a Dropbox ni a Google Drive?

Varias, y el propio Dillinger es una de ellas si rechazas la integración — nada en el editor exige un drive enlazado. Si prefieres que la opción ni exista, el repositorio de Markdown Live Preview no describe más que una herramienta de vista previa, así que no hay ningún drive que enlazar, y un conversor no tiene nada que conectar porque no hay ningún documento que conservar.

### ¿Puedo autoalojar Dillinger?

Sí. El repositorio tiene licencia MIT y documenta una compilación e inicio sencillos (comprobado en github.com/joemccann/dillinger, el 9 de septiembre de 2026), así que ejecutar tu propia copia es un camino compatible y la licencia permite cambiarla. Eso resuelve la objeción del dominio alojado sin renunciar al editor, al precio de mantener un despliegue.

### ¿Por qué mi HTML exportado se ve distinto de la vista previa?

Porque una vista previa la da estilo la aplicación y una exportación la da estilo lo que el archivo exportado lleva o referencia. Si el archivo apunta a un estilo que no incluye, se renderiza sin estilo en cualquier sitio donde falle la referencia. Abre tu exportación en otro navegador con la red desconectada, y en un segundo vas a saber qué tipo de archivo tienes.

### ¿Necesito un editor para convertir Markdown a HTML?

No, y esta es la frase más útil de la página. Un conversor toma el archivo y devuelve un documento, sin ningún borrador que guardar, ninguna sincronización que configurar y ningún permiso que conceder. Si nunca pensabas escribir nada, el editor siempre fue un paso de más.

### ¿Qué alternativa sirve para un script o una tarea de CI?

Pandoc, que es gratis bajo la GPL y cuyas opciones `--standalone` y `--embed-resources` producen un solo archivo HTML sin dependencias externas (comprobado en pandoc.org, el 9 de septiembre de 2026). Donde instalar Pandoc en un runner es el obstáculo, una API de conversión, una CLI sin dependencias o una GitHub Action hacen el mismo trabajo por red.
