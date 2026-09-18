---
title: Cómo convertir muchos archivos Markdown a la vez, sin mentirle a tu compilación
description: Convertir una carpeta de Markdown de verdad — hasta dónde llega un glob, dónde cae la salida, xargs, y códigos de salida honestos para cientos de archivos
date: 2026-08-12
tag: Automatización
keywords: convertir varios archivos markdown a la vez, conversion por lotes de markdown, convertir carpeta de markdown a html, conversion masiva de markdown, xargs con markdown, makefile markdown a html, compilacion incremental de markdown, convertir markdown en ci
---

Convertir un archivo Markdown es un problema resuelto. Sueltas el archivo en una página, o escribes un comando, y tienes HTML. Convertir ciento cuarenta de ellos, repartidos en once carpetas, cuatro de las cuales nadie ha abierto desde la migración, es otro trabajo — y no es el mismo trabajo hecho ciento cuarenta veces.

El conversor casi nunca es la parte que se rompe. Lo que se rompe es el glob que se saltó una subcarpeta en silencio, los dos archivos `index.md` que se convirtieron en un solo `index.html`, la ejecución en paralelo cuyo registro son cuatro archivos entremezclados, la compilación que reportó éxito porque solo se comprobó la última conversión, y el trabajo de diecisiete minutos que reconvirtió cada archivo para cambiar un párrafo.

Todos esos fallos son silenciosos. Una tabla Markdown que no se analizó bien igual produce HTML. Un archivo al que el glob nunca llegó no produce nada en absoluto, y nada se ve exactamente como nada estuviera mal.

### Resumen rápido

Deja que el shell encuentre los archivos y que un script pequeño convierta un archivo, porque un bucle que puedes probar sobre una sola ruta es un bucle que puedes depurar. Usa `find … -print0 | sort -z` en vez de un glob simple `*.md`: un glob no recorre subcarpetas salvo que actives `globstar`, se salta los directorios con punto, le pasa el patrón literal a tu conversor cuando nada coincide, y va a chocar contra el límite de longitud de argumentos antes que un repositorio grande. Mapea la ruta de salida con expansión de parámetros para que el árbol conserve su forma — `basename` colapsa `docs/api/index.md` y `docs/guide/index.md` en el mismo archivo y la compilación sigue saliendo con código cero. Después decide dos cosas a propósito: si un fallo en el archivo cuarenta detiene la ejecución o se recoge y se reporta al final, y si de verdad quieres muchas páginas o un solo documento, porque fusionar es otro trabajo con otra respuesta.

## Convertir una carpeta es otro trabajo

Una conversión sola tiene una entrada, una salida y un resultado. Una conversión de carpeta tiene cinco decisiones que no existen para un solo archivo, y la respuesta por defecto a cada una está mal las veces suficientes como para importar.

**Qué archivos.** «Todo el Markdown del repositorio» parece inequívoco hasta que lo escribes. ¿Incluye `node_modules`? ¿La carpeta `.github`? ¿El `CHANGELOG.md` de la raíz? ¿Una copia empaquetada de la documentación de otra persona? ¿La carpeta enlazada por symlink que apunta a un checkout hermano? Cada una de esas es una respuesta real a una pregunta real y tu glob va a responderla por ti, sin decirlo.

**En qué orden.** El orden de los archivos no importa cuando cada uno se convierte en su propia página. Importa por completo cuando los archivos se convierten en un solo documento, e importa para la reproducibilidad de cualquier forma: una compilación cuyo registro lista los archivos en un orden distinto en cada ejecución es una compilación que no puedes comparar.

**A dónde va la salida.** Junto a la entrada, o en un árbol separado. Esta es la decisión que la gente lamenta, porque las dos funcionan en la primera ejecución y solo una sobrevive a un borrado, un renombrado o un enlace relativo.

**Qué pasa cuando uno falla.** Doscientos archivos, uno de ellos mal formado. Parar, o seguir y reportar. Las dos son defendibles. La opción por defecto —seguir y salir con código cero— no lo es.

**Con qué frecuencia.** Una carpeta que cambia una vez por semana no necesita reconvertirse cada noche, y una carpeta convertida dentro de un pull request probablemente solo debería convertir lo que la rama tocó.

Nota que nada de esto tiene que ver con el conversor. Cuál usar es una pregunta aparte con [su propia comparativa](/blog/best-markdown-to-html-converters), y cada enfoque de abajo funciona con cualquiera de ellos, mientras el comando acepte una ruta de entrada y una de salida y diga la verdad sobre su código de salida.

## Comparativa rápida: la chuleta

| Enfoque | Mejor para | Corre en paralelo | Puede fallar la compilación | Salta archivos sin cambios |
| --- | --- | --- | --- | --- |
| Un bucle `for` sobre un glob | Un script corto que alguien va a editar el año que viene | No | Sí, con `set -e`, en el primer archivo malo | No |
| `find … -exec … +` | Un árbol de profundidad desconocida y nombres incómodos | No | No de forma fiable — el código de salida no es el del comando | No |
| `find -print0 \| xargs -0 -P` | Cientos de archivos, y tiempo de reloj | Sí | Sí — sale 123 si algún archivo falló | No |
| GNU parallel | Trabajo en paralelo cuya salida tiene que seguir ordenada | Sí | Sí, con `--halt now,fail=1` | No |
| `make` con una regla de patrón | Una carpeta donde la mayoría de los archivos no cambió | Sí, con `make -j` | Sí, se detiene en la primera receta fallida | Sí, por fecha de modificación |
| Un script de Node o Python | Una salida que controlas tú, envoltorio incluido | Sí, con un límite de concurrencia | Solo si fijas tú el código de salida | Solo si lo implementas tú |
| Una llamada de API o CLI por archivo | Un entorno de ejecución sin cadena de herramientas ni instalación | Sí, hasta el límite de peticiones | Sí, por llamada | No |
| Un generador de sitios estáticos | Navegación, búsqueda y enlaces entre documentos | Internamente | Sí | Normalmente, con su propia caché |

Todo esto es gratis. Las herramientas de shell ya están en la máquina; el resto lleva las licencias anotadas en cada sección de abajo.

## Todas las formas de correr una conversión sobre una carpeta

### Un bucle `for` sobre un glob — mejor para un script que alguien va a volver a leer

Lo más corto que funciona, y la versión a escribir primero, porque se puede leer en voz alta.

```bash
#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob globstar

for file in docs/**/*.md; do
  output="build/${file#docs/}"
  output="${output%.md}.html"
  mkdir -p "$(dirname "$output")"
  bin/one.sh "$file" "$output"
done
```

