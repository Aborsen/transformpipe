---
title: "Elegir un conversor de Markdown por línea de comandos, sin sorpresas al ejecutarlo"
description: "Convertir Markdown a HTML desde una terminal: Pandoc, cmark-gfm, comrak, Node, Python, una llamada a la API, y el escapado y el glob que falla en CI."
date: 2026-08-26
tag: Workflow
keywords: conversor markdown linea de comandos, markdown a html cli, convertir markdown terminal, script markdown a html, markdown a html node, convertir markdown en lote, convertir carpeta de markdown, pandoc html standalone
---

Un conversor de navegador es la herramienta adecuada para un archivo. Deja de serlo en el momento en que la conversión tiene que ocurrir en cada commit, o cuando una carpeta tiene cuarenta archivos y nadie quiere cuarenta pestañas. En ese punto quieres un comando — algo que un Makefile, un script de shell o un trabajo de CI pueda invocar sin que nadie haga clic en nada.

El problema es que un comando que funciona y un comando que sigue funcionando son dos cosas distintas. La línea que escribes una vez, ves triunfar y pegas en un script es la misma línea que va a correr sin vigilancia mil veces, contra nombres de archivo que no elegiste, en un runner con un shell distinto, una configuración regional distinta y sin Pandoc instalado. Casi toda conversión de terminal que falla en producción falla por un motivo que no tiene nada que ver con Markdown.

Así que este texto va en dos mitades. Primero los conversores: qué es cada uno, qué emite realmente, y las banderas exactas que marcan la diferencia entre un fragmento y un documento. Luego las partes que la gente hace mal — el escapado, el glob, dónde acaba el resultado, qué significa realmente tu código de salida, y qué cuesta instalar un conversor en cada ejecución de CI.

### Resumen rápido

Si ya hay un conversor en la máquina, una línea basta: `pandoc -f gfm -t html -s --embed-resources README.md -o README.html` produce un documento completo de un solo archivo en vez de un fragmento, y `--sandbox` lo hace más seguro para apuntarlo a un archivo que no escribiste. Si no hay nada instalado y quieres que siga así, un script de Node de cinco líneas sobre `marked`, una llamada a `python -m markdown`, o un `curl` a una API HTTP superan todos a instalar un conversor de documentos que vas a usar una vez. Los fallos casi nunca están en el analizador: son nombres de archivo sin comillas, un glob que ordenó `10-api.md` antes de `2-setup.md`, un resultado escrito en el árbol equivocado, y una tubería que reportó éxito porque `tee` tuvo éxito. En CI el coste honesto de Pandoc es la instalación en cada ejecución, por lo que un binario estático, una imagen en caché o una llamada a una API a menudo ganan solo por tiempo de reloj.

## Por qué la terminal cambia la pregunta

En un navegador, un conversor de Markdown toma cuatro decisiones por ti y te muestra el resultado al momento. En una terminal toma las mismas cuatro decisiones en silencio, y te enteras semanas después.

**Qué dialecto analiza.** CommonMark puro no tiene tablas, listas de tareas, tachado ni enlaces automáticos. GitHub Flavored Markdown tiene las cuatro cosas. Casi todo CLI trae un valor por defecto, y rara vez es GFM: el lector predeterminado de Pandoc es su propio dialecto extendido, cmark-gfm viene con todas las extensiones apagadas, comrak las activa solo con `--gfm` o una extensión explícita. Una tabla que el analizador no reconoce no da error. Se convierte en un párrafo lleno de barras verticales, y el trabajo termina con código cero.

**Si emite un documento o un fragmento.** La mayoría de estas herramientas son bibliotecas con un ejecutable delgado atornillado encima, y una biblioteca devuelve correctamente `<h1>Title</h1><p>Text</p>` sin nada alrededor. Abierto en un navegador, eso es texto negro sin estilo, en la fuente por defecto del navegador y a todo el ancho de la ventana. Es HTML válido y le parece roto a todo el que lo recibe. Solo algunas de estas herramientas tienen una bandera que lo envuelve.

**Qué hace con el HTML crudo.** Markdown se diseñó para dejar pasar HTML, así que un archivo `.md` puede llevar `<script>`, `onerror=` y enlaces `javascript:`. Pandoc lo deja pasar todo. marked lo deja pasar todo y lo dice en su propia documentación. cmark-gfm y comrak lo suprimen salvo que pases `--unsafe`. markdown-it lo escapa salvo que actives su opción `html`. Si el archivo viene de fuera de tu repositorio, esa decisión es todo el modelo de seguridad — [sanear es un trabajo aparte con sus propias reglas](/blog/sanitising-markdown-safely).

**Qué le dice al shell cuando falla.** Un conversor que muere a mitad de archivo aún deja un archivo parcial en disco, y si lo canalizaste, el estado de salida de la tubería pertenece al último comando en vez de al que murió. Es la forma más común en que una compilación rota reporta verde.

Ninguna de las cuatro es exótica. Las cuatro son invisibles hasta que alguien abre el resultado.

## Comparativa rápida: la chuleta

