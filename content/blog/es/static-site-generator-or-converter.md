---
title: "¿Necesito un generador de sitios estático? Guía para decidir"
description: Un generador de sitios estático da navegación, plantillas, búsqueda y taxonomías, y cobra una cadena de herramientas. Tres preguntas deciden si te hace falta.
date: 2026-09-04
tag: Publicación
keywords: necesito un generador de sitios estático, generador de sitios estático o conversor, alternativa a un generador de sitios estático, mkdocs vs conversor, cuándo usar un generador de sitios estático, markdown a html sin build, forma más simple de publicar markdown
---

Tienes una carpeta de archivos Markdown y en algún sitio tienen que terminar. El consejo que encuentras dice que instales un generador de sitios estático, y hay seis serios, y cada uno tiene una página de inicio que acaba con un sitio funcionando en cuatro comandos. Ninguna de esas páginas pregunta si de verdad necesitabas un sitio.

Esa es la decisión, y casi siempre se toma al revés: primero se elige la herramienta, y luego se estira el requisito hasta que encaje con ella. Un generador es un sistema de compilación. Espera una carpeta organizada a su manera, un archivo de configuración, un lenguaje de plantillas, un theme, un lockfile y algún sitio donde desplegar la salida. A cambio te da capacidades reales que un conversor de un archivo cada vez no puede ofrecer: un árbol de navegación calculado a partir de los archivos, enlaces entre páginas que rompen la compilación cuando se pudren, un índice de búsqueda, un listado de etiquetas. Si necesitas eso, nada más sirve. Si no, te has cargado con una cadena de herramientas para producir páginas que un conversor habría producido sin ella.

Lo incómodo es que el coste no llega el día que lo instalas. Llega once meses después, el día en que un aviso de seguridad obliga a subir una dependencia, el theme no se ha publicado contra la nueva versión mayor, y la persona que eligió el generador ha cambiado de trabajo.

### Resumen rápido

Necesitas un generador de sitios estático cuando las páginas tienen que saber unas de otras —navegación compartida, enlaces entre páginas que se comprueban, un índice de búsqueda, listados por etiqueta o versión— o cuando la salida tiene que reconstruirse sola cada vez que cambia el origen. No necesitas uno para un documento con un destinatario, ni para un puñado de páginas entre las que nadie navega; de eso se encargan un conversor y un enlace, y no hay nada que mantener. El número de archivos es la prueba equivocada: cincuenta notas sin relación no necesitan generador, y tres páginas interdependientes que deben republicarse en cada fusión sí. Si no estás seguro, publica primero con un conversor: la migración posterior a un generador es molesta pero acotada, y la cadena de herramientas que nunca instalaste no ha costado nada mantener con vida.

## Lo que te da un generador, y lo que cobra por ello

### Las capacidades, dichas como capacidades

Las páginas de marketing describen los generadores con adjetivos. La descripción útil es una lista de cosas que hacen y un conversor no, porque eso es justo lo que estás comprando.

**Un árbol de navegación derivado de los archivos.** El generador recorre tu carpeta de origen, lee el frontmatter y construye con lo que encuentra una barra lateral y una ruta de migas de pan. Añade un archivo y aparece en el menú. Un conversor no tiene carpeta; tiene el único archivo que le diste, y no puede saber qué más existe.

**Plantillas, aplicadas a cada página.** Un archivo de layout, y todas las páginas reciben el mismo encabezado, pie, enlace canónico y etiqueta de analítica. Cambia el layout y cambian 200 páginas. Un conversor aplica una hoja de estilos a un documento; no aplica una carcasa compartida sobre un conjunto.

**Enlaces entre páginas que se validan.** Los generadores resuelven los enlaces internos contra el árbol de archivos, y la mayoría hace fallar la compilación cuando un enlace apunta a una página que ya no existe. Ese único comportamiento es el argumento más fuerte a favor de un generador para una colección de documentación, porque los enlaces rotos en la documentación son silenciosos y constantes.

**Un índice de búsqueda.** Búsqueda de texto completo sobre todo el conjunto, construida en tiempo de compilación, servida como un archivo JSON que la página carga. Esto no lo consigues de archivos convertidos. La búsqueda del navegador dentro de la página busca en un documento; una caja de búsqueda busca en todos.

**Taxonomías.** Etiquetas, categorías, versiones, autores: cada una se convierte en su propia página de listado, generada, con paginación. El listado no existe como archivo de origen; se calcula. Así se construyen el índice de un blog, una página «todo lo etiquetado con API» y un selector de versiones.

**Compilaciones incrementales y un servidor con recarga en vivo.** Un generador sabe qué salidas dependen de qué entradas, así que un cambio de un carácter reconstruye una página en vez de todas, y el navegador se refresca mientras escribes. En una colección grande esa es la diferencia entre un bucle de edición en el que puedes trabajar y uno que tienes que esperar, lo cual a lo largo de un año es la diferencia entre documentación que se corrige y documentación que se abandona.

**Una cadena de procesado de recursos.** Imágenes redimensionadas y con huella digital, Sass compilado, CSS y JavaScript empaquetados y con hash para romper la caché. La salida referencia `style.a83f1c.css`, y puedes poner encima una cabecera de caché de un año sin miedo.