| A favor | En contra |
| --- | --- |
| Legible, y evidente lo que va a hacer | Secuencial: el tiempo de reloj es la suma de cada archivo |
| `set -e` convierte el primer fallo en lo último que pasa | `globstar` es una opción de bash, así que `sh script.sh` cambia el comportamiento |
| Ninguna dependencia más allá del shell | Se salta los directorios con punto salvo que también fijes `dotglob` |
| El escapado está bajo tu control, en un solo sitio | Un glob lo bastante grande para superar el límite de argumentos falla igual aquí |

**Precio:** gratis; bash tiene licencia GPL y ya está instalado.

**Detalles técnicos**

- `shopt -s globstar` hace que `**` cruce separadores de directorio; sin ella, `**` se comporta exactamente como `*` y tus subcarpetas se saltan en silencio
- `shopt -s nullglob` hace que una coincidencia vacía se expanda a nada, en vez de pasarle al conversor la cadena literal `docs/**/*.md` como nombre de archivo
- `${file#docs/}` quita la raíz de origen; `${output%.md}.html` cambia la extensión sin tocar los nombres de directorio
- Ejecuta el script con `bash script.sh`, nunca con `sh script.sh` — `shopt` no es portable y un `sh` de dash lo va a rechazar

**¿Para quién es?** Para repositorios con decenas de archivos, y para cualquiera cuyo primer requisito sea que la siguiente persona pueda cambiar el script sin leer un manual.

### `find … -exec … +` — mejor para un árbol de profundidad desconocida

`find` no necesita ninguna opción de shell para recorrer subcarpetas, se comporta igual en cualquier shell, y no le importa qué haya en los nombres de archivo.

```bash
find docs -type f -name '*.md' -exec bin/one.sh {} +
```

| A favor | En contra |
| --- | --- |
| Recorrido, filtrado y podado en una sola expresión | La pregunta del código de salida es genuinamente confusa |
| Pasa los nombres como argumentos, así que los espacios y las comillas sobreviven | `-printf` y otras primitivas útiles son solo de GNU |
| `+` agrupa argumentos, así que no supera el límite de longitud | Orden del directorio, no orden ordenado |
| `-prune` excluye un subárbol entero de forma barata | El script tiene que derivar él mismo la ruta de salida |

**Precio:** gratis; GNU findutils tiene licencia GPL, y macOS trae un `find` de BSD.

**Detalles técnicos**

- `-type f` excluye directorios que casualmente terminan en `.md`, que es más raro que un symlink a uno pero no tan raro como para ignorarlo
- `-exec cmd {} +` pasa tantas rutas por invocación como encajen; `-exec cmd {} \;` corre un proceso por archivo, que es más lento y más fácil de razonar
- Con `-exec … \;` un comando que falla no cambia en absoluto el código de salida de `find`, así que un trabajo montado así no puede reportar un fallo de conversión. GNU `find` documenta un código distinto de cero cuando un comando corrido con `+` falla, y las implementaciones difieren — que es la razón para trasladar la pregunta del código de salida a `xargs`, donde queda escrita
- `find docs -name node_modules -prune -o -type f -name '*.md' -print` es el modismo para excluir un subárbol; `-not -path '*/node_modules/*'` da el mismo resultado pero recorre todo el árbol igual
- `find` no sigue symlinks salvo que pases `-L`, y pasar `-L` en un árbol con un enlace a su propio padre va a repetirse hasta chocar con el límite de profundidad

**¿Para quién es?** Para cualquier árbol con más de un nivel, y para cualquier repositorio donde no controlas tú mismo los nombres de archivo.

### `find -print0 | xargs -0 -P` — mejor cuando el recuento llega a los cientos

La forma estándar de hacer que una conversión de carpeta termine en una fracción del tiempo, y el punto donde dejas de poder leer el registro de arriba a abajo.

```bash
find docs -type f -name '*.md' -print0 \
  | sort -z \
  | xargs -0 -P 8 -n 1 bin/one.sh
```

| A favor | En contra |
| --- | --- |
| Paralelismo real con una sola opción | La salida de trabajos concurrentes se entremezcla, línea a línea |
| Un código de salida agregado y documentado: 123 si algún archivo falló | `xargs` ejecuta directamente, así que no hay redirección ni globs dentro del comando |
| Separación por NUL, así que cualquier nombre de archivo legal sobrevive | Las garantías de orden desaparecen salvo que ordenes primero e imprimas después |
| `-n` controla el tamaño del lote, que importa con archivos pequeños | La lista de fallos hay que recogerla fuera de banda |

**Precio:** gratis, licencia GPL, parte de findutils.

**Detalles técnicos**

- `-print0` y `-0` usan NUL como separador, el único byte que un nombre de archivo no puede contener — un salto de línea en un nombre de archivo es legal y de otro modo dividiría una ruta en dos
- `sort -z` ordena registros separados por NUL; el orden propio de `find` es orden de directorio, que no está ordenado y no es estable entre máquinas. Añade `LC_ALL=C` si quieres el mismo orden en un runner que en tu portátil
- `xargs` sale con 123 si alguna invocación salió entre 1 y 125, 124 si alguna salió con 125, 125 si alguna murió por una señal, 126 si el comando no se pudo ejecutar y 127 si no se encontró. Esos cinco códigos son todo el protocolo de reporte de errores, así que haz que tu script salga con código distinto de cero y deja que el agregado hable
- `-P 0` corre tantos procesos como pueda; `-P "$(nproc)"` es la elección habitual en Linux, y macOS quiere `sysctl -n hw.ncpu` en su lugar
- `xargs` no corre un shell. `xargs -0 cmd > salida.html` redirige toda la ejecución a un solo archivo, no un archivo por entrada; si necesitas una redirección, ponla dentro del script
- `-n 1` arranca un proceso por archivo. Para mil documentos pequeños, el arranque del proceso domina el coste sobre la conversión misma, y un script que recorre `"$@"` invocado con `-n 20` es medible mejor — mide tu propio árbol en vez de confiar en una proporción

**¿Para quién es?** Para conjuntos de documentación en los cientos, y para cualquier compilación donde la conversión se ha vuelto el paso lento.

### GNU parallel — mejor cuando la salida en paralelo todavía tiene que quedar ordenada

`parallel` es `xargs` con la ergonomía ya puesta: salida ordenada, una política de fallo, una ejecución en seco, y una pantalla de progreso.