| Tool | Best for | Key capability | Price |
| --- | --- | --- | --- |
| Pandoc | Cualquier cosa más allá de HTML, y control exacto de la envoltura | `--standalone`, `--embed-resources`, `--template`, `--sandbox` | Gratis, GPL |
| cmark-gfm | Un renderizador GFM pequeño, rápido y predecible | C sin dependencias, extensiones opcionales con `-e` | Gratis, BSD de 2 cláusulas |
| comrak | Un solo binario estático con GFM detrás de una bandera | Rust, `--gfm`, HTML crudo apagado salvo `--unsafe` | Gratis, BSD de 2 cláusulas |
| marked CLI | Una conversión en un repositorio que ya tiene Node | `marked -o out.html` leyendo la entrada estándar | Gratis, MIT |
| markdown-it CLI | Conformidad con CommonMark desde un shell | Trae un ejecutable `markdown-it`; escapa HTML crudo por defecto | Gratis, MIT |
| Un script de Node | Resultado que controlas tú, envoltura incluida | Cinco líneas sobre marked o markdown-it, ninguna herramienta nueva | Gratis |
| Python `markdown_py` | Una compilación de Python que ya existe | `python -m markdown -x tables`, API de extensiones | Gratis, BSD de 3 cláusulas |
| Go y goldmark | Un solo binario compilado para entregar a un runner | Solo biblioteca; un `main.go` de veinte líneas se convierte en el CLI | Gratis, MIT |
| `curl` y una API HTTP | Sin cadena de herramientas local, y un enlace al final | Una petición, sin instalación, el resultado puede ser una página en vivo | Gratis |
| Un CLI sin dependencias (`tp`) | Pasos de CI que no deben arrastrar un árbol de paquetes | `login`, `push`, `list`, `rm`, `usage`, `--json` | Gratis |

## Todo conversor de Markdown por línea de comandos que merece la pena

### Pandoc — mejor cuando la envoltura importa tanto como el HTML

Pandoc es un conversor de documentos escrito en Haskell que lee y escribe alrededor de cuarenta formatos. Como conversor de Markdown por línea de comandos es más herramienta de la que el trabajo necesita, y es también el único de esta lista que produce un documento completo, autocontenido y con plantilla sin que tengas que escribir tú la maquinaria de plantillas.

| Pros | Cons |
| --- | --- |
| `--standalone` y `--embed-resources` dan un documento real de un solo archivo | Una instalación grande que mantener fijada, en cada máquina que ejecute el trabajo |
| Las plantillas y los filtros Lua controlan el resultado con precisión | Las plantillas son un segundo lenguaje que aprender |
| `--sandbox` limita el acceso al sistema de archivos cuando el origen no es de confianza | Sin saneado: el HTML crudo pasa directo a la página |
| Lee GFM, CommonMark y su propio dialecto, elegido explícitamente | Sus dialectos difieren de formas que sorprenden a mitad de una migración |

**Precio:** gratis, con licencia GPL.

**Detalles técnicos y funciones**

- `-f gfm` elige el lector de GitHub Flavored Markdown, así que las tablas, listas de tareas, tachado y enlaces automáticos se analizan; `-f commonmark` elige el estricto
- `-s` (`--standalone`) produce «un resultado con una cabecera y un pie apropiados… no un fragmento», en palabras del propio manual
- `--embed-resources` incrusta hojas de estilos, scripts e imágenes enlazados como URIs `data:`; el antiguo `--self-contained` es ahora un sinónimo obsoleto de `--embed-resources --standalone`
- `--template FILE` usa tu propia envoltura, e implica `--standalone`
- `-M key=value` fija un campo de metadatos, `--metadata-file` lee un archivo YAML o JSON entero de ellos, y un valor dado en la línea de comandos sobrescribe uno del documento
- `--defaults FILE` mueve una invocación larga a un archivo YAML que puedes tener en el repositorio
- `--toc`, `-N` para secciones numeradas, y `--shift-heading-level-by` se encargan de la parte estructural
- `--resource-path` dice dónde buscar imágenes, separado por `:` en Unix y `;` en Windows
- `--syntax-highlighting=STYLE` elige el tema de resaltado — sustituye a la ya obsoleta `--highlight-style` — y `--list-highlight-styles` imprime lo que soporta tu compilación
- `--file-scope` analiza cada archivo por separado antes de combinarlos, lo que cambia el comportamiento de notas al pie y enlaces con entrada de varios archivos
- `--sandbox` ejecuta la conversión «limitando las operaciones de E/S en lectores y escritores a leer los archivos indicados en la línea de comandos»
- `--fail-if-warnings` convierte un aviso en una salida distinta de cero, que es la bandera que hace a Pandoc honesto dentro de un script

Un documento completo, en un comando:

```bash
pandoc -f gfm -t html -s \
  --embed-resources \
  --metadata title="API reference" \
  --toc --fail-if-warnings \
  docs/api.md -o build/api.html
```

`--metadata title=` no es opcional en la práctica. Sin un título, Pandoc avisa y te da un documento independiente con nada útil en su `<title>`, y con `--fail-if-warnings` ese aviso se convierte en un error — que es lo que quieres la primera vez y lo que te irrita la quinta vez que se te olvida. Pon la invocación entera en un archivo `--defaults` y el argumento deja de ser algo que puedas olvidar.

**¿Para quién es?** Para cualquiera cuyo resultado no sea solo HTML, para cualquiera que necesite que la envoltura coincida con una plantilla de la casa, y para cualquiera que convierta archivos que no escribió, porque `--sandbox` no tiene equivalente en el resto de esta lista. Si HTML es el único destino y la envoltura no importa, [las opciones más pequeñas son genuinamente más pequeñas](/blog/pandoc-alternatives-for-markdown-to-html).

### cmark-gfm — el mejor renderizador GFM pequeño y predecible

cmark-gfm es el fork de GitHub de la implementación de referencia de CommonMark, escrito en C99 estándar sin dependencias externas. Hace un solo trabajo a toda velocidad y te entrega un fragmento sin ningún estilo.

| Pros | Cons |
| --- | --- |
| Sin dependencias, así que compila y cachea casi al instante | Resultado en fragmento: sin doctype, sin head, sin estilos, nunca |
| Las extensiones son explícitas, así que el comportamiento se lee desde el comando | Tienes que recordar cada bandera `-e`, cada vez |
| El HTML crudo se suprime salvo que lo pidas con `--unsafe` | Empaquetado de forma inconsistente entre distribuciones |
| Sigue de cerca la especificación GFM | Nada más allá de HTML y sus propios formatos con forma de AST |

**Precio:** gratis, con licencia BSD de 2 cláusulas.

**Detalles técnicos y funciones**