**Feeds, sitemaps y redirecciones.** RSS, `sitemap.xml`, y un mapa de redirecciones para que una URL antigua siga funcionando después de mover una página. Cada uno es aburrido, y cada uno es un trabajo real que algo tiene que hacer.

### Los costes, dichos como costes

**Una cadena de herramientas.** Un entorno de ejecución que antes no necesitabas, en cada máquina que compile el sitio: Python para MkDocs y Sphinx, Node para Docusaurus y Eleventy, un binario en Go o Rust para Hugo y mdBook. Y luego ese mismo entorno, en una versión compatible, en CI.

**Un lockfile, y el árbol que hay debajo.** Un generador en JavaScript con un theme y media docena de plugins se resuelve en un grafo de dependencias enorme, y cada entrada de ese grafo es algo que puede publicar un cambio incompatible o un aviso de seguridad. Esta es la mayor diferencia entre los generadores basados en Node y los compilados.

**Una compilación que se rompe un año después.** No por nada que hayas hecho. Una dependencia transitiva deja de dar soporte a tu versión del entorno, un theme fija una dependencia par que ya no resuelve, la imagen de CI sube de versión mayor por defecto. El sitio no ha cambiado, y ya no compila.

**Un theme que ahora mantienes.** El theme de cada generador o lo escribiste tú, en cuyo caso su accesibilidad, su modo oscuro y su maquetación móvil son tuyos para siempre, o lo escribió otra persona, en cuyo caso la actualización es tuya cada vez que cambie. Los themes son donde de verdad vive la mayor parte del mantenimiento de un generador.

**Configuración como algo que hay que aprender.** Un lenguaje de plantillas —plantillas de Go, Jinja, Nunjucks, JSX, Handlebars— más las propias convenciones de frontmatter y las reglas de carpetas del generador. Nada de eso se transfiere al siguiente generador.

**Alguien tiene que conocerlo.** Este es el coste que nadie pone en la cuenta. Un generador es barato solo mientras la persona que lo montó sigue ahí y todavía se acuerda. En el momento en que se convierte en «el sitio de docs que nadie entiende», cualquier cambio trivial se vuelve un pequeño proyecto de investigación, y los pequeños proyectos de investigación no se hacen.

## El número de documentos es el eje equivocado

El instinto es decidir por volumen: un archivo, usa un conversor; cincuenta archivos, usa un generador. Es la prueba equivocada, y produce los dos modos de fallo. Alguien con cincuenta notas de reunión sin relación instala Docusaurus y ahora mantiene React para publicar texto. Alguien con tres páginas interdependientes que deben estar al día tras cada fusión las convierte a mano, y en quince días están desactualizadas.

Tres preguntas lo decisen de verdad, y las tres son sobre relaciones y proceso, no sobre contar.

| La pregunta | Si sí | Si no |
| --- | --- | --- |
| ¿Las páginas necesitan saber unas de otras? | Necesitas navegación compartida, enlaces cruzados comprobados, un índice de búsqueda, listados por etiqueta — cosas que solo puede calcular una compilación sobre todo el conjunto. Eso es un generador, o una plataforma que lo es. | Cada página se sostiene sola. Un conversor por documento no es una concesión; es la forma correcta, y no hay nada que mantener con vida entre publicaciones. |
| ¿Tiene que republicarse según un calendario o con cada cambio? | Algo tiene que ejecutarse sin supervisión. Eso significa un comando, en CI, con versiones fijadas — un generador, o un conversor más un script, pero automatizado de una forma u otra. | Una persona que publica cuando se acuerda está bien, y una persona no puede ejecutar una compilación de forma confiable. Convertir a mano es honesto; un paso de compilación manual es una mentira que te cuentas a ti mismo. |
| ¿Quién tiene que ejecutarlo? | Si la respuesta incluye a alguien que no usa terminal, la compilación tiene que estar detrás de un botón — un job de CI en cada fusión, o una plataforma alojada. Un paso de compilación local lo excluye para siempre. | Si los únicos que publican son quienes escribieron la cadena de herramientas, una compilación local está bien, y el coste de mantenimiento se queda con quien la elegió. |

La primera pregunta trata de la estructura de la salida. La segunda, de si hay una persona en el bucle. La tercera, de quién se queda tirado cuando la cadena de herramientas se porta mal, que es la pregunta que con más frecuencia cambia la respuesta.

Dos síes de tres, e instala el generador. Tres noes, y estás mirando un conversor y un enlace. Un sí normalmente significa la opción del medio: un conversor manejado por un script, que es un paso de compilación sin sistema de compilación.

## Las opciones honestas, una junto a otra

Cada fila de aquí es una respuesta real para alguien. Los generadores aparecen con el lenguaje en que están escritos, porque ese es el entorno de ejecución cuya instalación estás aceptando, y con su licencia, porque eso es estable y comprobable de una manera en que una lista de funciones no lo es.