```bash
find docs -type f -name '*.md' -print0 \
  | parallel -0 -k --halt now,fail=1 bin/one.sh {}
```

| A favor | En contra |
| --- | --- |
| `-k` almacena cada trabajo y lo imprime en el orden de entrada | Otra instalación, y no viene incluida por defecto |
| `--halt now,fail=1` detiene la ejecución en el primer fallo | Su sintaxis de comillas y de sustitución es un lenguaje propio |
| `--dry-run` imprime los comandos sin ejecutarlos | Almacenar para mantener el orden cuesta memoria y disco |
| `--joblog` registra el estado y la duración de cada trabajo | Exagerado cuando nada lee la salida estándar |

**Precio:** gratis, licencia GPL.

**Detalles técnicos**

- `-k` (`--keep-order`) es la opción que la separa de `xargs`: los trabajos siguen corriendo en paralelo, la salida sigue siendo legible
- `--halt` acepta una política — parar ya, o cuando terminen los trabajos en curso, sobre un número o un porcentaje de fallos
- `--joblog ARCHIVO` es la respuesta honesta a «qué archivo falló»: una tabla con el estado de salida y la duración de cada trabajo, que puedes grepear después de la ejecución en vez de leer el registro
- `{.}` quita la extensión de la cadena de sustitución, `{//}` da el directorio — útil, y otro dialecto más que memorizar
- Imprime una petición de citarlo en trabajos académicos, que no es una restricción de licencia pero sí sorprende la primera vez que aparece en un registro de compilación

**¿Para quién es?** Para compilaciones donde la conversión imprime algo que lee una persona, y para cualquiera que quiera una tabla de estado por trabajo sin tener que escribir una.

### `make` con una regla de patrón — mejor cuando la mayoría de los archivos no ha cambiado

La única herramienta de esta lista diseñada exactamente para este problema: un conjunto de salidas derivadas de un conjunto de entradas, reconstruidas cuando la entrada es más nueva.

```make
MD  := $(shell find docs -type f -name '*.md')
OUT := $(patsubst docs/%.md,build/%.html,$(MD))

build/%.html: docs/%.md tools/wrapper.html
	@mkdir -p $(@D)
	bin/one.sh $< $@

.PHONY: all clean
all: $(OUT)

clean:
	rm -rf build
```

| A favor | En contra |
| --- | --- |
| Convierte solo lo que cambió, sin necesitar ninguna caché tuya | Las recetas hay que sangrarlas con tabulador, para siempre |
| `make -j8` paraleliza gratis, respetando las dependencias | Los nombres de archivo con espacios prácticamente no funcionan |
| Una plantilla cambiada invalida cada salida, correctamente | Las fechas de modificación están mal en un checkout recién clonado |
| `make clean` y `make un/archivo.html` vienen incluidos | La sintaxis no se parece a nada más en el repositorio |

**Precio:** gratis; GNU make tiene licencia GPL.

**Detalles técnicos**

- `tools/wrapper.html` a la derecha de los dos puntos es la parte que la gente se olvida de poner. Sin ella, editar la plantilla no cambia nada, porque cada salida sigue siendo más nueva que su propio Markdown
- `$(@D)` es el directorio de la salida, así que `mkdir -p $(@D)` crea el árbol a medida que avanza
- `$(shell find …)` se ejecuta cada vez que se invoca make, así que un archivo nuevo se recoge sin tocar el Makefile
- `make -j` sin número corre trabajos ilimitados, que en un árbol grande arranca cientos de procesos a la vez; dale un número
- Añadir el propio conversor como prerrequisito —un lockfile, un binario fijado, un archivo de versión— hace que una actualización reconstruya todo, que es lo que quieres y lo que nadie hace

**¿Para quién es?** Para repositorios donde el árbol de documentación es grande y mayormente estático, y donde una conversión completa tarda lo bastante como para que alguien lo haya notado.

### Un script de Node o Python — mejor cuando también quieres el envoltorio

En algún punto el shell deja de ser el sitio correcto: quieres que el `<title>` del documento de salida venga del frontmatter del archivo, o un índice, o un enlace reescrito de `.md` a `.html`. Eso es un programa, no una tubería.

```js
// convert-all.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import fg from 'fast-glob';
import pLimit from 'p-limit';

const files = await fg('**/*.md', { cwd: 'docs', dot: false, absolute: true });
const limit = pLimit(8);
const failures = [];

await Promise.all(
  files.map((file) =>
    limit(async () => {
      try {
        const output = resolve('build', relative(resolve('docs'), file)).replace(/\.md$/, '.html');
        await mkdir(dirname(output), { recursive: true });
        await writeFile(output, render(await readFile(file, 'utf8')));
      } catch (error) {
        failures.push(`${file}: ${error.message}`);
      }
    })
  )
);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
```

| A favor | En contra |
| --- | --- |
| La salida es un documento que diseñaste tú, no un fragmento | Es tuyo, con sus fallos incluidos |
| El frontmatter, los títulos y la reescritura de enlaces están todos a mano | Un árbol de dependencias que fijar y auditar |
| Los fallos se recogen en una sola lista en vez de una línea de registro | La concurrencia hay que acotarla tú |
| Corre igual en cualquier plataforma, que el shell no hace | Más lento de arrancar que un binario en C o Rust |

**Precio:** gratis; `fast-glob` y `p-limit` tienen licencia MIT.

**Detalles técnicos**

- `pLimit` no es opcional. `Promise.all` sobre tres mil archivos abre tres mil descriptores de archivo y el proceso muere con `EMFILE`, que se lee como un sistema de archivos corrupto y no lo es
- `process.exitCode = 1` en vez de `process.exit(1)`, así que las escrituras pendientes terminan antes de que el proceso salga
- `dot: false` es el valor por defecto en la mayoría de las bibliotecas de glob, lo que significa que `.github/CONTRIBUTING.md` es invisible hasta que dices lo contrario — la misma trampa que pone el shell, en otro sitio
- Recoger los fallos y reportarlos al final es una elección: convierte todo y aun así falla el trabajo. La alternativa, lanzar en el primer error, deja el árbol de salida a medio escribir

**¿Para quién es?** Para cualquier repositorio donde el HTML tenga que parecer terminado, y para cualquier conversión que necesite saber algo del documento en vez de solo de sus bytes.

### Una llamada de API o CLI por archivo — mejor cuando no hay nada instalado