- `-t` / `--to FORMAT` elige el formato de salida; HTML es el que quieres aquí
- `-e` / `--extension NAME` activa una extensión a la vez, y `--list-extensions` imprime lo que realmente tiene tu compilación
- `--unsafe` es lo que permite HTML crudo y enlaces arriesgados; sin ella se eliminan, que es la opción correcta por defecto para un archivo de fuera
- `--hardbreaks` convierte los saltos simples en `<br>`, y `--smart` produce comillas y rayas tipográficas
- `--width` controla el ajuste para los formatos de salida con forma de texto

```bash
cmark-gfm -e table -e strikethrough -e autolink -e tasklist \
  README.md > build/README.html
```

Ejecuta `cmark-gfm --list-extensions` antes de dar por buena esa línea. Los nombres de extensión vienen de la compilación, y un nombre que tu máquina acepta no está garantizado en la versión que trae tu distribución en el runner — lo cual falla al menos ruidosamente, en lugar de descartar las tablas en silencio.

**¿Para quién es?** Para compilaciones que convierten muchos archivos y les importan los segundos, y para cualquiera que quiera el HTML crudo suprimido por defecto sin añadir su propio sanitizador. No para nadie que necesite que el resultado se pueda abrir tal cual.

### comrak — el mejor binario estático único

comrak es una implementación de CommonMark y GFM en Rust que, a diferencia de goldmark, trae un binario de línea de comandos de verdad. Cumple con CommonMark 0.31.2 por defecto y pasa la suite completa de GFM (comprobado en github.com/kivikakk/comrak, 8 de septiembre de 2026), y se instala con `cargo install comrak`, desde Homebrew, pacman, dnf o Scoop, o como un binario de release que descargas una vez.

| Pros | Cons |
| --- | --- |
| Un binario estático: nada que resolver en la máquina destino | Resultado en fragmento, como cmark-gfm |
| `--gfm` activa todo el conjunto GFM con una sola bandera | `cargo install` compila, lo cual es lento la primera vez |
| El HTML crudo y los enlaces arriesgados están apagados salvo que pases `--unsafe` | Compilar desde el origen necesita una versión reciente de Rust |
| También escribe XML y CommonMark, útil para ida y vuelta | Ecosistema más pequeño que los analizadores de JavaScript |

**Precio:** gratis, con licencia BSD de 2 cláusulas.

**Detalles técnicos y funciones**

- `--gfm` activa tachado, tablas, enlaces automáticos y listas de tareas todos juntos
- `--extension NAME` activa extensiones individuales, incluidas algunas fuera de GFM como notas al pie y superíndice
- `--unsafe` permite HTML crudo y enlaces peligrosos; ambos están desactivados por defecto
- `--to` elige salida en HTML, XML o CommonMark

```bash
comrak --gfm README.md > build/README.html
```

**¿Para quién es?** Para cualquiera que quiera que la conversión sea un solo archivo que pueda copiar en un runner, en un contenedor, o en el portátil de un compañero sin ningún gestor de paquetes de por medio. Descargar un binario de release y guardarlo en tu directorio de herramientas es una estrategia legítima, y es lo más barato de cachear de toda esta página.

### marked CLI — mejor cuando el repositorio ya tiene Node

marked es el analizador de Markdown pequeño y rápido de JavaScript, y instalarlo también instala un ejecutable `marked`. Su propio uso documentado lee de la entrada estándar y escribe donde diga `-o`.

| Pros | Cons |
| --- | --- |
| Ya es una dependencia en muchísimos proyectos de JavaScript | Resultado en fragmento; la envoltura es problema tuyo |
| GFM está activado por defecto, así que las tablas funcionan sin banderas | Sin saneado, por diseño explícito |
| `marked --help` lista las opciones, y son pocas | Necesita Node en cada máquina que ejecute el trabajo |

**Precio:** gratis, con licencia MIT.

```bash
npx --yes marked -o build/README.html < README.md
```

El `--yes` importa más de lo que parece. Sin él, `npx` en una máquina sin copia local se detiene a pedir permiso para descargar el paquete, y un paso de CI que se detiene a hacer una pregunta se queda colgado hasta que el trabajo agota el tiempo.

**¿Para quién es?** Para proyectos que ya dependen de marked para renderizar dentro de la aplicación y quieren que la compilación use el mismo analizador, para que la página y la app no puedan discrepar sobre el mismo archivo.

### markdown-it CLI — la mejor conformidad desde un shell

markdown-it es el analizador conforme con CommonMark detrás de la vista previa de Markdown de VS Code, y su paquete declara un ejecutable `markdown-it`, así que una simple invocación con `npx` funciona sin nada más instalado.

| Pros | Cons |
| --- | --- |
| Sigue de cerca la especificación CommonMark | Algo más lento que marked |
| Escapa el HTML crudo salvo que actives la opción `html` | Resultado en fragmento |
| Un ecosistema de plugins real — notas al pie, anclas, contenedores | Los plugins se alcanzan desde la API, no desde el CLI |

**Precio:** gratis, con licencia MIT.

```bash
npx --yes markdown-it README.md > build/README.html
```

El CLI es deliberadamente sencillo. En el momento en que quieres un plugin — anclas de encabezado, notas al pie, una sintaxis de contenedor — has dejado de usar el CLI y empezado a escribir el script de la siguiente sección, que está bien y cuesta cinco líneas.

**¿Para quién es?** Para cualquiera que quiera el HTML crudo escapado por defecto y la especificación respetada, y para cualquiera a punto de graduarse de una línea a un script.

### Un script de Node — el mejor cuando también quieres la envoltura

Todo problema de fragmento de esta página desaparece en el momento en que escribes las cinco líneas tú mismo, porque la plantilla es un template literal y ya sabes HTML.