| Opción | Qué produce | Qué necesita | Quién lo ejecuta | A quién le sirve | Coste |
| --- | --- | --- | --- | --- | --- |
| Un conversor, un archivo cada vez | Un archivo HTML autocontenido, o un enlace | Un navegador | El autor, cuando lo necesita | Un documento con un destinatario; un informe; salida de un modelo; cualquier cosa que de otra forma habrías enviado como `.md` | Gratis |
| Un conversor más un script en CI | Una carpeta de archivos HTML, o un documento fusionado | Una CLI o una API, un archivo de workflow | El runner de CI, en cada push | Un puñado de páginas en un repositorio que deben seguir al día, sin necesidad de plantillas | Gratis; minutos de CI |
| MkDocs | Un sitio de documentación con navegación y búsqueda | Python | El autor en local, o CI | Documentación de proyecto escrita en Markdown por desarrolladores | Gratis, BSD-2-Clause (comprobado en github.com, el 9 de septiembre de 2026) |
| Docusaurus | Un sitio de documentación en React con versionado e i18n | Node, y conocimientos de React para cualquier personalización | En la práctica, CI | Documentación de producto versionada con un equipo de frontend detrás | Gratis, MIT (comprobado en github.com, el 9 de septiembre de 2026) |
| Hugo | Desde documentación hasta un gran sitio de contenidos | Un único binario descargado; Git, Go o Dart Sass para algunas funciones | Cualquiera con el binario | Sitios de contenidos grandes; equipos que no quieren gestor de paquetes | Gratis, Apache-2.0 (comprobado en github.com, el 9 de septiembre de 2026) |
| Eleventy | Lo que sea que plantilles, sin estructura impuesta | Node | El autor o CI | Gente que quiere una compilación con la menor cantidad de opiniones posible | Gratis, MIT (comprobado en github.com, el 9 de septiembre de 2026) |
| mdBook | Un libro lineal con tabla de contenidos y búsqueda | Un único binario descargado | Cualquiera con el binario | Manuales, guías, todo lo que se lee de principio a fin | Gratis, MPL-2.0 (comprobado en github.com, el 9 de septiembre de 2026) |
| Sphinx | Documentación de referencia con referencias cruzadas y extracción de API | Python; MyST-Parser para escribir en Markdown | Normalmente CI | Proyectos en Python; cualquier cosa que necesite referencias cruzadas reales y autodoc | Gratis, BSD-2-Clause (comprobado en github.com, el 9 de septiembre de 2026) |
| Una plataforma de documentación | Un sitio de docs alojado, construido para ti | Una cuenta, y tu repositorio conectado | La plataforma | Equipos que quieren que la compilación sea el problema de otro | Read the Docs Community es «gratis, para siempre» para código abierto; los planes comerciales son Basic 50 $, Advanced 150 $ y Pro 250 $ al mes, Enterprise desde 10.000 $ al año (comprobado en about.readthedocs.com, el 9 de septiembre de 2026) |
| El propio renderizador del repositorio | Markdown renderizado en una URL del repositorio | Nada | Nadie | Documentación interna leída por gente que ya tiene acceso al repositorio | Gratis |

La última fila es la opción que la gente olvida, y para documentación interna de ingeniería suele ser la correcta. GitHub y GitLab renderizan los documentos Markdown que viven en un repositorio, tablas y listas de tareas incluidas, en la propia URL del archivo (comprobado en docs.github.com y docs.gitlab.com, el 9 de septiembre de 2026). No hay compilación, no hay theme y no hay despliegue. Lo que pierdes es un árbol de navegación, una caja de búsqueda limitada a tus docs en vez de a todo el repositorio, y cualquier control sobre la presentación — y para una carpeta `docs/` leída solo por quienes ya hacen commits en ella, esa pérdida puede no costar absolutamente nada. [La documentación que vive en el repositorio](/blog/documentation-that-lives-in-the-repo) es más una disciplina que una cadena de herramientas, y la disciplina es la parte que importa.

## Caso uno: un documento que tiene que llegar a una persona

Este es, con diferencia, el caso más común, y el que más veces se resuelve con demasiada herramienta encima. Has escrito algo —una propuesta, una nota de traspaso, un informe, un resumen que hizo un asistente— y una persona o un grupo pequeño tiene que leerlo. Está terminado. No se va a actualizar. Nadie va a navegar de ahí a otra página.

Un generador es la forma equivocada para esto en todos los sentidos. Quiere un sitio; tú tienes un documento. Su salida es una carpeta de archivos con enlaces relativos entre ellos, lo que significa que no puedes enviarlo por correo — tienes que alojarlo, lo que significa un destino de despliegue, lo que significa un dominio o una subruta, lo que significa que alguien tiene que acordarse de que existe.

Lo que este caso necesita de verdad es un único archivo que se renderice correctamente allá donde caiga. Eso significa un documento HTML completo en vez de un fragmento, con sus estilos en línea y sin peticiones a un CDN, para que se vea igual en un portátil en un avión que en el tuyo. [Qué hace que un archivo HTML sea autocontenido](/blog/self-contained-html-explained) es una propiedad técnica muy concreta, y es toda la diferencia entre un archivo que sobrevive a ser reenviado y uno que no.