Si el runner no tiene conversor y no le vas a dar uno, el bucle tiene la misma forma y el cuerpo es una llamada de red. La CLI sin dependencias de TransformPipe es un ejemplo; un `curl` de POST a cualquier API de conversión es la misma idea con más opciones.

```bash
find docs -type f -name '*.md' -print0 \
  | sort -z \
  | xargs -0 -P 4 -n 1 -I {} tp push {} --share --json
```

| A favor | En contra |
| --- | --- |
| Ningún conversor que instalar, fijar ni cachear | Necesita red, así que no puede ser tu compilación sin conexión |
| Cada archivo vuelve como un enlace que alguien puede abrir | Necesita un secreto en el entorno |
| El comportamiento de la conversión no puede desviarse con una instalación local | Los límites de tasa y de tamaño aplican por clave |
| La misma conversión en CI que en un portátil | Un documento por archivo se suma rápido contra el límite de la cuenta |

**Precio:** gratis; convertir y descargar no necesitan cuenta en absoluto, y una cuenta añade historial, compartir y la API dentro de los límites de abajo (comprobado en transformpipe.com, el 8 de septiembre de 2026).

**Detalles técnicos**

- Los límites publicados son los que hay que planificar: 10 MB para un archivo a convertir, 4 MB para un documento guardado en una cuenta, 100 MB y 500 documentos por cuenta, y 60 peticiones por minuto contadas por clave (comprobado en transformpipe.com/docs, el 8 de septiembre de 2026)
- Ese límite de tasa es la razón de `-P 4` y no `-P 32`. Ocho procesos en paralelo con una conexión rápida agotan las sesenta peticiones en bastante menos de un minuto y empiezan a acumular 429, y un 429 es un fallo que tu script tiene que tratar como tal
- `--retry 3 --retry-connrefused` en `curl`, o una pausa entre lotes, cubre el fallo pasajero que de otro modo rompería una compilación al mes
- Si estás mandando con `curl` en vez de una CLI, `-f` es imprescindible: sin ella `curl` sale con código cero ante un 401 o un 429 y escribe el cuerpo del error dentro de tu archivo de salida
- Cien archivos significan cien documentos y cien enlaces. Eso no suele ser lo que nadie quería, que es el tema de una sección posterior

**¿Para quién es?** Para runners cerrados, y para cadenas cuya salida es un conjunto de enlaces en vez de un conjunto de archivos. Para un pull request en particular, [una action hace lo mismo sin instalar nada en el runner](/blog/publish-markdown-from-github-actions).

### Un generador de sitios estáticos — la respuesta cuando «muchos archivos» significa «un sitio»

Hugo, Eleventy, MkDocs, Docusaurus y Jekyll convierten todos directorios enteros de Markdown a HTML, y ninguno de ellos es un conversor por lotes. Son sistemas de compilación, y la diferencia se nota en lo que te devuelven.

| A favor | En contra |
| --- | --- |
| Navegación, búsqueda, enlaces cruzados y una página índice | Un archivo de configuración, un tema y un paso de compilación que mantener |
| Sus propias compilaciones incrementales y modos de vigilancia | La salida es un sitio, no un conjunto de documentos que puedas mandar por correo |
| Comprobación de enlaces y taxonomía sobre el conjunto entero | Sobrecarga enorme para cuarenta archivos que nadie navega |
| El despliegue es un problema resuelto en todos ellos | El tema decide cómo se ven tus páginas |

**Precio:** gratis, todos de código abierto.

**¿Para quién es?** Para quien publica documentos que se enlazan entre sí y necesitan encontrarse. Si tu lector llega con una URL que le diste y se va después de una página, no necesitas un generador.

## Las seis cosas que se rompen en una carpeta y no en un archivo

Cada fallo de abajo ha sido diagnosticado por alguien como un bug del conversor. Ninguno lo es.

### Hasta dónde llega un glob, y qué se le queda por fuera

`docs/*.md` no recorre subcarpetas. Este es el bug de conversión por lotes más común, y es invisible: el trabajo convierte los nueve archivos del nivel superior del árbol, sale con código cero, y los cuarenta de las subcarpetas simplemente no se mencionan. Nada avisa, porque nada sabe qué querías decir.

Bash necesita `shopt -s globstar` antes de que `**` cruce un separador de directorio; sin ella, `docs/**/*.md` es exactamente `docs/*/*.md` — un nivel hacia abajo, ni más ni menos. zsh tiene `**` recursivo sin ninguna opción, que es por lo que una línea copiada del historial de zsh de un compañero se comporta distinto en tu script de bash y ninguno de los dos ve por qué.

Luego están los archivos que un glob no va a coincidir jamás por principio:

| Qué se salta | Por qué | La solución |
| --- | --- | --- |
| `.github/CONTRIBUTING.md` | Los globs no coinciden con un punto inicial | `shopt -s dotglob`, o nombra la ruta |
| `docs/api/reference.md` | `*` no cruza `/` | `globstar` y `**`, o `find` |
| `README.MD` | Coincidencia sensible a mayúsculas en Linux, no en macOS | `find … -iname '*.md'` |
| `notas.markdown` | Una extensión distinta es un patrón distinto | `-name '*.md' -o -name '*.markdown'` |
| Todo, cuando nada coincide | Bash pasa el patrón tal cual, como literal | `shopt -s nullglob` o `failglob` |
| Nada en absoluto, dentro de `node_modules` | El glob fue demasiado generoso | `-prune`, antes de que el recorrido llegue ahí |

La última fila es el fallo contrario y es peor de lo que parece. Un `**/*.md` en la raíz del repositorio llega a cada README empaquetado de cada paquete instalado, y una conversión por lotes que empieza a producir HTML del registro de cambios de una dependencia es una que van a borrar en silencio dentro de una semana.

También hay un límite duro. Cada ruta a la que se expande un glob se convierte en un argumento, y el tamaño total de la lista de argumentos está limitado por el núcleo — `getconf ARG_MAX` imprime el número. Un repositorio lo bastante grande para superarlo falla con `Argument list too long`, que es un mensaje de error real y suena como un bug de tu script. `find … -exec … +` y `xargs` agrupan argumentos para quedarse por debajo del límite, y ninguno de los dos expande nada dentro del shell, que es por lo que cada ejemplo de arriba usa tubería en lugar de glob una vez que el recuento es desconocido.

Los symlinks merecen una frase de reflexión deliberada en vez de una respuesta por defecto. Si el `**` de un shell desciende a través de una carpeta enlazada por symlink ha variado entre versiones y difiere entre shells, así que si tu árbol contiene enlaces —un `docs/shared` que apunta a un checkout hermano es una disposición habitual— usa `find` y decide explícitamente, con `-L` o sin ella. Adivinar significa que el mismo repositorio convierte un conjunto distinto de archivos en dos máquinas.