```js
// md2html.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';

const [input, output] = process.argv.slice(2);
const body = marked.parse(readFileSync(input, 'utf8'));

writeFileSync(
  output,
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${input}</title>
<style>
body{max-width:44rem;margin:2rem auto;padding:0 1rem;font:16px/1.6 system-ui,sans-serif}
table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.4rem .6rem}
pre{overflow-x:auto;background:#f6f8fa;padding:1rem;border-radius:6px}
</style>
</head>
<body>
${body}
</body>
</html>
`
);
```

| Pros | Cons |
| --- | --- |
| El resultado es un documento de verdad, con el estilo que tú decidiste | Es tuyo, incluidos los errores |
| Cualquier analizador, cualquier plugin, cualquier paso de posprocesado que quieras | Necesita Node, y un lockfile para seguir siendo reproducible |
| Ningún binario nuevo en la máquina más allá de lo que ya tiene el repositorio | Sanear sigue siendo cosa tuya añadirlo |

**Precio:** gratis. La licencia del analizador es MIT en cualquier caso.

**Detalles técnicos y funciones**

- Cambia `marked` por `markdown-it` y obtienes HTML crudo escapado más plugins, por dos líneas más
- Añade un sanitizador antes de escribir si el origen no es tuyo; la respuesta documentada para marked es pasar su salida por DOMPurify
- `process.exitCode = 1` dentro de un `catch` es lo que hace usable el script en una tubería; un script que lanza una excepción sale con código distinto de cero, pero uno que registra el error y sigue no lo hace
- Instala con `npm ci`, no `npm install`, para que la versión del analizador venga del lockfile en vez del calendario

Resiste la tentación de comprimir esto en un verdadero one-liner. `node -e` en una sola línea significa que todo el programa tiene que sobrevivir a las reglas de escapado de tu shell, que es el tema de una sección más adelante, y es el lugar menos gratificante de esta página para hacerse el listo.

**¿Para quién es?** Para cualquiera que necesite que el resultado se abra por sí solo y no quiera instalar un conversor de documentos para conseguirlo. Para la mayoría de los repositorios, la mayoría de las veces, esta es la respuesta.

### Python y `markdown_py` — el mejor dentro de una compilación de Python

Python-Markdown es la implementación de Markdown de siempre para Python y el motor detrás de MkDocs. Instalarlo te da un script `markdown_py`, y `python -m markdown` hace lo mismo sin preocuparte de si el directorio de scripts está en tu `PATH`.

| Pros | Cons |
| --- | --- |
| Ya presente en la mayoría de las cadenas de documentación de Python | No conforme con CommonMark en cada detalle |
| Una API de extensiones madura, con extensiones para tablas y notas al pie | Las extensiones son opcionales, así que el resultado plano no tiene tablas |
| Configurable desde un archivo YAML o JSON con `-c` | Más lenta que las implementaciones en C, Rust y Go |

**Precio:** gratis, con licencia BSD de 3 cláusulas.

**Detalles técnicos y funciones**

- El uso es `python -m markdown [options] [args]`, y el HTML va a la salida estándar
- `-x` / `--extension NAME` carga una extensión; repite la bandera para cada una
- `-c` / `--extension_configs FILE` lee la configuración de extensiones desde YAML o JSON, que es donde pertenece cualquier cosa con opciones

```bash
python -m markdown -x tables -x fenced_code -x toc \
  README.md > build/README.html
```

Sin `-x tables` tus tablas son párrafos de barras. Es la queja más común sobre Python-Markdown y no es un fallo: las tablas nunca estuvieron en el Markdown original ni en CommonMark, así que una implementación que las mantiene detrás de una bandera de extensión está siendo precisa en vez de difícil.

**¿Para quién es?** Para proyectos de Python, usuarios de MkDocs, y para cualquiera cuya imagen de CI ya tenga Python y prefiera no añadir un segundo runtime por una sola conversión.

### Go y goldmark — el mejor binario para entregar a un runner

goldmark es un analizador de Markdown en Go, conforme con CommonMark 0.31.2, y el renderizador que usa Hugo en su configuración por defecto (comprobado en github.com/yuin/goldmark y gohugo.io, 8 de septiembre de 2026). Solo es biblioteca: no hay un comando `goldmark` que instalar. Lo que haces en su lugar es escribir unas veinte líneas y compilarlas, lo que te da un solo binario estático sin ningún runtime que instalar en ningún sitio.

| Pros | Cons |
| --- | --- |
| Compila a un solo binario estático, compilable en cruz desde cualquier lugar | Sin CLI en absoluto hasta que escribes uno |
| GFM en una sola extensión: tablas, tachado, linkify, listas de tareas | Mantienes tú el pequeño programa para siempre |
| Rápido, y ya en tu stack si usas Hugo | Menos extensiones ya hechas que el mundo de JavaScript |

**Precio:** gratis, con licencia MIT.

```go
// md2html.go
package main

import (
	"bytes"
	"fmt"
	"os"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
)

func main() {
	source, err := os.ReadFile(os.Args[1])
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	md := goldmark.New(goldmark.WithExtensions(extension.GFM))

	var out bytes.Buffer
	if err := md.Convert(source, &out); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	os.Stdout.Write(out.Bytes())
}
```

**Detalles técnicos y funciones**

- `extension.GFM` agrupa tablas, tachado, linkify y listas de tareas; las notas al pie, las listas de definición y el tipógrafo son extensiones aparte que añades a la misma lista
- `go build` produce un solo archivo, y `GOOS` con `GOARCH` lo compila en cruz para el runner sin un contenedor
- Devolver una salida distinta de cero en caso de fallo es explícito aquí, lo cual es más fácil de acertar que en un shell

**¿Para quién es?** Para equipos de Go, usuarios de Hugo que quieren saber qué está renderizando su contenido, y cualquiera que prefiera comprometer un binario compilado antes que mantener un paso de instalación de paquetes en CI.

### `curl` y una API HTTP — mejor cuando no hay cadena de herramientas

A veces el resultado no es un archivo en disco en absoluto. Es una página que un compañero puede abrir, producida en una máquina sin Node, sin Python y sin permiso para instalar nada.

| Pros | Cons |
| --- | --- |
| Nada que instalar más allá de `curl` | Necesita la red, así que no puede ser tu compilación sin conexión |
| El resultado puede ser un enlace en vivo en vez de un archivo para adjuntar | Necesita un secreto en el entorno |
| El comportamiento de conversión no puede desviarse con una instalación local | Se aplican límites de tasa y de tamaño |

**Precio:** gratis, incluida la API con una cuenta gratuita.

TransformPipe expone una API en `/api/v1` con claves revocables. Envía el Markdown como cuerpo:

```bash
curl -fsS \
  -H "Authorization: Bearer $TP_API_KEY" \
  -H "Content-Type: text/markdown" \
  --data-binary @README.md \
  "https://transformpipe.com/api/v1/documents?name=README.md&share=link"