| Lo que necesitas | Conversor | Generador |
| --- | --- | --- |
| Enviarlo como adjunto | Un archivo, se abre con doble clic | Carpeta de archivos con enlaces relativos; no se puede adjuntar de forma útil |
| Enviarlo como enlace | Un enlace publicado, revocable | Un despliegue, un esquema de URL, y un hosting que mantener con vida |
| Sin instalación para quien lo envía | Corre en una pestaña del navegador | Un entorno de ejecución y una instalación de paquetes |
| Sin instalación para quien lo lee | Un navegador | Un navegador |
| Actualizarlo el mes que viene | Convertir otra vez | Reconstruir y redesplegar |
| Mantener el origen privado | Desconectado, la conversión en el navegador no sube nada | El origen suele vivir en un repositorio |

**¿Para quién es esto?** Para cualquiera cuya próxima acción sea «enviarle esto a alguien». Si el documento tiene un destinatario en vez de un público, quieres un archivo o un enlace, no un sitio. [Las formas de compartir un documento Markdown como enlace](/blog/share-a-markdown-document-as-a-link) cubre lo que cada método le pide al lector, que es la parte que decide si de verdad lo lee.

Lo único con lo que hay que tener cuidado: convertir un documento escrito por otra persona, o por un modelo, significa convertir texto que puede contener HTML crudo, porque Markdown lo permite. Un conversor que sanea contra una lista blanca se encarga de eso. Un generador normalmente no sanea nada, bajo la suposición razonable de que tú escribiste el contenido de tu propio sitio.

## Caso dos: un puñado de documentos en un repositorio

Ahora hay ocho archivos en `docs/`, cambian con el código, y alguien de fuera del repositorio tiene que poder leerlos. Este es el caso intermedio, y aquí la decisión del generador está genuinamente reñida.

Haz la primera pregunta de arriba. ¿Estas ocho páginas necesitan saber unas de otras? Si son ocho referencias independientes —una guía de instalación, un runbook, una nota de API, un acta de decisión— entonces no. Cada una se lee por su cuenta, se llega a ella por un enlace que alguien pegó. Si forman una secuencia, o comparten una barra lateral, o una de ellas es una página de aterrizaje que lista a las demás, entonces sí, y tienes un sitio pequeño.

Para el caso independiente, la herramienta honesta es un conversor con un script delante. Un workflow disparado en cada push convierte los archivos cambiados y los publica, y todo el aparato es un bucle de shell y una llamada a una CLI o una API. No hay lenguaje de plantillas, no hay theme, y no hay lockfile más allá de lo que tu CI ya tenga. [Convertir una carpeta de archivos Markdown en una sola pasada](/blog/batch-convert-markdown-files) es la parte mecánica; conectarlo a un disparador es el resto.

| Enfoque | Paso de compilación | Qué se rompe | Recuperación cuando se rompe |
| --- | --- | --- | --- |
| Convertir a mano cuando te acuerdas | Ninguno | Nada; la documentación simplemente envejece | Acordarte otra vez |
| Conversor más un script en CI | Un bucle y una llamada a la CLI | Cambia un flag de la CLI, o la versión de Node del runner sube | Leer la ayuda de un comando |
| Un generador en CI | Toda la compilación del generador | Un theme, un plugin, una dependencia par, el entorno de ejecución | Diseccionar un árbol de dependencias que no elegiste |
| Una plataforma de documentación | La suya | Su compilación, según su calendario | Abrir un ticket de soporte |

El trato es sencillo. Un script te da menos capacidades y muchos menos modos de fallo, y los modos de fallo que sí tiene son legibles: un comando, un flag, un código de salida. Un generador te da navegación y búsqueda, y una compilación que tienes que entender para repararla.

**¿Para quién es esto?** Para repositorios donde la documentación es material de referencia y no un producto. Si publicar en cada fusión es el requisito real —y normalmente lo es, porque la documentación que se publica a mano es documentación desactualizada—, entonces [publicar Markdown desde un workflow de GitHub Actions](/blog/publish-markdown-from-github-actions) es la misma cantidad de trabajo sea cual sea la herramienta que uses dentro del job. Elige la herramienta por lo que vas a tener que arreglar, no por cómo se ve el job el día que lo escribes.

Una cosa que un script no puede hacer, y merece la pena saberlo antes de comprometerte: no puede decirte que un enlace de la página tres a la página siete se ha roto. Nada recorre el conjunto. Si tus ocho páginas se enlazan mucho entre sí, esa comprobación que falta te va a costar más que el árbol de dependencias del generador.

## Caso tres: un sitio de documentación de verdad

Aquí el generador es correcto, y la única pregunta es cuál. Las señales son inequívocas: docenas de páginas, un árbol de navegación que la gente usa para encontrar cosas, una caja de búsqueda, colaboradores que no son la persona que lo montó, y probablemente versiones.

Decide en función de dos cosas, en este orden. Primero, qué entorno de ejecución mantiene ya tu equipo — porque el generador que comparte entorno con tu proyecto no te cuesta nada extra en CI, y el que no lo comparte te cuesta una segunda cadena de herramientas para siempre. Segundo, la forma de la salida: documentación de referencia, un libro lineal, un sitio de producto versionado, o un sitio de contenidos general. Los themes y el aspecto vienen en tercer lugar, y es la parte que vas a cambiar de todas formas.