### El orden en que llegan los archivos

`find` devuelve las entradas en orden de directorio. El orden de directorio es lo que sea que devuelva el sistema de archivos, no está ordenado, y no es el mismo en dos máquinas con los mismos archivos. Para una conversión donde cada archivo se convierte en su propia página, eso no hace daño. Deja de ser inofensivo en tres sitios.

Los registros dejan de poder diferenciarse. Cuando la lista de archivos de una compilación sale en un orden distinto cada vez, no puedes comparar dos ejecuciones para ver qué cambió, y lo primero que quieres cuando un trabajo nocturno se rompe es exactamente esa comparación.

La planificación en paralelo deja de ser reproducible. Con ocho procesos y sin ordenar, qué archivos comparten un proceso cambia entre ejecuciones, y también cambia cuál choca con el límite de tasa.

Y fusionar deja de ser solo desordenado y pasa a ser incorrecto. En el momento en que varios archivos se convierten en un documento, el orden es contenido. Incluso ordenado, `10-api.md` va antes que `2-setup.md`, porque un orden léxico no es un orden numérico. Rellena los números con ceros —`02-setup.md`, `10-api.md`— y cualquier herramienta que lea esa carpeta obtiene el orden correcto gratis.

```bash
find docs -type f -name '*.md' -print0 | LC_ALL=C sort -z
```

`LC_ALL=C` importa más de lo que parece. El orden de clasificación depende del idioma configurado, así que un nombre con una tilde o un guion bajo inicial puede ordenarse de forma distinta en un runner que en tu portátil, y todo el sentido de fijar el orden era evitar justo eso.

### Junto a la entrada, o en su propio árbol

Hay dos respuestas y no son equivalentes.

| | Salida junto a la entrada | Salida en un árbol separado |
| --- | --- | --- |
| Enlaces relativos entre documentos | Siguen funcionando sin cambios | Funcionan solo si se conserva la forma del árbol |
| Imágenes con rutas relativas | Se resuelven como antes | Necesitan copiarse o incrustarse |
| Limpieza | Borrar archivos que coincidan con un patrón, con cuidado | `rm -rf build` |
| Un `.md` borrado | Deja un `.html` huérfano, para siempre | Desaparece en la siguiente compilación limpia |
| Control de versiones | Entradas de `.gitignore` que pelean con los archivos de origen | Un solo directorio ignorado |
| Revisar el cambio | HTML generado en cada diff | Nada generado en el diff |
| Desplegar | Envía el repositorio entero, o fíltralo | Apunta el hosting a un solo directorio |

Junto a la entrada gana en enlaces e imágenes, y pierde en todo lo demás. La fila del huérfano es la que decide para la mayoría de la gente: nada en un esquema junto a la entrada nota que `docs/old-api.md` se borró, así que `docs/old-api.html` se queda en disco, se sube al control de versiones, se despliega, y sigue sirviéndose a alguien un año después. Un árbol separado que se borra y se reconstruye no puede tener ese problema, porque la respuesta a «qué salidas están obsoletas» es «todas, cada vez».

Si usas un árbol separado, conserva su forma, y usa expansión de parámetros en vez de `basename` para hacerlo. `basename` es la herramienta equivocada aquí y falla de la peor forma posible: `docs/api/index.md` y `docs/guide/index.md` se convierten los dos en `index.html`, el segundo sobreescribe al primero en silencio, la compilación sale con código cero, y cuál página sobrevive depende del orden en que llegaron los archivos — que, según la sección anterior, no está fijado.

La reescritura de enlaces es la parte que no tiene solución de shell. Un enlace a `../guide/index.md` en tu Markdown sobrevive a la conversión solo si el árbol de salida refleja el árbol de entrada y el `.md` del destino se reescribe a `.html`. Los conversores no hacen eso por defecto; la mayoría deja el enlace exactamente como está escrito, apuntando a un archivo que ya no está al lado de la página. Eso es un programa, no una tubería — y [lo que se rompe cuando un documento se mueve](/blog/images-and-links-that-still-work) se aplica igual a cada ruta de imagen dentro de la carpeta.

### El paralelismo, y el orden que sacrificas

Convertir es poco trabajo por archivo y un arranque de proceso por archivo. Eso lo acerca al ideal de una carga de trabajo paralela, y la aceleración de `-P` es real. Lo que sacrificas a cambio es cada garantía de orden que tenías.

La salida estándar se entremezcla. No por trabajo — por escritura. Dos conversores que imprimen una advertencia de tres líneas en el mismo momento producen seis líneas en un orden que ninguno de los dos elegió, y un registro así no se puede leer. Si los trabajos imprimen algo, usa `parallel -k`, o haz que cada trabajo escriba su propio archivo de registro y concaténalos después en orden ordenado.

El estado compartido no funciona como parece que debería. Cada invocación de `xargs` es un proceso separado, así que un contador incrementado dentro del bucle se incrementa en una subshell y desaparece. Añadir fallos a un archivo compartido funciona pero necesita cuidado con el entremezclado; la versión sin nada que pensar es un archivo pequeño por fallo dentro de un directorio, contado al final:

```bash
# en bin/one.sh
if ! convert "$1" "$2"; then
  mkdir -p build/.failed
  printf '%s\n' "$1" > "build/.failed/$(printf '%s' "$1" | tr / _)"
  exit 1
fi
```

Más procesos no es mejor de forma monótona. Pasado el punto en que las CPU están ocupadas, los procesos extra solo añaden contención y nada más; y si el cuerpo de tu bucle es una llamada de red, los procesos extra añaden 429. Cuatro peticiones concurrentes contra un límite de sesenta por minuto es cómodo. Treinta y dos es una prueba de límite de tasa con una compilación pegada encima.

El tamaño del lote es el parámetro que la gente olvida. `-n 1` arranca un proceso por archivo, y para documentos pequeños el arranque del proceso puede costar más que la propia conversión. Un script que recorre `"$@"` e se invoca con `-n 20` arranca una vigésima parte de los procesos. Si eso ayuda depende de tus archivos y tu conversor, así que mide los dos — y mídelos dos veces, porque la primera ejecución lee en frío y la segunda lee de la caché de página, que es una diferencia lo bastante grande como para invertir una conclusión.

### Los archivos que no han cambiado