```

**Detalles técnicos y funciones**

- La respuesta es JSON con el id del documento y, gracias a `?share=link`, una URL de solo lectura que ya está en vivo
- `GET /api/v1/documents/:id.html` también devuelve el archivo HTML, si quieres eso en disco
- Los límites están publicados en vez de adivinados: 10 MB para un archivo que convertir, 4 MB para guardar uno en una cuenta, 100 MB y 500 documentos por cuenta, y 60 peticiones por minuto contadas por clave
- `-f` es imprescindible. Sin ella `curl` sale con código cero ante un 401 o un 429 y escribe el cuerpo del error en tu archivo de salida
- `-sS` mantiene el medidor de progreso fuera de tus registros pero deja los errores reales en stderr
- `--retry 3 --retry-connrefused` cubre el fallo de red transitorio que de otro modo rompería una compilación al mes sin ningún motivo

Cuarenta archivos superan fácilmente las 60 peticiones por minuto. Miles necesitan una espera entre llamadas, o un solo documento fusionado en su lugar — y [fusionar es un problema pequeño por sí mismo](/blog/merging-many-markdown-files), con niveles de encabezado y colisiones de anclas que pensar primero.

**¿Para quién es?** Para pasos de compilación que quieren un enlace compartible al final, y para cualquier entorno donde instalar un conversor esté prohibido o no merezca el minuto que cuesta por ejecución.

### Un CLI sin dependencias — mejor para un paso de CI que debe mantenerse pequeño

La otra forma de la misma idea es un CLI que envuelve la API, escrito para que instalarlo no instale nada más. El `tp` de TransformPipe es un solo archivo de Node sin dependencias, a propósito: una herramienta que la gente ejecuta en CI no debería arrastrar un árbol de paquetes detrás.

| Pros | Cons |
| --- | --- |
| Sin dependencias transitivas que auditar, fijar o cachear | Sigue siendo una llamada de red y un secreto |
| Lee una clave de `tp login`, `TP_API_KEY` o `--key` | Necesita Node presente, aunque nada más |
| `--json` en cualquier comando, así que un script puede leer el resultado | Publica un documento; no es un conversor de archivos local |

**Precio:** gratis.

**Detalles técnicos y funciones**

- `tp push README.md --share` convierte y publica, e imprime el enlace
- `tp push docs/*.md --merge --share` encadena varios archivos en un solo documento en vez de uno por archivo
- `tp list`, `tp rm <id>` y `tp usage` cubren el resto, y `--json` en cualquiera de ellos es para scripts
- `tp login` guarda la clave en `~/.config/tp/config.json` con permisos `0600`; en CI fijas `TP_API_KEY` en su lugar, porque un runner descarta su directorio de inicio
- Los fallos imprimen las propias palabras de la API y salen con código distinto de cero, así que `set -e` los atrapa sin ningún envoltorio de tu parte

**¿Para quién es?** Para cualquiera que meta la conversión en una tubería y quiera una línea en vez de una invocación de `curl` con cinco banderas. Para una pull request en concreto, una acción es menos trabajo todavía — [publicar Markdown desde GitHub Actions](/blog/publish-markdown-from-github-actions) quita la instalación del runner por completo.

## Dónde Pandoc deja de merecer la pena

Pandoc es la recomendación por defecto para convertir Markdown desde una terminal, y para la mayoría de lo que se le pide esa recomendación es correcta. Merece la pena dejar claros los cuatro sitios donde no lo es, porque ninguno aparece en una comparativa de funciones.

**La instalación es un coste por ejecución, no de una sola vez.** En tu portátil instalas Pandoc una vez y te olvidas. En CI lo instalas en cada ejecución, y lo que eso cuesta depende por completo de cómo: un gestor de paquetes de la distribución trayendo un paquete y sus dependencias, una instalación con Homebrew en un runner de macOS, la descarga de una imagen Docker, o un paquete restaurado desde la caché del runner. Solo las dos últimas son rápidas, y ambas son configuración extra que mantener. Compáralo con un paso en un trabajo que ya tiene Node, o un solo binario estático que comprometiste, o una llamada HTTP, y la aritmética a menudo va al revés para un trabajo cuyo resultado entero es un README convertido en una página. No te fíes de un número que te dé yo — cronometra tu propia tubería con la instalación y sin ella, dos veces cada una, y usa lo que medistes.

**No sanea.** Pandoc renderiza fielmente, lo que significa que el HTML crudo del origen llega al resultado. Para tu propia documentación eso es una función; así es como la gente incrusta un vídeo o un elemento `<details>`. Para un archivo que viene de un fork, un cliente o un rastreador de issues es un vector, y no hay una bandera `--sanitise` a la que recurrir. `--sandbox` protege la máquina que hace la conversión, no el navegador que abre el resultado. Son problemas distintos con respuestas distintas, y confundirlos es cómo un README no confiable termina renderizado con una etiqueta script intacta.

**Su Markdown no es el Markdown en el que se escribió tu archivo.** El lector por defecto de Pandoc es `markdown`, su propio dialecto extendido, no GFM ni CommonMark. Convierte un README de GitHub con el lector por defecto y obtendrás diferencias — en enlaces automáticos, en cómo se produce un salto de línea forzado, en si una URL suelta se convierte en enlace — que no son fallos y no son lo que pediste. `-f gfm` no es una optimización. Es una bandera de corrección, y omitirla es la forma más común en que una conversión de Pandoc sale sutilmente mal. Lo mismo aplica al revés: un documento escrito para Pandoc, con sus divs con valla y su sintaxis de citas, pierde esas construcciones en silencio cuando se encuentra con un analizador CommonMark estricto.

**Las plantillas son un lenguaje.** En el momento en que `--standalone` no queda del todo bien, estás escribiendo una plantilla de Pandoc, aprendiendo su sintaxis de variables y sus condicionales, y probándola renderizando documentos y mirándolos. Es un buen trato si estás produciendo cien documentos que deben verse todos igual. Es un mal trato frente a las veinte líneas de HTML del script de Node de arriba, si lo que realmente necesitabas era una hoja de estilos y una medida sensata. Sé honesto sobre cuál de las dos cosas estás haciendo antes de empezar, porque la vía de la plantilla es difícil de abandonar una vez que una compilación depende de ella.

Si algo de esto te suena, las herramientas más pequeñas de esta página no son un compromiso; son el alcance correcto. Y si quieres la vista más amplia, incluidas las opciones de navegador y biblioteca que nunca tocan una terminal, [la comparativa completa de conversores las cubre](/blog/best-markdown-to-html-converters).

## Las cinco cosas que se rompen en la terminal, no en el conversor

Cada fallo de abajo ha sido diagnosticado como un error del conversor por alguien, al menos una vez, y ninguno lo es.

### El escapado, y por qué el archivo con un espacio rompió la compilación

`for file in docs/*.md; do cmark-gfm $file > out.html; done` funciona hasta que alguien añade `release notes.md`. Entonces el shell divide la variable sin comillas por el espacio y le entrega al conversor dos nombres de archivo que no existen. Pon comillas en cada expansión, siempre:

```bash
cmark-gfm "$file" > "$output"
```

La misma regla se aplica dentro de `$(dirname "$file")` y `$(basename "$file" .md)`, que necesitan sus propias comillas internas además de las externas. Los nombres de archivo de un repositorio no son tus nombres de archivo: llegan con espacios, apóstrofos, símbolos «&», caracteres no ASCII y, en un mal día, un guion inicial que el conversor lee como una bandera. Un `--` a secas antes del nombre de archivo evita esto último.

Para cualquier cosa recursiva, salta el bucle sobre un glob y deja que `find` pase los nombres como datos:

```bash
find docs -name '*.md' -print0 | while IFS= read -r -d '' file; do
  cmark-gfm -e table "$file" > "${file%.md}.html"
done
```

`-print0` y `-d ''` usan NUL como separador, que es el único byte que un nombre de archivo no puede contener. `IFS=` evita que se recorte el espacio en blanco inicial y final del nombre. Es feo, y es la única versión correcta para cualquier nombre de archivo que te vayan a dar jamás.

En Windows el modo de fallo es distinto y más silencioso. Las reglas de comillas de PowerShell no son las del shell — las comillas simples son literales, las dobles interpolan `$` — y su redirección no siempre te da UTF-8; `Out-File` en Windows PowerShell 5.1 usa por defecto UTF-16 little-endian (comprobado en learn.microsoft.com, 8 de septiembre de 2026). Un archivo convertido y escrito en una codificación que el navegador no espera llega como galimatías que parece exactamente un fallo del conversor, así que escríbelo a propósito con `| Set-Content -Encoding utf8 out.html` y deja de adivinar.

### El glob de una carpeta, y el orden que nadie pidió

`docs/*.md` hace tres cosas que la gente no espera. No recorre subdirectorios, así que `docs/api/reference.md` se salta en silencio. Si nada coincide, bash le pasa al conversor la cadena literal `docs/*.md` como nombre de archivo, lo que produce un error confuso sobre un archivo con un asterisco en el nombre; `shopt -s nullglob` hace que un glob vacío se expanda a nada en vez de eso. Y ordena léxicamente, así que `10-api.md` va antes de `2-setup.md` siempre.

Eso último es meramente cosmético cuando conviertes archivo por archivo, y es un fallo real cuando concatenas antes de convertir. Rellena los números con ceros — `02-setup.md`, `10-api.md` — y el orden queda correcto gratis, en el shell y en cualquier otra herramienta que lea ese directorio después. Para la recursión, o `shopt -s globstar` y usa `docs/**/*.md`, o usa `find`, que no necesita ninguna opción de shell y se comporta igual en todos lados.

Si estás concatenando, `cat` no basta. `cat` a secas no deja una línea en blanco entre archivos, así que la última línea de uno se une con la primera del siguiente en un solo párrafo y un encabezado puede acabar pegado al texto de arriba:

```bash
awk 'FNR==1 && NR>1 {print ""} 1' docs/*.md > all.md
```

Una línea en blanco insertada al principio de cada archivo salvo el primero. Esa es toda la solución, y merece conocerse porque el síntoma — un encabezado que falta en medio de un documento largo — no se parece en nada a su causa.

### Mantener el resultado junto al origen, sin aplanar el árbol

`basename` es la herramienta equivocada para un directorio de directorios, y falla de la peor manera posible. `docs/api/index.md` y `docs/guide/index.md` se convierten ambos en `index.html`, uno sobrescribe al otro en silencio, y la compilación termina con éxito con una página que falta. Nada avisa, y el archivo que sobrevive es el que el glob alcanzó al final.

Usa expansión de parámetros, que conserva la ruta:

```bash
#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob globstar

for file in docs/**/*.md; do
  output="build/${file#docs/}"      # strip the leading docs/
  output="${output%.md}.html"       # swap the extension
  mkdir -p "$(dirname "$output")"   # the tree does not exist yet
  cmark-gfm -e table -e strikethrough "$file" > "$output"