### MkDocs

MkDocs es un generador de sitios estático para documentación de proyecto escrito en Python, publicado bajo la licencia BSD-2-Clause (comprobado en github.com, el 9 de septiembre de 2026). Sus fuentes son archivos Markdown configurados con un único archivo YAML, los traduce con la biblioteca Python Markdown, y su servidor de desarrollo recarga el navegador cada vez que guardas (comprobado en mkdocs.org, el 9 de septiembre de 2026). Ese detalle intermedio resuelve la cuestión de las extensiones antes de que la plantees: lo que puede contener una página es lo que las extensiones de Python Markdown puedan expresar, activadas mediante `markdown_extensions`.

| A favor | En contra |
| --- | --- |
| Un solo archivo de configuración, poca superficie que aprender | Navegar en un orden deliberado significa escribir la lista `nav` a mano; si la omites, los archivos salen ordenados alfanuméricamente (comprobado en mkdocs.org, el 9 de septiembre de 2026) |
| Python, que muchos equipos ya tienen en CI | Las extensiones por defecto son `meta`, `toc`, `tables` y `fenced_code`; cualquier otra hay que activarla y recordarla (comprobado en mkdocs.org, el 9 de septiembre de 2026) |
| Material for MkDocs es un theme maduro, con licencia MIT (comprobado en github.com, el 9 de septiembre de 2026) | La mayor parte de lo que la gente quiere viene del theme, así que heredas su ciclo de actualizaciones |
| Servidor con recarga en vivo para escribir en local | No pensado para nada que no sea documentación |

**¿Para quién es?** Para documentación de desarrolladores de un proyecto que ya usa Python, escrita por gente que quiere escribir Markdown y editar un archivo YAML.

### Docusaurus

Docusaurus construye sitios de documentación, tiene licencia MIT y está construido sobre JavaScript y React (comprobado en github.com, el 9 de septiembre de 2026). Su propia documentación lista entre sus funciones el versionado de documentos, la internacionalización entre idiomas, y MDX —componentes interactivos escritos como JSX y React dentro de Markdown— (comprobado en docusaurus.io, el 9 de septiembre de 2026). Eso es el argumento a favor y el argumento en contra en una sola frase: es la opción de esta lista que hace más cosas, sobre el entorno más grande.

| A favor | En contra |
| --- | --- |
| Versionado e internacionalización vienen incorporados, no añadidos | React y Node son ahora dependencias de tu documentación |
| MDX, así que las páginas pueden incrustar componentes vivos | Todo llega por npm, así que el grafo que parcheas es de un framework de frontend y no de un generador |
| Integraciones de búsqueda y una API de plugins | Personalizar cualquier cosa significa escribir React |
| Muy probado: lo usan muchos proyectos grandes | Las actualizaciones de versión mayor son proyectos de verdad |

**¿Para quién es?** Para un producto con varias versiones soportadas, más de un idioma, o ejemplos interactivos en la documentación — y un equipo de frontend a quien no le vaya a pillar por sorpresa una actualización de React.

### Hugo

Hugo es un generador de sitios estático escrito en Go, publicado bajo Apache-2.0 (comprobado en github.com, el 9 de septiembre de 2026), y distribuido como un binario descargable en vez de un árbol de paquetes. Es la opción con la menor superficie de dependencias continuas y el lenguaje de plantillas más exigente.

| A favor | En contra |
| --- | --- |
| Un binario que descargas; ningún gestor de paquetes en el medio | Las plantillas son `text/template` y `html/template` de Go (comprobado en gohugo.io, el 9 de septiembre de 2026), la sintaxis menos permisiva de esta lista |
| Suficientemente rápido para que el tiempo de compilación deje de ser un problema | Su documentación asume que ya conoces su vocabulario |
| Trata sitios de contenido, no solo documentación: taxonomías, secciones, feeds | Cuatro ediciones entre las que elegir, y la elección importa |
| Los themes se instalan como submódulo de Git, como hace el inicio rápido (comprobado en gohugo.io, el 9 de septiembre de 2026), o como módulos de Hugo | Las convenciones de los themes varían mucho entre unos y otros |

Merece la pena conocer las ediciones de Hugo antes de instalarlo: el proyecto documenta las compilaciones standard, deploy, extended y extended/deploy, donde deploy añade despliegue directo a Google Cloud Storage, AWS S3 o Azure Storage, y extended añade la transpilación de LibSass para Sass. La misma página apunta que Git, Go y Dart Sass se usan a menudo junto a Hugo —Git para módulos y submódulos de theme, Go para compilar desde el código fuente o usar módulos, Dart Sass para funciones modernas de Sass— y que el LibSass incrustado está obsoleto y «se eliminará en una futura versión» (comprobado en gohugo.io, el 9 de septiembre de 2026). Así que la historia del binario único es cierta, y en el momento en que quieres Sass actual o módulos de theme, le salen vecinos.