Reconvertir ciento cuarenta archivos para arreglar una errata es defendible en un portátil e indefendible en un trabajo que corre en cada push. Hay tres formas de saltar los que no cambiaron, y fallan de forma distinta.

**La fecha de modificación.** Esto es lo que hace `make`, y dentro de una copia de trabajo es exactamente correcto: editas un archivo, su fecha de modificación se mueve, la regla se dispara. La trampa es que git no guarda fechas de modificación. Un clon nuevo o un checkout que no acertó la caché marca cada archivo con la hora del checkout, así que en un runner de CI cada archivo parece más nuevo que cada salida y el árbol entero se reconstruye. Las compilaciones incrementales basadas en fecha de modificación funcionan localmente y no hacen absolutamente nada en CI salvo que el directorio de salida también se restaure desde una caché, y las salidas restauradas entonces llevan sus propias marcas de tiempo — que es una segunda cosa que hay que hacer bien.

**El hash del contenido.** Más lento de calcular y correcto en todos los sitios, incluido un clon nuevo. Guarda el hash de la entrada junto a la salida y compara antes de convertir:

```bash
# en bin/one.sh — $1 es el .md, $2 es el .html
stamp="$2.sha256"
now="$(sha256sum "$1" | cut -d' ' -f1)"

if [ -f "$stamp" ] && [ "$(cat "$stamp")" = "$now" ] && [ -s "$2" ]; then
  exit 0
fi

convert "$1" "$2" && printf '%s\n' "$now" > "$stamp"
```

`sha256sum` es de GNU coreutils; macOS quiere `shasum -a 256`. La prueba `[ -s "$2" ]` está ahí porque un hash que coincide con un archivo de salida de cero bytes es una entrada de caché de una ejecución fallida, y una caché que recuerda fallos es peor que ninguna caché.

**Preguntarle a git qué cambió.** La más barata de las tres cuando la respuesta es pequeña, y la única que escala a un monorepo grande:

```bash
git diff --name-only --diff-filter=ACMR origin/main...HEAD -- '*.md'
```

`--diff-filter=ACMR` excluye borrados, así que un archivo eliminado no se convierte en una ruta que tu conversor intente abrir. Necesita historial — un clon superficial no tiene un commit base contra el que comparar — que es el trato: `fetch-depth: 0` cuesta tiempo de checkout en un repositorio con años de commits.

Sea cual sea la que elijas, una regla se aplica a las tres: la clave de la caché tiene que incluir todo de lo que depende la salida, no solo el Markdown. Cambia tu plantilla HTML, tu hoja de estilos, o la versión del conversor, y cada salida está obsoleta mientras cada entrada sigue sin cambios. Mete la plantilla dentro del stamp, añádela como prerrequisito en el Makefile, o acepta que la primera persona que edite la hoja de estilos se va a pasar una tarde preguntándose por qué la página no cambió.

### Los códigos de salida, y qué significa «funcionó» para doscientos archivos

Para un archivo, el éxito es inequívoco. Para doscientos, «funcionó» tiene tres respuestas posibles y tienes que elegir una antes de escribir el script.

**Parar en el primer fallo.** `set -euo pipefail` y un bucle simple. El árbol de salida queda a medio convertir, que está bien si es un directorio de compilación que borras de todos modos, y el registro termina en el archivo que se rompió — que es el diagnóstico más rápido posible.

**Convertir todo, fallar al final.** Más útil cuando alguien está esperando, porque una ejecución te informa de los seis archivos rotos en vez de solo el primero. Necesita un acumulador explícito, porque `set -e` de otro modo termina la ejecución:

```bash
failed=0
for file in docs/**/*.md; do
  bin/one.sh "$file" "$(output_for "$file")" || failed=$((failed + 1))
done

if [ "$failed" -gt 0 ]; then
  echo "$failed archivos fallaron" >&2
  exit 1
fi
```

Fíjate en el `|| failed=$(…)`. Sin él, `set -e` se dispara en el primer archivo malo y el acumulador nunca corre. Con él, el bucle no puede fallar — así que el `exit 1` explícito al final es lo único que hace honesto el trabajo, y borrar ese bloque por accidente produce una compilación que siempre pasa.

**Dejar que el ejecutor en paralelo agregue.** `xargs` te da 123 cuando algún trabajo falló, `parallel --joblog` te da una tabla de cuáles. Los dos están bien, y los dos dependen de que tu script por archivo de verdad salga con código distinto de cero, que es la parte que suele fallar: un conversor que escribe un error en la salida de error estándar y sale con código cero, un `curl` sin `-f`, o un script que atrapa una excepción, la registra y devuelve normalidad.

Vale la pena añadir tres comprobaciones sea cual sea la forma que elegiste:

- [ ] Cada salida existe y no está vacía — `[ -s "$salida" ]`, porque varios modos de fallo producen un archivo de cero bytes en vez de ninguno
- [ ] El número de salidas coincide con el número de entradas, impreso al final de la ejecución, porque un glob que se saltó una carpeta en silencio aparece aquí y en ningún otro sitio
- [ ] La ejecución entera va bajo `set -euo pipefail`, y cualquier conversor detrás de una tubería está redirigido en su lugar o cubierto por `pipefail`

Esa segunda es la aserción más barata y útil de toda la tubería. `find docs -name '*.md' | wc -l` contra `find build -name '*.html' | wc -l` es una línea, y detecta el fallo que ningún código de salida va a reportar nunca: el archivo que nunca se convirtió porque nada lo miró jamás.

## Hacerlo en CI sin convertir el árbol entero

El coste de instalar un conversor es [una pregunta que el artículo sobre la línea de comandos trata a fondo](/blog/markdown-to-html-from-the-command-line). La pregunta específica de los lotes es distinta: qué archivos, y cómo sale la salida.

Convierte el árbol entero en la rama por defecto, y solo los archivos cambiados en un pull request. La ejecución completa es tu garantía de que el árbol se puede convertir; la ejecución de la rama es la respuesta rápida, y necesita `fetch-depth: 0` para que el diff tenga una base contra la que comparar. Añade un filtro `paths` sobre `**.md` para que el trabajo ni siquiera corra en un pull request que solo tocó código.

Si las salidas merecen conservarse, súbelas como un artefacto en vez de subirlas al control de versiones. El HTML generado dentro de un pull request duplica el tiempo de cada revisión y convierte cada merge en un conflicto, y el artefacto caduca por su cuenta.

Si sí subes el HTML generado —algunos repositorios lo sirven directamente, y es una disposición legítima— añade la comprobación que lo hace seguro:

```bash
npm run build:docs
git diff --exit-code -- build/
```

`--exit-code` hace que una regeneración sin subir falle el trabajo. Sin ella, el HTML subido se separa del Markdown un merge apresurado a la vez, y nadie se entera hasta que un lector nota que la página contradice la fuente.

Cachea con una clave derivada de las entradas — GitHub Actions tiene `hashFiles('**/*.md')` justo para esto— y recuerda incluir tu plantilla y tu lockfile en la clave. Una caché con clave solo en el Markdown te va a servir HTML obsoleto después de un cambio de hoja de estilos, que es el resultado más confuso posible y el más difícil de atribuir.

Dos cosas más pequeñas. Reparte con una matriz solo cuando la conversión sea de verdad el paso lento: ocho trabajos en paralelo, cada uno con su propio checkout e instalación, a menudo tarda más en total que un solo trabajo con `xargs -P 8`. Y mantén explícito el shell del runner — GitHub Actions corre `bash -e {0}` para un bloque `run`, que no es lo mismo que tu shell de sesión, y las opciones de `shopt` no se conservan entre pasos.

## Un documento a partir de muchos, o muchos a partir de muchos

A mitad de construir un conversor de carpetas, casi todo el mundo descubre que quería otra cosa. «Convertir estos cuarenta archivos» se divide en dos requisitos que parecen iguales y no lo son.

| | Cuarenta páginas | Un documento |
| --- | --- | --- |
| Qué le mandas a alguien | Cuarenta enlaces, o un directorio | Un enlace, o un archivo |
| Navegación | Los enlaces que ya tenían los documentos | Un índice que generas tú |
| Niveles de encabezado | El `#` propio de cada archivo es el título de la página | Cada encabezado hay que bajarlo un nivel |
| Ids de ancla | Duplicados entre archivos son inofensivos | `#instalacion` en cuatro archivos colisiona |
| Orden | Cosmético | Contenido — el orden equivocado es un documento equivocado |
| Búsqueda | La búsqueda del propio sitio del lector, si existe | El buscar del navegador, que suele bastar |
| Tamaño | Cada página es pequeña | Un archivo, y un tope de tamaño que considerar |
| Contenido obsoleto | Una página por archivo de origen, se borra con él | Regenerar el conjunto entero o queda mal |

Si el lector va a leer el conjunto, quieres un documento, y la conversión es la mitad fácil. Concatenar Markdown no es `cat`: un `cat` simple pega la última línea de un archivo con la primera del siguiente, los encabezados hay que bajarlos de nivel para que el `#` del segundo archivo no se vuelva otro título de página, y los anclas hay que desambiguarlos. [Convertir una carpeta en un solo documento](/blog/merging-many-markdown-files) cubre el orden, los niveles de encabezado y las colisiones de anclas, y merece la pena leerlo antes de escribir el bucle y no después.

Hay un tope práctico sobre la respuesta fusionada: un documento lo bastante grande es un documento que nadie puede abrir. Los navegadores aguantan unos pocos megabytes de HTML y dejan de ser agradables bastante antes de cualquier límite que imponga un conversor — el conversor detrás de este sitio rechaza convertir un archivo de más de 10 MB y guardar un documento de más de 4 MB (comprobado en transformpipe.com/docs, el 8 de septiembre de 2026), que en Markdown es un libro bastante largo. Si tu salida fusionada se acerca a cualquiera de los dos números, la respuesta honesta no es un archivo más grande, es un conjunto de páginas con navegación, que es un generador.

## Dónde un bucle de carpeta deja de ser la respuesta

El bucle es la herramienta correcta para un conjunto acotado de documentos cuya única relación es vivir en la misma carpeta. Cuatro cosas rompen eso, y cada una tiene un coste que merece nombrarse antes de gastar una semana en un script de compilación.

**Documentos que se enlazan entre sí.** En el momento en que `docs/api.md` enlaza a `docs/guide.md`, un conversor sin más produce una página cuyos enlaces apuntan a archivos `.md` que ya no están ahí. Reescribirlos significa analizar el Markdown, resolver el destino, comprobar que existe, y reescribir la extensión — y comprobar que existe es donde descubres los cuatro enlaces que ya estaban rotos. Eso no es una opción de ningún conversor. Es un programa de verdad, y un generador de sitios ya lo tiene escrito.

**Un lector que llega sin una URL.** Una carpeta de páginas no tiene índice, ni búsqueda, ni navegación. Si alguien tiene que encontrar el documento correcto en vez de que se lo manden, estás construyendo un sitio, y hacerlo con un script de shell significa reimplementar un generador mal, un requisito a la vez. El coste de admitirlo pronto es un archivo de configuración. El coste de admitirlo tarde es un script de compilación que solo entiende una persona y que nadie va a tocar después de que se vaya.

**Archivos cuya salida no debería existir.** Borradores, plantillas, parciales, la carpeta `_includes`, la sección archivada que alguien guardó «por si acaso». Un glob no tiene ninguna opinión sobre nada de eso, así que todos se vuelven páginas, y algunas de esas páginas las va a encontrar un motor de búsqueda antes de que las encuentres tú. Excluirlas significa una lista de excepciones, en el script, mantenida a mano, que es exactamente el archivo de configuración que estabas evitando.

**Un árbol que cambia de forma.** El bucle codifica la forma del árbol en sus expresiones de ruta. Reorganiza los directorios y cada URL de salida cambia, cada enlace que alguien guardó se rompe, y no hay nada desde lo que redirigir porque nada registró cuáles eran las rutas viejas. Un conversor no puede arreglar esto y un generador solo ayuda un poco; la respuesta real es decidir las rutas de salida a propósito y mantenerlas estables aunque la fuente se mueva.

Nada de esto argumenta contra el bucle para el caso que le queda bien: un conjunto de documentos, convertido para gente a la que le van a dar los enlaces. Argumenta contra dejar que crezca hasta ser un sistema de publicación por accidente, que es la forma habitual en que un script de quince líneas se convierte en cuatrocientas que nadie puede borrar.

## Cómo elegir