done
```

`${file%.md}.html` cambia la extensión sin tocar ningún nombre de directorio. `${file#docs/}` quita la raíz de origen, así que el árbol de resultado refleja el árbol de entrada en vez de anidarse dentro de una copia de él. `mkdir -p "$(dirname "$output")"` es la línea que todo el mundo olvida, y su ausencia es una redirección que falla contra un directorio que no existe — lo cual al menos falla ruidosamente.

Una cosa más sobre las rutas de salida. Los enlaces relativos entre tus archivos Markdown son relativos al archivo, así que un enlace a `../guide/index.md` solo sobrevive si el árbol de resultado tiene la misma forma que el árbol de entrada, y solo si reescribes también la extensión `.md` en el destino del enlace. Aplana el árbol y todos los enlaces internos se rompen de golpe, de una forma que ninguna bandera de conversor puede reparar después.

### Códigos de salida, y la tubería que mintió

El comportamiento por defecto de un script de shell es seguir después de un fallo y luego reportar éxito. Una línea arregla la mayor parte:

```bash
#!/usr/bin/env bash
set -euo pipefail
```

`-e` detiene la ejecución en el primer comando que falla. `-u` convierte una variable sin definir en un error en vez de una cadena vacía, que es lo que te salva de `rm -rf "$BUILD_DIR/"` el día en que `BUILD_DIR` nunca se definió. `-o pipefail` es la que importa aquí, porque el estado de salida de una tubería es el del último comando por defecto:

```bash
cmark-gfm README.md | tee build/README.html   # reports what tee did
```

El conversor puede morir en la primera línea y `tee` seguirá saliendo con código cero, así que el trabajo queda en verde y el archivo queda vacío. Con `pipefail` la tubería falla. Mejor todavía, no canalices en absoluto: una simple redirección conserva el propio estado del conversor, y es la versión a la que recurrir por defecto.

Luego están las herramientas cuya idea de fallo es distinta de la tuya. `curl` sale con código cero ante un 404 o un 429 salvo que pases `-f`. Pandoc sale con código cero ante avisos salvo que pases `--fail-if-warnings`. `npx` sin `--yes` no falla en absoluto — espera una respuesta que nunca llegará. Y un script de Node que atrapa un error, lo registra y sigue con normalidad sale con código cero, así que fija `process.exitCode = 1` en el `catch` o el script le está mintiendo a tu CI.

Por último, comprueba si el archivo está vacío, porque varios de estos fallos producen uno en lugar de ninguno:

```bash
[ -s "$output" ] || { echo "empty output: $output" >&2; exit 1; }
```

### Hacerlo en CI, donde la instalación es la parte cara

Todo lo anterior supone que el conversor ya está presente. En CI no lo está, y conseguirlo ahí suele ser lo más lento del trabajo.

Tres reglas lo cubren.

**Fija la versión, o el resultado cambia sin un commit.** `npx marked` usa una instalación local si hay una y, si no, trae lo más nuevo de esa mañana, así que el HTML que produce tu trabajo puede cambiar mientras tu repositorio no cambia. Instala desde un lockfile con `npm ci`. Fija una versión de apt o brew donde el empaquetado lo permita. Usa una etiqueta Docker en vez de `latest`. La reproducibilidad es la única razón para meter una conversión en CI, y un conversor sin fijar la tira por la borda mientras parece que funciona.

**Cachea lo que puedas, y prefiere lo que no necesita caché.** Un binario estático — comrak, o tu programa de Go compilado — es un solo archivo que restaurar y ninguna resolución de dependencias. Una imagen Docker es una sola descarga. Una instalación de gestor de paquetes es un grafo de dependencias resuelto de nuevo en cada ejecución. Ordena tus opciones en ese orden y la respuesta rara vez es la que sugiere la documentación.

**Mantén el secreto en el entorno y fuera del repositorio.** Si la conversión es una llamada a la API, la clave viene del almacén de secretos de CI hacia una variable de entorno, nunca de un archivo de configuración que alguien comprometió. `tp login` escribe en un directorio de inicio que el runner descarta, que es exactamente por lo que existe `TP_API_KEY`.

La lista de comprobación, entonces, para un paso de conversión que corre sin vigilancia:

- [ ] Versiones fijadas en un lockfile e instaladas con `npm ci`, no `npm install`
- [ ] `npx` con `--yes`, para que nunca se detenga a pedir permiso para traer un paquete
- [ ] `set -euo pipefail` al principio de cada paso de shell
- [ ] `curl` con `-f`; Pandoc con `--fail-if-warnings`
- [ ] Una salida distinta de cero tratada como trabajo fallido, no como un aviso en el registro
- [ ] El resultado comprobado por existencia y tamaño distinto de cero antes de que nada más adelante confíe en él
- [ ] La clave de la API leída de una variable de entorno, nunca de un archivo comprometido

## Cómo elegir

1. **Empieza por lo que ya está instalado.** Si Pandoc está en la máquina y en la imagen, úsalo y deja de leer, porque el coste de instalación que te preocupaba ya está pagado. Si el repositorio tiene Node y nada más, añadir un conversor de documentos de cuarenta formatos para satisfacer un trabajo de cinco líneas es una carga de mantenimiento que seguirás cargando dentro de dos años.
2. **Decide si el resultado tiene que abrirse por sí solo.** Si una persona va a hacer doble clic en el archivo, necesitas un documento completo con sus estilos en línea, lo que significa Pandoc con `--standalone --embed-resources`, o tu propia plantilla. Cualquier otra herramienta de aquí te da un fragmento, y un fragmento enviado por correo a un compañero se renderiza como texto sin estilo a todo el ancho de la ventana.
3. **Empareja el dialecto con el archivo antes de emparejar la herramienta con el dialecto.** Si los documentos tienen tablas o listas de tareas, el comando tiene que pedir GFM explícitamente: `-f gfm` para Pandoc, `-e table` y compañía para cmark-gfm, `--gfm` para comrak, `-x tables` para Python-Markdown. Convierte un archivo representativo y mira las tablas antes de comprometerte con el script, porque una tabla que no se analizó no lanza un error.
4. **Decide sobre el HTML crudo antes de convertir el archivo de otra persona.** Para tus propias notas no importa. Para un README de un fork, o el conversor suprime el HTML crudo por defecto — cmark-gfm y comrak lo hacen, y markdown-it lo escapa — o añades un sanitizador, o aceptas que lo que fuera que había en ese archivo se va a ejecutar en el navegador de quien abra el resultado.
5. **Cuenta los códigos de salida, no las funciones.** Elijas lo que elijas, su fallo tiene que llegar al estado del trabajo. Eso significa `pipefail`, una redirección en vez de una tubería, `-f` en `curl`, `--fail-if-warnings` en Pandoc, y una comprobación de tamaño en el resultado. Un paso de conversión que no puede fallar es un paso de conversión en el que dejarás de confiar tarde o temprano, y luego dejarás de leer.
6. **Cronometra la instalación una vez, con honestidad.** Ejecuta el trabajo con la instalación del conversor y otra vez con ella en caché o eliminada. Si la instalación domina, sustitúyela por un binario estático, una imagen, o una llamada a una API, y pon los números medidos en la pull request para que la próxima persona no tenga que discutirlo de nuevo desde cero.

## Conclusión

Elige la forma más pequeña que responda al problema, y luego gasta tu cuidado en el shell en vez de en el analizador. Para HTML en disco que tiene que verse terminado, Pandoc con `-f gfm -s --embed-resources` es una línea y es la línea correcta; para HTML en disco en un repositorio que ya tiene Node, escribe el script de cinco líneas con su propia plantilla y quédate con la envoltura. Para una carpeta, pon comillas en tus expansiones, conserva el árbol, y fija `-euo pipefail` para que el trabajo diga la verdad sobre lo que pasó. Y para un enlace que alguien pueda abrir sin ninguna cadena de herramientas propia — nada que instalar, nada que fijar, nada que cachear — una sola petición lo consigue — una vez que hayas decidido [cómo debería verse esa petición, y qué le debe una API de conversión a un script cuando el archivo está roto](/blog/converting-documents-with-an-api) — y la misma conversión corre [en el navegador en TransformPipe](/) gratis, sin que el archivo salga nunca de tu máquina cuando no has iniciado sesión.

## Preguntas frecuentes

### ¿Cuál es el conversor de Markdown por línea de comandos más sencillo de instalar?

comrak, si cuentas descargar un binario estático como instalar algo, porque no hay nada más que resolver y nada se queda en la máquina después. Si Node ya está presente, `npx --yes marked` o `npx --yes markdown-it` no instalan nada permanente en absoluto. Pandoc es el más capaz y el más grande, y solo se gana su tamaño cuando necesitas formatos más allá de HTML o control exacto de la envoltura.

### ¿Cómo convierto una carpeta entera de archivos Markdown a la vez?

Deja que el shell haga el bucle — ninguna de estas herramientas necesita un modo de lote. Usa `find … -print0` canalizado a un bucle `while IFS= read -r -d ''` para que sobrevivan los nombres de archivo incómodos, construye la ruta de salida con `${file%.md}.html` para conservar el árbol de directorios, y haz `mkdir -p` del destino antes de redirigir hacia él. Pon `set -euo pipefail` al principio, o un fallo a mitad de camino seguirá reportando éxito.

### ¿Por qué mi HTML convertido no tiene estilo?

Porque la herramienta te entregó un fragmento, que es lo que la mayoría de estas están diseñadas para hacer. cmark-gfm, comrak, marked, markdown-it y `python -m markdown` emiten todos contenido de cuerpo sin doctype, sin head y sin estilos, y un navegador lo renderiza en su fuente por defecto a todo el ancho de la ventana. O usa `--standalone --embed-resources` de Pandoc, o escribe la envoltura una vez en un script y reúsala en todos lados.

### ¿Estos conversores sanean el HTML?

Algunos lo hacen y otros deliberadamente no, y necesitas saber cuál tienes antes de convertir un archivo de fuera. cmark-gfm y comrak suprimen el HTML crudo salvo que pases `--unsafe`; markdown-it lo escapa salvo que actives su opción `html`; marked lo deja pasar y documenta que sanear no es su trabajo; Pandoc también lo deja pasar. El `--sandbox` de Pandoc protege la máquina que convierte, no el navegador del lector.

### ¿Por qué mi conversión tiene éxito en CI pero no produce nada?

Casi siempre una tubería que escondió el fallo, o un conversor que trata un fallo como un aviso. `cmark-gfm file.md | tee out.html` reporta el estado de salida de `tee`, así que un conversor muerto se lee como éxito — usa `set -o pipefail`, o redirige en vez de canalizar. Luego añade `-f` a `curl` y `--fail-if-warnings` a Pandoc, y prueba el resultado con `[ -s "$output" ]` antes de que nada más adelante dependa de él.

### ¿Es Pandoc demasiado lento para CI?

La conversión de Pandoc es rápida; lo que cuesta es la instalación, y te cuesta en cada ejecución en vez de una sola vez. Cuánto depende por completo del método — una descarga de imagen Docker o una caché restaurada es rápida, un gestor de paquetes resolviendo dependencias desde cero no lo es — así que mide tu propia tubería en vez de confiar en la cifra publicada por cualquiera. Si la instalación domina el trabajo, un solo binario estático o una llamada HTTP la elimina por completo.

### ¿Puedo convertir Markdown a HTML sin ninguna instalación local?

Sí, de dos maneras. Envía el archivo a una API HTTP con `curl` y recibe JSON, un archivo HTML, o un enlace en vivo; o, en una pull request, usa una GitHub Action para que el runner nunca instale un conversor en primer lugar. Ambas necesitan red y un secreto, así que mantén también un conversor local en la compilación si tiene que funcionar sin conexión.