**¿Para quién es?** Para equipos que no quieren ningún gestor de paquetes de por medio, sitios más grandes que documentación, y cualquiera que prefiera aprender un lenguaje de plantillas a mantener un árbol de dependencias.

### Eleventy

Eleventy es un generador de sitios estático para Node, con licencia MIT, descrito por su propio repositorio como algo que transforma una carpeta de plantillas en HTML (comprobado en github.com, el 9 de septiembre de 2026). Su propiedad distintiva es que impone muy poco: ningún esquema de carpetas obligatorio, ningún theme incluido, y una elección de lenguajes de plantillas.

| A favor | En contra |
| --- | --- |
| Casi ninguna convención impuesta; construyes el sitio que quieres | Construyes el sitio que quieres, lo cual significa que lo construyes |
| Muchos lenguajes de plantillas —Nunjucks, Liquid, Handlebars, JavaScript, WebC y más— combinables en un mismo proyecto (comprobado en 11ty.dev, el 9 de septiembre de 2026) | Sin theme por defecto, la presentación empieza de cero |
| Huella de dependencias pequeña para estándares de JavaScript | Navegación, búsqueda y versionado son plugins o código propio |
| Configuración en JavaScript llano en vez de un framework | Menos configuraciones de documentación listas para usar que MkDocs o Docusaurus |

**¿Para quién es?** Para gente que ha mirado el theme de un generador de documentación y ha querido borrar la mayor parte — y que tiene tiempo para sustituirlo.

### mdBook