1. **Cuenta los archivos, y vuelve a contarlos dentro de un año.** Por debajo de veinte, un bucle `for` con `set -euo pipefail` es la respuesta entera y cualquier cosa más es un hobby. Por encima de unos cuantos cientos, necesitas `find`, separación por NUL y `-P`, porque el límite de argumentos y el tiempo de reloj se vuelven reales en lugar de teóricos.
2. **Decide junto o separado antes de escribir una línea.** Un árbol separado te cuesta los enlaces relativos y las rutas de imagen y te da una compilación limpia, una salida borrable y un diff sin archivos generados dentro. Elegirlo después significa mover cada salida y arreglar cada enlace de golpe, bajo presión de tiempo.
3. **Escribe primero la conversión de un solo archivo como su propio script.** Si `bin/one.sh entrada.md salida.html` es correcto y sale con código distinto de cero cuando falla, cada enfoque de esta página es un cambio de una línea y puedes probar la parte difícil sin una carpeta. Si la lógica de conversión vive dentro del bucle, no puedes probarla en absoluto.
4. **Elige tu política de fallo explícitamente, y haz que el trabajo la demuestre.** Parar en el primer archivo malo, o convertir todo y salir con código distinto de cero al final — cualquiera de las dos está bien, y la opción por defecto de «seguir y reportar éxito» es lo que pone un árbol de documentación a medio construir en producción. Luego añade la aserción de conteo de salidas, porque ningún código de salida te va a avisar nunca de la carpeta a la que el glob nunca entró.
5. **Añade la conversión incremental solo cuando la ejecución completa sea genuinamente demasiado lenta, y fíjala sobre el contenido.** La fecha de modificación funciona en un portátil y no hace nada en silencio en CI, así que un stamp de hash es la versión que sobrevive a un clon nuevo. Incluye la plantilla y la versión del conversor en la clave, o una actualización te va a dejar sirviendo la salida de la versión anterior.
6. **Pregúntate si la respuesta es un documento.** Si el destinatario va a leer el conjunto entero, cuarenta enlaces es una entrega peor que una sola página, y el trabajo se muda del bucle a la fusión. Eso es un problema distinto con fallos distintos, y descubrirlo después significa escribir el script dos veces.

## Conclusión

Una conversión por lotes es una pequeña cantidad de conversión envuelta en una gran cantidad de contabilidad, y la contabilidad es donde viven los defectos: el glob que llegó a nueve archivos de cuarenta y nueve, la ruta de salida que colapsó dos páginas en una, la ejecución en paralelo cuyos fallos se fueron a una subshell, la caché que recordaba una hoja de estilos que nunca había visto. Escribe la conversión de un archivo como un script que sale con honestidad, condúcela con `find` y separación por NUL para que el conjunto de archivos se pueda conocer y sea estable, guarda la salida en un árbol que puedas borrar, y comprueba el conteo de salidas al final para que una carpeta ausente sea una compilación fallida y no una página que nadie nota que falta. Luego, cuando el conjunto resulte ser un documento en vez de cuarenta, habrás mantenido los dos trabajos separados — y cuando de verdad sea un solo archivo que tiene que parecer terminado, [convertir uno en el navegador](/) es gratis, no necesita instalación, y no sube nada mientras no hayas iniciado sesión.

## Preguntas frecuentes

### ¿Cómo convierto muchos archivos Markdown a la vez desde una terminal?

Deja que el shell enumere y que un script convierta un archivo: `find docs -type f -name '*.md' -print0 | sort -z | xargs -0 -P 8 -n 1 bin/one.sh`. Construye la ruta de salida dentro del script con `${file%.md}.html` para que el árbol de directorios conserve su forma, y haz `mkdir -p` del destino antes de escribir. Pon `set -euo pipefail` al principio del script y deja que `xargs` devuelva 123 si algún archivo falló.

### ¿Por qué mi conversión por lotes se saltó archivos en las subcarpetas?

Porque `docs/*.md` no recorre subcarpetas y `**` solo cruza separadores de directorio cuando la opción `globstar` de bash está activa. Sin `shopt -s globstar` el patrón `docs/**/*.md` coincide con exactamente un nivel hacia abajo, y cada archivo más profundo se salta sin ningún error. Usa `find` en su lugar, o activa la opción, y compara los conteos de entrada y salida al final de la ejecución.

### ¿Puedo convertir una carpeta de archivos Markdown en paralelo?

Sí — `xargs -0 -P 8`, GNU `parallel`, o `make -j8` lo hacen todos, y la aceleración es real porque la mayor parte del coste es el arranque del proceso y no el análisis. Lo que pierdes es el orden: los trabajos concurrentes entremezclan su salida línea a línea, y un contador incrementado dentro del bucle vive en una subshell y desaparece. Usa `parallel -k` si la salida tiene que quedar ordenada, y escribe un archivo pequeño por fallo en vez de añadir a una variable.

### ¿Cómo salto los archivos Markdown que no han cambiado?

`make` con una regla de patrón lo hace por fecha de modificación y no necesita ninguna caché tuya, pero git no guarda fechas de modificación, así que en un checkout nuevo de CI todo parece nuevo y el árbol entero se reconstruye. Un hash de contenido guardado junto a cada salida funciona en todos los sitios, incluido un clon nuevo. Sea cual sea el que uses, incluye la plantilla HTML y la versión del conversor en la clave, o un cambio de hoja de estilos va a dejar cada página obsoleta.

### ¿El HTML debería ir junto al Markdown o en una carpeta separada?

Un árbol separado, en casi todos los casos: lo puedes borrar, se mantiene fuera de tus diffs, y un archivo Markdown borrado no puede dejar una página huérfana atrás. La salida junto a la entrada solo es claramente mejor cuando los enlaces relativos y las rutas de imagen entre documentos tienen que seguir funcionando sin tocarlos. Si usas un árbol separado, refleja la estructura de directorios — `basename` va a colapsar dos archivos `index.md` en una sola salida y va a salir con código cero mientras lo hace.

### ¿Por qué mi compilación pasa cuando algunas conversiones fallaron?

Porque nada lo comprobó. Un bucle de shell sigue adelante después de un fallo y sale con el código del último comando, una tubería reporta la última etapa en vez del conversor, y varias herramientas tratan un error como una advertencia — `curl` sale con código cero ante un 429 sin `-f`. Usa `set -euo pipefail`, redirige en vez de usar tubería, y añade un `exit 1` explícito después de contar los fallos.

### ¿Es mejor convertir cuarenta archivos o fusionarlos en uno?

Depende por completo del lector. Cuarenta páginas convienen a alguien que llega con un enlace a una de ellas; un solo documento conviene a alguien que va a leer el conjunto, y es un enlace en vez de cuarenta. Fusionar no es concatenación, sin embargo — los niveles de encabezado hay que bajarlos y los anclas duplicados hay que desambiguarlos — así que trátalo como un trabajo aparte y no como una opción del bucle.