mdBook crea un libro a partir de archivos Markdown, está escrito en Rust y publicado bajo MPL-2.0 (comprobado en github.com, el 9 de septiembre de 2026). Hace bien una sola cosa: un documento lineal con tabla de contenidos, navegación por capítulos y búsqueda. Un único `SUMMARY.md` le dice qué capítulos incluir, en qué orden, en qué jerarquía y dónde están los archivos de origen, y el libro compilado responde a `S` o `/` con una caja de búsqueda (comprobado en rust-lang.github.io, el 9 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| Un binario, como Hugo; ningún entorno de ejecución que instalar | Libros, no sitios: sin taxonomías, sin feeds, sin páginas de listado |
| Un único `SUMMARY.md` define toda la estructura | Los themes están limitados por diseño |
| Búsqueda incluida sin configuración | No es la herramienta para documentación de referencia por la que saltas de un lado a otro |
| Muy poco que aprender o mantener | Ecosistema más pequeño que el de los demás |

**¿Para quién es?** Para manuales, tutoriales, guías internas y todo lo que tenga capítulos que se leen en orden.

### Sphinx

Sphinx es un generador de documentación escrito en Python y publicado bajo una licencia BSD-2-Clause, cuyo marcado por defecto es reStructuredText (comprobado en github.com, el 9 de septiembre de 2026). El soporte de Markdown viene de MyST-Parser, un analizador compatible con CommonMark y licencia MIT que hace de puente hacia Sphinx (comprobado en github.com, el 9 de septiembre de 2026). Su propio sitio describe la generación de documentación de API a partir de docstrings para Python, C++ y otros dominios; referencias cruzadas a secciones, figuras, tablas, citas, glosarios y objetos de código, también entre proyectos separados; y salida como HTML, LaTeX para PDF, ePub y Texinfo (comprobado en sphinx-doc.org, el 9 de septiembre de 2026). Esas tres capacidades son la razón de que sobreviva a su propio peso conceptual.

| A favor | En contra |
| --- | --- |
| Referencias cruzadas reales: enlazas a una función, un término o una página y quedan comprobadas | reStructuredText por defecto, así que Markdown es un añadido deliberado |
| Documentación de API extraída del código fuente | El modelo conceptual más pesado de esta lista: directivas, roles, dominios |
| Varios formatos de salida a partir de una sola fuente, PDF incluido | La configuración es Python, y crece |
| Muy establecido en proyectos científicos y de Python | Excesivo para un sitio de docs sin superficie de API |

**¿Para quién es?** Para proyectos cuya documentación tiene que referenciar código con precisión — bibliotecas, software científico, cualquier cosa donde «enlazar a la documentación de esta función» sea una necesidad diaria.

### Una plataforma de documentación

La cuarta categoría no es un generador en absoluto: conectas un repositorio y otra cosa construye y aloja el sitio. Read the Docs es el ejemplo de siempre para proyectos con Sphinx y MkDocs, y afirma que Read the Docs Community es «gratis, para siempre» para código abierto, con planes comerciales de Basic 50 $, Advanced 150 $ y Pro 250 $ al mes y Enterprise desde 10.000 $ al año (comprobado en about.readthedocs.com, el 9 de septiembre de 2026). También construye tu documentación para cada nuevo pull request, lo que significa que un cambio se puede leer en su sitio antes de que se fusione, no después (comprobado en docs.readthedocs.com, el 9 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| Otro es dueño del entorno de compilación y de sus actualizaciones | Tú eres dueño de la configuración, pero no del entorno en el que corre |
| Vistas previas de pull request y compilaciones versionadas sin archivos de workflow | Depurar una compilación fallida significa leer sus logs, no los tuyos |
| Una URL y un hosting que no mantienes | Precios comerciales para repositorios privados |
| Se puede dar acceso a gente no técnica sin terminal | Migrar fuera significa reconstruir la pipeline que te ahorraste |

**¿Para quién es?** Para equipos que han concluido que el generador es necesario y la infraestructura de compilación no es interesante. Es una conclusión razonable, y es la única opción de esta lista en la que el coste de mantenimiento del segundo año es el problema de personal de otro.

## El segundo año, que es donde vive el coste

Toda página de inicio mide el coste de un generador en minutos. Esa cifra es honesta e irrelevante. La instalación no es el coste; la instalación es lo más barato que le va a pasar nunca a este sitio.

Así es la forma del coste real. En el primer mes, alguien monta el generador, elige un theme, y consigue un sitio que se ve bien y se publica en cada fusión. Funciona. Nadie piensa en ello durante diez meses, que es exactamente lo que un paso de compilación tiene que darte. En el mes once pasa una de cuatro cosas.

La imagen de CI actualiza su entorno por defecto, y una dependencia nativa en algún lugar del árbol del theme ya no tiene un binario precompilado para la nueva versión, así que la compilación falla al compilar algo que nadie sabía que estaba ahí. O un aviso de seguridad aparece en una dependencia transitiva, la actualización automática abre un pull request, y el rango de dependencia par del theme rechaza la nueva versión mayor — así que puedes dejar el aviso abierto o actualizar el theme, lo que cambia el diseño del sitio. O el theme sencillamente ya no se mantiene, y el fork al que todo el mundo se ha pasado tiene claves de configuración distintas. O no pasa nada de eso, y en cambio alguien necesita añadir una página, descubre que la navegación está declarada en un archivo YAML con una convención de orden que no puede deducir, y pregunta en un canal donde la única persona que lo sabía ya se ha ido.

Esto último es lo más común y lo menos comentado. La dependencia real de una cadena de herramientas es una persona. El generador está bien; el conocimiento se ha evaporado. Y el fallo no es dramático — se parece a documentación que deja de actualizarse, porque el coste de actualizarla pasó de «editar un archivo» a «averiguar cómo compila esto».

Los generadores compilados están notablemente mejor en esto. Hugo y mdBook son binarios: fija la versión, comitea el número de versión, y la compilación que funcionó el año pasado funciona este año porque no se resuelve nada en tiempo de compilación. Las opciones basadas en Node son el otro extremo — la mayor capacidad, las más piezas móviles, y un lockfile que describe centenares de cosas que pueden cambiar debajo de ti.

### Y el contrapeso, que es real

Nada de esto significa «usa siempre un conversor». Dejar atrás un conversor es una migración genuinamente molesta, y fingir lo contrario sería deshonesto.

Así se ve: tienes treinta páginas publicadas por un script. Ahora alguien quiere una barra lateral. Así que escribes una, a mano, en cada archivo — o escribes un pequeño paso de plantillas, y luego un paso de generación de navegación, y luego un comprobador de enlaces, porque las páginas empezaron a referenciarse entre sí. Seis meses de eso, y has construido un mal generador de sitios estático sin documentación y con un solo mantenedor. Eso es peor que adoptar MkDocs el primer día, considerablemente peor, y es una forma habitual de acabar en un lío.

La migración en sí cuesta: las URL cambian si no tienes cuidado, lo que significa redirecciones; el frontmatter hay que reformarlo a lo que el generador espera; cualquier cosa que tu script hiciera de forma improvisada hay que reexpresarla en un lenguaje de plantillas. Es una semana de trabajo, no un día.

Así que la regla honesta es asimétrica. Empezar con un conversor y pasarte después a un generador te cuesta una migración acotada, una vez, si el requisito de verdad crece. Empezar con un generador que no necesitabas te cuesta mantenimiento cada año, crezca o no el requisito. El primer riesgo es una cantidad conocida; el segundo es una suscripción. Pero en el momento en que te pilles escribiendo lógica de plantillas alrededor de un conversor, para e instala un generador — esa es la señal, y es inconfundible cuando llega.

## Seis preguntas para responder sobre tu propia situación

Responde estas sobre los documentos que de verdad tienes, no sobre los que podrías tener el año que viene.

1. **¿Alguna página necesita un enlace a otra página que no pueda romperse en silencio?** Si sí, necesitas algo que recorra todo el conjunto y falle cuando un enlace se pudra, lo que significa un generador o una plataforma — un conversor por archivo no puede ver los demás archivos, así que la putrefacción es invisible hasta que un lector se la encuentra.
2. **¿Alguien necesita buscar en todo el conjunto?** La búsqueda del navegador dentro de la página busca en un documento. Una caja de búsqueda necesita un índice construido sobre cada página en tiempo de compilación, y nada que convierta archivos de uno en uno puede producirlo, así que esta pregunta sola puede decidirlo.
3. **¿Tiene que republicarse sin que nadie lo decida?** Si la documentación tiene que estar al día tras cada fusión, el paso de publicación tiene que correr sin supervisión, y entonces la única pregunta es si eso sin supervisión es un generador o un script de tres líneas — pero publicar a mano no es una opción que puedas elegir, porque degenera en no publicar.
4. **¿Quién es la persona menos técnica que va a tener que publicar un cambio?** Si esa persona no usa terminal, cualquier paso de compilación local la excluye para siempre, y el sitio va a acumular una cola de ediciones esperando a otra persona — así que la compilación pertenece a CI o a una plataforma, la que elijas.
5. **¿Qué entorno de ejecución mantiene tu equipo ya funcionando en CI?** Elegir un generador sobre un entorno que de otra forma no mantienes duplica el número de cadenas de herramientas que parcheas, y la segunda siempre se parchea tarde, que es como una compilación de docs termina siendo lo más viejo de tu pipeline.
6. **Si la persona que monta esto se va dentro de seis meses, ¿puede otra añadir una página?** Escribe la respuesta con honestidad. Si es no, elige la opción con menos configuración en vez de la de más capacidad — un sitio algo peor que cualquiera pueda editar gana a uno mejor que nadie se atreve a tocar.

Puntúalas. Dos o más síes en las preguntas uno a tres significa un generador, y las preguntas cuatro y cinco eligen cuál. Si las preguntas uno a tres son todas no, estás mirando un problema con forma de documento, y la herramienta para un problema con forma de documento es un conversor.

## Conclusión

Un generador de sitios estático es la respuesta correcta cuando las páginas tienen que saber unas de otras y la compilación tiene que correr sin ti. Es la respuesta equivocada para un documento con un destinatario, para un conjunto de notas sin relación, y para cualquier situación en la que nadie del equipo vaya a entender la compilación dentro de un año. El término medio es real y se usa poco: un conversor con un script delante publica una carpeta de páginas en cada push, sin theme, sin lockfile y con un único comando que depurar. Si lo que tienes es un solo documento que tiene que llegar a alguien y verse bien al llegar, [convertir Markdown a un archivo HTML autocontenido](/) necesita un navegador y ninguna instalación, y no queda nada que mantener después. Instala el generador cuando la segunda pregunta que te haces sobre tus documentos sea «¿cómo enlazo esto entre sí?» — y no antes.

## Preguntas frecuentes

### ¿Necesito un generador de sitios estático para publicar un solo archivo Markdown?

No. Un generador produce una carpeta de archivos interenlazados, que es exactamente la salida equivocada para un solo documento — no puedes adjuntarlo a un correo, y alojarlo significa mantener con vida un destino de despliegue. Convertirlo a un archivo HTML autocontenido, o publicarlo como enlace, y ya está.

### ¿Es excesivo un generador de sitios estático para una carpeta `docs/` en mi repositorio?

Depende por completo de si las páginas se referencian entre sí. Ocho páginas de referencia independientes están bien convertidas una a una, o incluso leídas como Markdown renderizado en sus propias URL del repositorio. Ocho páginas con una barra lateral compartida y enlaces cruzados son un sitio pequeño, y un generador va a comprobar los enlaces que de otra forma romperías tú.

### ¿Qué generador de sitios estático tiene el mantenimiento más bajo?

Los que se distribuyen como un único binario, porque no se resuelve nada en tiempo de compilación. Hugo (Apache-2.0) y mdBook (MPL-2.0) se instalan como un binario descargado, así que fijar una versión significa que la compilación que funcionó el año pasado sigue funcionando. Los generadores basados en Node ofrecen más capacidad y una superficie de dependencias mucho mayor que mantener parcheada.

### ¿Puedo usar un generador de sitios estático sin saber JavaScript?

Sí. MkDocs y Sphinx son Python, Hugo es un binario en Go, y mdBook es un binario en Rust — ninguno te obliga a escribir JavaScript. Docusaurus es la excepción: personalizarlo más allá de la configuración significa escribir React, y esa es una razón justa para elegir otra cosa.

### ¿Qué pasa si empiezo con un conversor y lo acabo superando?

Migras, y cuesta más o menos una semana: reformar el frontmatter, reexpresar el comportamiento de tu script en un lenguaje de plantillas, y añadir redirecciones para que las URL antiguas sigan funcionando. Es un coste acotado y de una sola vez, que compara bien con mantener una compilación que nunca necesitaste. La señal para migrar es el día en que empiezas a escribir lógica de plantillas alrededor del conversor.

### ¿Puedo tener búsqueda sobre mis documentos sin un generador?

No de una forma satisfactoria. La búsqueda necesita un índice construido sobre todo el conjunto, que por definición es un trabajo en tiempo de compilación. Si una caja de búsqueda es un requisito, es una de las razones más fuertes de esta lista para usar un generador o una plataforma de documentación alojada.

### ¿Es suficiente publicar Markdown en GitHub o GitLab?

Para documentación interna de ingeniería, a menudo sí. Ambos renderizan los documentos Markdown que viven en un repositorio —tablas y listas de tareas incluidas— en la propia URL del archivo, sin compilación, sin theme y sin despliegue (comprobado en docs.github.com y docs.gitlab.com, el 9 de septiembre de 2026). Lo que renuncias es navegación, búsqueda limitada y control sobre la presentación — lo cual puede no costar absolutamente nada si los únicos lectores son quienes ya hacen commits en el repositorio.
