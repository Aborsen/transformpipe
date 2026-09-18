---
title: Publicar el Markdown de una pull request con GitHub Actions
description: "Renderiza el Markdown de una pull request y comenta un enlace: el flujo de trabajo línea a línea, por qué un fork no recibe secretos, y qué cuesta cada alternativa"
updated: 2026-09-09
date: 2026-08-26
tag: Automatización
keywords: github action para markdown, renderizar markdown en github actions, vista previa de markdown en pull request, revisar documentación en pull request, convertir markdown en ci, seguridad de pull_request_target, comentario fijo en pull request, publicar markdown desde ci
---

Una pull request que reescribe un párrafo muestra una línea roja, una línea verde, y mucho salto de línea movido de sitio. Se ve qué palabras cambiaron. No se ve si la sección sigue leyéndose bien, si la tabla queda alineada, o si la lista numerada vuelve a empezar por uno a mitad de camino. Revisar prosa en un diff es adivinar.

Las personas cuya aprobación necesita en realidad el documento suelen ser las menos preparadas para leer un diff. Una abogada revisando unas condiciones, un responsable de soporte revisando un runbook, alguien de diseño revisando los textos de un flujo: abren la pestaña de archivos cambiados, se encuentran una pared de rojo y verde con el salto de línea movido, y responden que se ve bien. Eso no es una revisión, y nadie tiene la culpa.

El arreglo es pequeño. En cada pull request, renderiza el Markdown que cambió, publica cada archivo, y publica los enlaces en un comentario. Quien revisa hace clic y lee el documento. Nada cambia dentro del repositorio.

### Resumen rápido

Dispara con `pull_request` y un filtro `paths`, dale al job un grupo de concurrencia para que dos pushes con un minuto de diferencia no compitan entre sí, declara `contents: read` y `pull-requests: write` y nada más, y protege el paso de publicación con un `if` para que una pull request que no tocó ningún Markdown no haga absolutamente nada. Averiguar qué cambió significa comparar contra el commit base, lo que significa historial completo —`fetch-depth: 0`— o una action que le pregunte a la API de GitHub por la lista en su lugar. Publica un solo comentario y actualízalo en el mismo sitio en vez de añadir uno por cada push. Y conoce el único límite que no se puede configurar fuera antes de construir nada encima: una pull request desde un fork recibe un token de solo lectura y ningún secreto, a propósito, así que las vistas previas de un fork o no ocurren o ocurren sin tu clave — y `pull_request_target`, el disparador que levanta esa restricción, es el que termina comprometiendo repositorios.

## Comprueba lo que GitHub ya hace

Antes de añadir un flujo de trabajo, mira si te hace falta uno. Los commits y las pull requests que incluyen documentos de texto se pueden mostrar en una vista de fuente o en una vista renderizada, y el botón que cambia entre las dos está en la cabecera del archivo — así que la pestaña de archivos cambiados renderizará un archivo Markdown modificado en vez de comparar su texto (comprobado en docs.github.com, el 9 de septiembre de 2026). El interruptor del diff enriquecido, con el nombre que usa casi todo el mundo. Para un archivo pequeño, revisado por gente que ya tiene la pull request abierta, eso es suficiente.

Deja de ser suficiente cuando el cambio abarca varios archivos, cuando quien lee no tiene cuenta de GitHub —una abogada revisando unas condiciones, un cliente leyendo notas de versión—, o cuando quieres un enlace que todavía muestre lo que decía la rama el martes pasado.

## El flujo de trabajo, línea a línea

Copia esto en `.github/workflows/markdown-preview.yml`:

```yaml
name: Markdown preview

on:
  pull_request:
    paths:
      - '**.md'

concurrency:
  group: markdown-preview-${{ github.event.pull_request.number }}
  cancel-in-progress: true

permissions:
  contents: read
  pull-requests: write

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0

      - id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}

      - if: steps.publish.outputs.urls != ''
        run: echo "${{ steps.publish.outputs.urls }}"
```

Eso es todo. La clave es una clave de API de TransformPipe, guardada como secreto del repositorio; la action trae el conversor incluido, y `action.yml` lista sus entradas. Sin una lista de archivos, le pregunta a git qué archivos Markdown tocó la pull request, publica cada uno, y comenta una tabla con nombre de archivo, número de palabras y enlace. Los archivos que la rama borró se saltan, así que un documento eliminado no hace fallar la ejecución.

La mayor parte de ese archivo no es la conversión. Son las pocas líneas que mantienen el trabajo barato, acotado, ordenado y silencioso, y cada una de ellas responde a un fallo que alguien ya tuvo.

### El disparador, y qué hace `paths`

`on: pull_request` ejecuta el flujo de trabajo cuando se abre, se reabre o se hace push a una pull request. Esos tres tipos de actividad —`opened`, `synchronize` y `reopened`— son el conjunto por defecto, y todo lo demás que puede hacer una pull request, una etiqueta o una edición de título o una revisión, necesita nombrarse explícitamente con `types` (comprobado en docs.github.com, el 9 de septiembre de 2026). Enviar un commit a la rama es `synchronize`, que es el caso que importa aquí: cada ronda de ediciones consigue una vista previa nueva sin que nadie tenga que pedirla.

`paths: '**.md'` es la protección más barata que existe, porque se evalúa antes de que ocurra nada más. Una pull request que solo cambia código nunca encola el flujo de trabajo: sin runner, sin checkout, sin minuto facturado. `'**.md'` coincide a cualquier profundidad. `'docs/**.md'` lo acota a un árbol, que suele ser lo que quieres en un repositorio donde también hay Markdown en fixtures de pruebas, una caché de `node_modules`, o una copia de la documentación de otra persona.

Una consecuencia merece saberse antes de convertir esto en una comprobación de estado obligatoria. La propia redacción de GitHub es que un flujo de trabajo omitido por el filtro de rutas deja sus comprobaciones en estado pendiente, y una pull request que exige que esas comprobaciones se completen con éxito queda bloqueada para fusionarse (comprobado en docs.github.com, el 9 de septiembre de 2026) — justo en las pull requests que no tenían nada que previsualizar. O deja la comprobación como opcional, o mueve el filtro de `on:` a un `if` en el job, donde la ejecución ocurre, informa, y no hace nada.

### Un grupo de concurrencia, para que dos pushes no compitan

Dos commits enviados con un minuto de diferencia arrancan dos ejecuciones. Las dos hacen checkout, las dos publican, las dos comentan, y nada da error. El resultado sigue siendo incorrecto: las ejecuciones pueden terminar en desorden, así que el último comentario del hilo —el que lee quien revisa— puede ser el que describe el commit más antiguo.

`concurrency` arregla el orden negándose a tener dos. El grupo es cualquier cadena de texto, y usar como clave el número de la pull request da un carril por pull request en vez de un carril por repositorio, que haría que diez pull requests abiertas se pusieran en cola unas detrás de otras sin razón. Con `cancel-in-progress: true` una ejecución nueva cancela la que ya iba en curso; sin eso, la ejecución nueva espera. La propia descripción de GitHub del comportamiento por defecto es que un job o flujo de trabajo pendiente en el mismo grupo se cancela y el que se acaba de encolar ocupa su lugar (comprobado en docs.github.com, el 9 de septiembre de 2026).

Para una vista previa, cancelar es la elección correcta: la publicación a medio terminar de un commit que ya quedó reemplazado es un trabajo cuya salida nadie quiere. Si el repositorio tiene varios flujos de trabajo que podrían colisionar, mete también el nombre del flujo de trabajo en el grupo —`${{ github.workflow }}-${{ github.event.pull_request.number }}`— para que dos jobs sin relación no terminen compartiendo carril por accidente.

### `permissions`, y el 403 que se obtiene sin ellos

El bloque `permissions` acota el token con el que se ejecuta un flujo de trabajo. `contents: read` le permite al checkout leer el repositorio. Publicar un comentario es un ámbito distinto, y necesita `pull-requests: write`.

Déjalo fuera y el trabajo se hace y se desperdicia: los documentos se publican, la llamada al comentario vuelve con un 403, y la ejecución se pone en rojo en su último paso con los enlaces perdidos en el registro. Declara los dos ámbitos en vez de confiar en el valor por defecto, que varía según el repositorio y la configuración de la organización.

Declarar el bloque en absoluto es lo que lo convierte en mínimo privilegio, porque nombrar dos ámbitos pone todos los demás ámbitos a ninguno. Un paso que se añada más adelante a este job —una dependencia de una action, un script que alguien pega— no puede entonces hacer push de un commit, abrir un issue, publicar un paquete ni leer otro repositorio, sea lo que sea que intente. Si un job dentro de un flujo de trabajo más grande de verdad necesita más, dale a ese job su propio bloque `permissions` en vez de ampliar el del archivo.

### El secreto, y a qué puede llegar

`secrets.TP_API_KEY` es un secreto del repositorio que guarda una clave de API. La action la recibe como entrada y se la entrega al conversor como variable de entorno en vez de como argumento, lo que la mantiene fuera de la lista de procesos del runner y fuera de la línea de comandos que se refleja en el registro. GitHub redacta del registro los valores de secretos registrados, y su propia guía dice que cualquier cosa sensible que no sea un secreto de GitHub hay que enmascararla a mano con `::add-mask::` (comprobado en docs.github.com, el 9 de septiembre de 2026). La redacción es una red de seguridad sobre un error, no un sitio donde cometerlo: un paso que codifica un secreto, lo divide, o lo manda a algún lado anula la máscara por completo, y cualquier paso de este job puede hacerlo.

La propia clave llega a documentos, sus ajustes de compartición y una cifra de uso, y nada más —ni el inicio de sesión, ni la lista de claves— así que una clave filtrada puede publicar y borrar documentos pero no puede acuñar su propio reemplazo ni bloquear al propietario. Se muestra una sola vez y se guarda solo como un hash, lo que convierte la rotación en un orden fijo: acuñar, pegar en el secreto, revocar la antigua.

Si el repositorio tiene colaboradores a los que no le darías la clave en persona, ponla en un secreto de entorno y dale al job un `environment:`, así que usarla queda condicionado a la regla de protección que lleve ese entorno. Eso es una frontera real. Un secreto de repositorio normal no lo es: cualquier flujo de trabajo del repositorio puede leerlo, incluido uno añadido en una rama por cualquiera con permiso de escritura.

### La protección `if`, para que no pase nada cuando no cambió nada

El filtro `paths` detiene el flujo de trabajo cuando no cambió ningún Markdown en absoluto. La protección `if` cubre el caso un nivel más abajo, donde el flujo de trabajo corrió porque algo coincidió y el paso después de la publicación no tiene con qué trabajar.

La action gestiona su propio caso vacío con honestidad: si no recibe archivos, imprime `No Markdown to publish.`, pone `urls` como cadena vacía y `documents` como `[]`, y termina con éxito. Lo que no puede hacer es detener los pasos que escribas después de ella. `if: steps.publish.outputs.urls != ''` es toda la protección, y un paso saltado se ve en verde en vez de en rojo — lo cual importa más de lo que suena. Un flujo de trabajo que se pone en rojo por una razón que nadie puede resolver es un flujo de trabajo que la gente aprende a ignorar, y entonces se pone en rojo por una razón real y también se ignora.

La misma protección con una condición distinta es cómo se maneja un fork a propósito y no por accidente:

```yaml
      - if: github.event.pull_request.head.repo.fork == false
        id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
```

Esa línea necesita explicación, porque la restricción que hay detrás es la única cosa de este flujo de trabajo que no se puede configurar fuera.

## Averiguar qué cambió

Sin una entrada `files`, la action le pregunta a git, en una línea:

```bash
git diff --name-only --diff-filter=d "$BASE_SHA"...HEAD -- '*.md'
```

Cada parte de eso importa. `--name-only` pide rutas en vez de un parche. `--diff-filter=d` descarta las eliminaciones, así que un documento que la rama borró nunca llega a un conversor que fallaría con un archivo que no existe. El pathspec `'*.md'` filtra dentro de git en vez de después, lo que mantiene la lista corta en una pull request que también movió cuatrocientas imágenes. Y los tres puntos no son una errata: `A...B` compara desde la base común de los dos commits en vez de desde `A` mismo, así que los commits que llegaron a la rama base después de abrirse la pull request no aparecen como trabajo de esta rama.

`$BASE_SHA` viene de `github.event.pull_request.base.sha`, que la carga del evento trae gratis. Ese commit es toda la cuestión, y es la razón de la siguiente línea del flujo de trabajo.

### Por qué `fetch-depth: 0`

`actions/checkout` trae un solo commit por defecto — `fetch-depth` está documentado como el número de commits a traer, con un valor por defecto de `1` y `0` significando todo el historial de todas las ramas y etiquetas (comprobado en github.com, el 9 de septiembre de 2026). Eso es rápido, y suficiente para compilar código. No es suficiente para responder «qué cambió»: la action compara la base de la pull request contra su head, y en un clon superficial ese commit base falta, así que la comparación falla o no informa de nada.

`fetch-depth: 0` trae el historial completo, lo que cuesta tiempo real en un repositorio con años de commits. Si el checkout ya es el paso lento, nombra los archivos tú mismo y conserva el clon superficial:

```yaml
      - uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: docs/handbook/intro.md docs/handbook/style.md
          merge: true
          name: Handbook preview
```

`files` es una lista de rutas separadas por espacios, que se pasa tal cual está escrita: un patrón como `docs/*.md` llega literalmente y no coincide con nada, así que construye la lista en un paso anterior si necesitas uno — el mismo problema que [convertir una carpeta entera de archivos Markdown](/blog/batch-convert-markdown-files), donde enumerar con `find` y ordenar antes de pasar la lista es lo que mantiene el conjunto controlado. Una lista explícita no necesita historial, y pierde la parte que hace que esto valga la pena — trátala como el plan B, no como el predeterminado.

### La action a la que la gente recurre en su lugar

La mayoría de los flujos de trabajo no escriben ese diff por su cuenta. `tj-actions/changed-files` es la alternativa más usada: licencia MIT, y calcula la lista o bien desde la API REST de GitHub o bien desde el propio `diff` de git, que es por lo que funciona en una pull request con el `fetch-depth` por defecto de `1` y aun así quiere `fetch-depth: 0` o `2` en un evento `push`. Sus salidas vienen en varias formas —`all_changed_files`, `added_files`, `modified_files`, `deleted_files`— más `any_changed`, que es el booleano que quiere un `if` (comprobado en github.com, el 9 de septiembre de 2026).

```yaml
      - id: changed
        uses: tj-actions/changed-files@<commit-sha>
        with:
          files: '**.md'

      - if: steps.changed.outputs.any_changed == 'true'
        id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: ${{ steps.changed.outputs.all_changed_files }}
```

Dos cosas sobre ese fragmento. La versión es un SHA de commit a propósito: fija una action de un tercero a un SHA completo en vez de a una etiqueta, porque una etiqueta es un puntero móvil que la dueña de la action, o quien se haga cargo de esa cuenta, puede redirigir hacia código distinto — y tu flujo de trabajo lo traerá en la siguiente ejecución sin ningún diff para que lo leas. La segunda es el entrecomillado. Una lista de rutas interpolada dentro de un valor `with:` es una sola cadena de texto, así que un nombre de archivo con un espacio llega como dos archivos. Es una propiedad de cualquier lista separada por espacios, la entrada `files` de esta action incluida, en vez de un fallo de ninguna de las dos; si existen esos nombres en tu repositorio, escribe la lista en un archivo y léela de vuelta en lugar de pasarla por una shell.

## El problema del fork, y el disparador que lo levanta

Un límite conviene conocerlo de antemano. Un evento `pull_request` disparado desde un fork recibe ningún secreto y un token de solo lectura, así que una pull request de un fork no recibe vista previa — y una comprobación en rojo donde el paso de publicación se detuvo por falta de una clave. Eso es GitHub manteniendo tu clave de API alejada de código que no has leído — el valor por defecto correcto.

La redacción de GitHub no deja margen: con la excepción de `GITHUB_TOKEN`, los secretos no se le pasan al runner cuando un flujo de trabajo se dispara desde un repositorio bifurcado, y el propio `GITHUB_TOKEN` tiene permisos de solo lectura en las pull requests desde forks (comprobado en docs.github.com, el 9 de septiembre de 2026). Las dos mitades de este flujo de trabajo están por tanto muertas en un fork. El paso de publicación no tiene clave y falla en la API; el paso de comentario no tiene el ámbito de escritura y falla en el comentario. Declarar `pull-requests: write` en el archivo no cambia nada, porque el bloque es un techo y no una concesión.

### `pull_request_target`, y por qué así se comprometen repositorios

Busca una forma de evitar esto y la primera respuesta es siempre el mismo disparador. `pull_request_target` se dispara con los mismos eventos que `pull_request`, pero se ejecuta en el contexto de la rama predeterminada del repositorio base en vez de en el commit de fusión — así que el archivo del flujo de trabajo es el tuyo, el token puede escribir, y los secretos están ahí (comprobado en docs.github.com, el 9 de septiembre de 2026).

Eso suena a arreglo, y es una manera bien documentada de perder un repositorio. Que el archivo del flujo de trabajo sea el tuyo es la mitad segura. La mitad insegura llega en el momento en que el job toca el contenido propio de la pull request. Haz checkout del commit head, y todo lo que viene después de esa línea es código de un desconocido corriendo en un job que tiene tus secretos y un token de escritura: un script de compilación, un comando de pruebas, un hook de instalación de una dependencia, un objetivo de Makefile, un archivo de configuración de un linter, un hook de git incluido en la rama. El aviso de GitHub sobre el disparador nombra las consecuencias sin rodeos — envenenamiento de caché, y acceso no deseado a privilegios de escritura o a secretos (comprobado en docs.github.com, el 9 de septiembre de 2026).

Convertir un archivo Markdown parece inofensivo, y el peligro no está en la conversión. Está en todo lo que un job va creciendo alrededor: el checkout, el `npm ci` que alguien añade seis meses después para que funcione un paso de lint, el «simplemente ejecuta el script propio del proyecto» que en su momento parece obvio. La guía de seguridad de GitHub trata esto como un patrón con nombre, y la forma recomendada cuando de verdad necesitas trabajo con privilegios sobre contenido no fiable son dos flujos de trabajo: uno con `pull_request` que gestiona los archivos del colaborador sin secretos y sube el resultado como un artefacto, y luego uno con `workflow_run` con permisos que descarga el artefacto y hace la parte con privilegios (comprobado en securitylab.github.com, el 9 de septiembre de 2026).

### Qué hacer en su lugar

Esa separación es correcta, y para una vista previa de documentación es demasiada maquinaria: dos archivos de flujo de trabajo, un traspaso de artefacto, y una clase de error —hacer checkout del head en la mitad con privilegios— cuyo modo de fallo es tu clave en manos de otro. Dos opciones más sencillas cubren casi cualquier repositorio.

**Publicar al hacer push a la rama predeterminada.** Después de la fusión, el job corre en tu propia rama con tu propio token y tus propios secretos, y la pregunta del fork desaparece porque no hay ningún fork en el cuadro:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'docs/**.md'

permissions:
  contents: read

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 2

      - uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: docs/handbook.md
          share: link
```

Dos diferencias respecto a la versión para pull requests. `fetch-depth: 2` es suficiente, porque un push se compara contra el commit anterior en vez de contra una base de fusión. Y `files` se nombra explícitamente, porque un evento push no lleva ninguna pull request y por tanto ningún SHA base contra el que la action pueda comparar — sin una lista no encuentra nada y termina con éxito, que es un éxito silencioso en vez de un error. Lo que se pierde es la vista previa antes de la fusión; lo que se mantiene es una página publicada por cada versión que de verdad se lanzó, que para notas de versión y un manual es lo que la gente quería de todas formas.

**O aceptar que las pull requests de un fork no tienen vista previa.** Protege el paso con `if: github.event.pull_request.head.repo.fork == false` para que la ejecución se ponga en verde con un paso saltado en vez de en rojo con un 401, y dilo en la guía de contribución. Quien revisa una pull request de un fork sigue teniendo el interruptor del diff enriquecido, y quien mantiene el proyecto y necesita el tratamiento completo puede subir la rama al repositorio, donde el flujo de trabajo vuelve a tener clave.

Una costumbre más, sin relación con los forks y barata de hacer bien: nunca interpoles directamente en un script `run:` un valor que controle un colaborador —un título de pull request, un nombre de rama, un mensaje de commit. `${{ }}` sustituye el texto antes de que la shell lo vea siquiera, así que un título con un acento grave o `$( )` se convierte en un comando que corre con lo que sea que tenga ese job. Pon el valor en `env:` y referéncialo como `$VAR`, que la shell trata como datos.

## El comentario, y qué muestra su enlace

### Un comentario, reescrito en el mismo sitio

Tal como viene, la action publica un comentario nuevo cada vez que corre. En una rama con quince pushes en tres días, son quince comentarios, catorce de ellos apuntando a commits que ya nadie está revisando, con la discusión real enterrada en algún punto de en medio.

El arreglo es un comentario fijo: un solo comentario, reescrito en el mismo sitio. `marocchino/sticky-pull-request-comment` es la opción habitual —licencia MIT, con clave en una entrada `header` para que varios flujos de trabajo puedan ser dueños cada uno de su propio comentario sin pelearse por el mismo, y quiere el mismo `pull-requests: write` que este flujo de trabajo ya declara (comprobado en github.com, el 9 de septiembre de 2026). Apaga el comentario propio de la action y pásale la salida:

```yaml
      - id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          comment: false

      - if: steps.publish.outputs.urls != ''
        uses: marocchino/sticky-pull-request-comment@<commit-sha>
        with:
          header: markdown-preview
          message: |
            Rendered preview of the Markdown this pull request changes:

            ${{ steps.publish.outputs.urls }}
```

La contrapartida es real, y merece hacerse a propósito y no por defecto. Un comentario fijo sobrescribe su propio historial, así que el hilo deja de ser un registro de lo que decía la rama en cada ronda de revisión. Donde la revisión se extiende varios días y alguien quiera comprobar lo que aprobó el martes, la entrada `append` de la action —que solo acepta `true`— añade cada mensaje nuevo al anterior en vez de reemplazarlo (comprobado en github.com, el 9 de septiembre de 2026), así que los enlaces antiguos quedan debajo de los nuevos y el hilo sigue siendo un registro. Donde el comentario es una línea de estado y no un registro, reemplázalo y mantén la página tranquila.

Dónde va el enlace importa tanto como cuántos haya. Ponlo en el cuerpo del comentario, no solo en el resumen de una comprobación —quien tenga que hacer clic hasta Detalles para encontrar un enlace no lo va a encontrar— y dale a cada enlace un nombre, para que una pull request que toca cuatro documentos no presente cuatro URLs desnudas. El propio comentario de la action es una tabla de nombre de archivo, número de palabras y enlace, que es aproximadamente el mínimo que le permite a alguien decidir qué abrir primero.

### Un documento nuevo por cada push, no uno que se sobrescribe

La action publica un documento nuevo cada vez que corre. Sobrescribir una sola página sería más ordenado de mirar y peor de usar, porque una sobrescritura convierte cada enlace antiguo en una mentira. Alguien lee el comentario el lunes, sigue el enlace el jueves, y recibe el texto del jueves bajo la aprobación del lunes.

Un documento nuevo por cada push mantiene cada enlace clavado al commit que lo produjo, que es lo que hace que el comentario que se añade de arriba merezca su ruido extra: los enlaces clavados solo son útiles mientras algo los siga sosteniendo. El coste son documentos: cada push gasta uno contra el límite de 500 documentos por cuenta, y llegar a ese límite rechaza la escritura en vez de borrar nada en silencio. Limpia las vistas previas antiguas en bloque desde el historial, o con `tp rm` desde la [línea de comandos](/blog/markdown-to-html-from-the-command-line).

### Quién puede abrir el enlace

`share` decide quién puede abrir el resultado.

| Valor | Quién puede leerlo |
| --- | --- |
| `link` | Cualquiera con el enlace |
| `people` | Solo las direcciones que listes, después de iniciar sesión |
| `none` | Nadie salvo tú — el documento aterriza en tu historial |

Repositorio público, vista previa pública: `link` está bien. Para un manual privado, `people` es lo honesto, con una trampa: la action publica en ese modo sin ninguna lista de direcciones, así que el primer enlace no se abre para nadie hasta que nombres a los lectores —en el diálogo de compartición, o con `PUT /api/v1/documents/:id/share`. Revocar una compartición elimina el token, así que un enlace ya pegado en un comentario deja de funcionar. Pon `comment: false` para quedarte con la salida `urls` y ningún comentario en absoluto.

Este patrón le encaja a repositorios donde el Markdown es el entregable —[documentación que vive junto al código](/blog/documentation-that-lives-in-the-repo), [notas de versión escritas para quien las lee, no para un registro de commits](/blog/release-notes-from-markdown), RFC, runbooks. Si tu Markdown alimenta un sitio estático con su propio tema y navegación, una vista previa de despliegue de tu anfitrión lo renderiza como es debido y esto no hace falta.

## Las alternativas, y qué cuesta cada una

Una página alojada es una respuesta a la pregunta de dónde vive el documento renderizado. No es la única, y para algunos repositorios no es la correcta. Cuatro alternativas cubren lo que la gente hace de verdad, y cada una compra algo distinto.

| Dónde vive la página | Qué cuesta configurarla | Quién puede verla | Cuánto dura |
| --- | --- | --- | --- |
| Un artefacto de la ejecución (`actions/upload-artifact`) | un paso, sin clave, sin cuenta | cualquiera que pueda leer el repositorio, con sesión iniciada en GitHub — la URL de descarga exige inicio de sesión | 90 días por defecto, de 1 a 90 con `retention-days` |
| GitHub Pages (`actions/upload-pages-artifact` y luego `actions/deploy-pages`) | `pages: write` y `id-token: write`, un entorno `github-pages`, y un sitio que estés dispuesto a sobrescribir | internet, en un sitio de Pages público | hasta que el siguiente despliegue lo reemplace |
| El HTML convertido devuelto a la rama con un commit | `contents: write`, un commit de bot, y HTML generado en cada diff futuro | cualquiera que pueda leer el repositorio | para siempre, en el historial |
| Una página alojada desde una API o una action | una clave en un secreto, una cuenta, y los límites de esa cuenta | quien permita el modo de compartición, con cuenta de GitHub o sin ella | hasta que alguien la borre |
| Nada: el interruptor del diff enriquecido | ningún flujo de trabajo | cualquiera que pueda abrir la pull request | es una pestaña, no un enlace |

(Retención de artefactos, permisos de Pages y el requisito de descarga comprobados en github.com, el 9 de septiembre de 2026.)

**El artefacto es lo más barato y lo menos legible.** Un paso, sin clave, sin cuenta, y la salida se adjunta a la ejecución, donde no puede filtrarse. Luego alguien tiene que encontrar la ejecución, bajar hasta los artefactos, descargar un zip, descomprimirlo, y abrir un archivo HTML desde su propio disco — que es también el momento en que una página que trae su hoja de estilos desde un CDN deja de parecer nada, así que una exportación autónoma importa aquí más que en cualquier otro sitio. Y la URL de descarga exige un inicio de sesión en GitHub, lo cual descarta al lector para quien se hizo todo este ejercicio.

**GitHub Pages es la respuesta correcta cuando la salida es un sitio.** `actions/deploy-pages` publica un artefacto subido previamente a Pages, y necesita `pages: write` para el despliegue y `id-token: write` para que el despliegue se pueda verificar, con el job apuntando al entorno `github-pages`. Lo que no es es una vista previa por rama: un repositorio tiene un sitio de Pages, así que previsualizar una pull request significa o bien sobrescribir lo que está en vivo o bien inventar una convención de rutas y limpiarla después, y nada caduca por sí solo.

**Devolver el HTML con un commit funciona, y envenena el diff.** Necesita `contents: write` —el permiso que el resto de este artículo ha estado evitando— y un commit de bot que va a volver a disparar el flujo de trabajo salvo que te protejas contra ello. El coste duradero es la revisión: cada pull request lleva ahora mil líneas de marcado generado que nadie lee y todo el mundo se desplaza para pasar, más conflictos de fusión en un archivo que ningún humano edita. La salida generada pertenece a otro sitio que no sea el árbol fuente, y este es el caso más claro de ello.

**Una página alojada compra exactamente una cosa: un lector sin cuenta.** Esa es toda la justificación, y si nadie en la revisión la necesita, el artefacto es más barato y el diff enriquecido es todavía más barato. Cuesta una clave en un secreto y una cuenta con límites — 500 documentos, 100 MB, y 4 MB para cualquier documento individual. Esos límites son la razón para limpiar las vistas previas antiguas en vez de dejar que se acumule un año de pull requests.

**Y una que no funciona: pegar el HTML en el comentario.** GitHub renderiza el cuerpo de un comentario como su propio Markdown y elimina las etiquetas de las que depende un documento convertido, `style` la primera de todas. Un comentario puede llevar un enlace. No puede llevar un documento.

## Veinte archivos, dos límites de peticiones, y las formas en que falla

Una pull request de reestructuración toca veinte archivos Markdown, y la forma del trabajo deja de ser un detalle.

### Un bucle le gana a una matriz aquí

Lo que trae la action por defecto es un documento por archivo, convertido y publicado uno tras otro dentro de un solo job. Veinte archivos son veinte peticiones en un proceso en un runner, y termina en aproximadamente lo que tarda un archivo más diecinueve idas y vueltas.

El instinto es abrir en abanico con una matriz —construir la lista de archivos en un job, pasarla por `fromJSON` a `strategy.matrix` en el siguiente, y correr veinte jobs en paralelo. Para un trabajo que tarda minutos por elemento, eso es exactamente correcto. Para una conversión que tarda un instante son veinte asignaciones de runner, veinte checkouts, veinte descargas de la action y veinte comentarios salvo que los suprimas, para ahorrar unos segundos de idas y vueltas a la API. El bucle gana en todos los ejes que importan.

Si de todas formas abres en abanico por alguna otra razón, tres ajustes evitan que duela: `fail-fast: false`, para que un archivo malformado no cancele a los otros diecinueve; `max-parallel`, para que la ráfaga sea un goteo; y un job final que recoja las salidas y escriba un solo comentario, porque veinte comentarios es peor que ninguno.

La mejor respuesta para veinte archivos relacionados suele no ser el paralelismo en absoluto. `merge: true` los encadena en un solo documento con un solo enlace, y quien revisa lee un manual en orden en vez de abrir veinte pestañas y perder el sitio. El orden se convierte entonces en lo que hay que resolver bien, que es el mismo problema que tiene una conversión de toda una carpeta.

### Sesenta llamadas por minuto, y mil por hora

Dos límites de peticiones se sitúan al final de este trabajo, y pertenecen a sistemas distintos.

La API cuenta llamadas por quien llama y por minuto, y rechaza la sesenta y una con un 429 y un `Retry-After`, con el razonamiento de que una clave que va más rápido que eso está en un bucle y no trabajando. Veinte archivos en un bucle son veinte llamadas y ni de cerca ese límite. Veinte jobs en paralelo, cada uno reintentando ante un timeout, en un repositorio con tres pull requests abiertas a la vez, es cómo un límite que sonaba generoso termina encontrándose.

El límite propio de GitHub se sitúa en el comentario: `GITHUB_TOKEN` recibe 1.000 peticiones por hora por repositorio, compartidas entre cada flujo de trabajo de ese repositorio (comprobado en docs.github.com, el 9 de septiembre de 2026). Un comentario por ejecución no es nada. Un comentario por archivo, en un monorepo con mucho tráfico, junto a cada otro flujo de trabajo gastando del mismo presupuesto, es un 403 un martes por la tarde que nadie conecta con el cambio hecho el lunes. Un comentario fijo por ejecución es la respuesta barata a los dos límites a la vez.

### Cuándo la ejecución se pone en rojo, y cuándo se pone en verde y miente

Cuatro fallos explican casi todos los casos. Tres avisan de sí mismos. El cuarto es el que hay que vigilar.

**Un cuerpo que la plataforma rechaza.** La conversión acepta hasta 10 MB, pero un documento guardado en una cuenta tiene un tope de 4 MB, y la razón no es una política: una Vercel Function rechaza una petición o una respuesta con un cuerpo de más de 4,5 MB antes de que corra ninguno de nuestros propios códigos, así que un documento más grande no podría ni guardarse ni leerse de vuelta, y quien llama recibiría el 413 desnudo de la plataforma en vez de una frase que se explique. En CI, la pista es qué error obtienes — un cuerpo JSON con un mensaje legible significa que la petición llegó a la API y esta la rechazó; un 413 desnudo sin cuerpo significa que nunca llegó. De cualquier forma el arreglo es el mismo, y casi nunca es «divide el documento»: un archivo Markdown de 4 MB suele ser salida generada que nunca debió estar en la vista previa, que es para lo que sirven el filtro `paths` y una lista `files` explícita.

**Un token que caducó.** Puede referirse a dos tokens distintos. `GITHUB_TOKEN` se acuña para el job y deja de funcionar cuando el job termina, cosa que solo muerde si intentas entregárselo a algo fuera de la ejecución. La clave de la API es la que caduca en la práctica —revocada por quien la rotó, o borrada con la cuenta. El síntoma es un 401 en cada ejecución incluidas las repeticiones de ejecuciones que pasaron la semana pasada, y ese es el diagnóstico: nada cambió en el repositorio, así que nada en el repositorio es la causa. Las claves se guardan como un hash y se muestran una sola vez, así que no hay nada que inspeccionar; acuña una nueva, actualiza el secreto, vuelve a ejecutar.

**Un secreto que nunca estuvo ahí.** Un secreto referenciado con el nombre equivocado no es un error. Se interpola a una cadena vacía, el paso corre sin clave, y el fallo aparece en la API como un 401 que se lee como una clave mala en vez de como una clave ausente. No se puede probar directamente, porque el contexto `secrets` no está disponible en un `if` ni a nivel de job ni a nivel de paso (comprobado en docs.github.com, el 9 de septiembre de 2026). Cópialo a `env` a nivel de job y comprueba la variable en su lugar:

```yaml
jobs:
  preview:
    runs-on: ubuntu-latest
    env:
      HAS_KEY: ${{ secrets.TP_API_KEY != '' }}
    steps:
      - if: env.HAS_KEY == 'true'
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
```

**Un documento que convierte y sale vacío.** Este es el peligroso, porque todo se ve en verde. Un archivo que no es más que front matter YAML se convierte en un documento sin cuerpo. Lo mismo pasa con un archivo cuyo contenido es un solo comentario HTML, o una página cuyo texto vive dentro de una etiqueta de plantilla que el conversor no ejecuta. El flujo de trabajo tiene éxito, el comentario se publica, el enlace abre una página en blanco, y quien revisa asume que la página en blanco es el documento. Protégelo con el número de palabras que la action ya reporta:

```yaml
      - if: steps.publish.outputs.documents != ''
        env:
          DOCUMENTS: ${{ steps.publish.outputs.documents }}
        run: |
          node -e '
            const docs = JSON.parse(process.env.DOCUMENTS || "[]");
            const empty = docs.filter((d) => d.words < 20);
            if (empty.length > 0) {
              console.error(`Empty after conversion: ${empty.map((d) => d.name).join(", ")}`);
              process.exit(1);
            }
          '
```

Veinte palabras es arbitrario y está bien así — el punto no es el umbral sino que un documento que nadie puede leer haga fallar la ejecución en vez de dejarla pasar.

## El mismo trabajo en GitLab, y en un runner propio

Nada de lo anterior es en realidad exclusivo de GitHub. El trabajo es: averiguar qué cambió, convertirlo, publicarlo, y poner el enlace donde esté quien revisa. Solo las dos últimas líneas de eso son específicas del anfitrión.

En GitLab, las piezas se alinean casi una a una. `rules:changes` es el filtro `paths`. `interruptible: true` es lo que hace que un job se pueda cancelar cuando lo supera un pipeline más nuevo, y `resource_group` limita la concurrencia donde los jobs no deben superponerse. `CI_MERGE_REQUEST_DIFF_BASE_SHA` está descrito en la documentación como el SHA base del diff de la merge request, que es el commit contra el que comparar, y `CI_MERGE_REQUEST_IID` es el número en la URL de la merge request, que es contra lo que se publica un comentario. El problema del clon superficial es el mismo problema con otro control: el runner clona superficialmente por defecto y `GIT_DEPTH` es lo que lo cambia (todo comprobado en docs.gitlab.com, el 9 de septiembre de 2026).

```yaml
markdown-preview:
  image: node:lts-alpine
  interruptible: true
  variables:
    GIT_DEPTH: 0
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
      changes:
        - '**/*.md'
  script:
    - files=$(git diff --name-only --diff-filter=d
        "$CI_MERGE_REQUEST_DIFF_BASE_SHA"...HEAD -- '*.md')
    - node tp.mjs push $files --share link --json > documents.json
```

En un runner que te pertenece —Jenkins, Buildkite, una tarea de cron en una máquina en un armario— dos de las cuatro piezas sencillamente no están. No hay carga de evento, así que averiguas la base tú mismo con `git merge-base origin/main HEAD`, y no hay pull request contra la que comentar, así que el enlace va a donde tu equipo de verdad lee: un mensaje de chat, una anotación de compilación, un correo. Lo que viaja sin cambios es el diff y la petición, y la petición es la parte que merece diseñarse con cuidado, porque [una API de conversión solo es tan usable como sus mensajes de error y sus límites publicados](/blog/converting-documents-with-an-api). Si el trabajo es convertir un árbol entero en vez de un puñado de archivos cambiados, [enumerar y ordenar los archivos es la mitad difícil](/blog/batch-convert-markdown-files).

## Cómo elegir qué publicar

1. **Averigua quién es el lector antes de elegir un destino.** Si todos cuya aprobación importa tienen cuenta de GitHub, el diff enriquecido y un artefacto son gratis y puedes dejar de leer; el flujo de trabajo se gana su lugar solo cuando uno de los lectores no la tiene, porque un enlace pasa a ser entonces el único artefacto que funciona.
2. **Publica al hacer push a la rama predeterminada salvo que necesites específicamente la vista previa antes de la fusión.** Elimina la pregunta del fork, la pregunta del token y la mitad de los modos de fallo de un solo golpe, y el coste es que la revisión sigue ocurriendo sobre el diff.
3. **Nunca recurras a `pull_request_target` para hacer funcionar las vistas previas de un fork.** Le entrega tus secretos a un job que está a punto de hacer checkout del código de otra persona, y el modo de fallo no es una ejecución en rojo que puedas arreglar, es una clave que tienes que rotar y un historial que tienes que auditar.
4. **Protege el paso de publicación para que los casos incómodos se salten en vez de fallar.** Ningún Markdown cambió, o la pull request vino de un fork: una ejecución en verde con un paso saltado mantiene la comprobación digna de confianza, y una comprobación en la que nadie confía es una comprobación que nadie lee cuando de verdad importa.
5. **Mantén un comentario por pull request y un documento por push.** Un comentario porque un hilo de quince es un hilo que nadie se desplaza hasta el final; un documento nuevo por push porque sobrescribir una página convierte cada enlace del hilo en una mentira sobre qué commit describe.
6. **Cuenta las peticiones antes de abrir en abanico.** Veinte archivos en un job son veinte llamadas; veinte jobs son veinte runners, veinte checkouts y dos límites de peticiones, y un límite rechaza en vez de encolar.
7. **Comprueba qué ve quien revisa, no qué dice la ejecución.** Abre el enlace del comentario, sin sesión iniciada, en un teléfono, y mira si es el documento. Un flujo de trabajo puede estar en verde de principio a fin y seguir publicando una página vacía.

Revisar prosa en un diff es adivinar, y el arreglo entero es un archivo: un disparador con un filtro `paths`, un grupo de concurrencia, dos permisos, un secreto, y un paso que publica lo que cambió la rama y deja un enlace donde quien revisa de verdad lo va a ver. Empieza con el repositorio cuyo Markdown lee alguien que no programa, abre una pull request contra un archivo que necesite una edición real, y mira si el primer comentario que llega habla del texto en vez del formato. Para ver cómo se ve la salida antes de acuñar una clave para ello, convierte el archivo a mano primero — [la conversión de Markdown a HTML de TransformPipe](/) corre en tu navegador, gratis, y sin sesión iniciada el archivo no se sube a ningún sitio.

## Preguntas frecuentes

### ¿Puedo previsualizar Markdown desde una pull request abierta en un fork?

No con un secreto, y eso es deliberado. Un evento `pull_request` desde un fork recibe un `GITHUB_TOKEN` de solo lectura y ningún secreto del repositorio, así que el paso de publicación no tiene clave y el paso de comentario no tiene ámbito de escritura. Publica al hacer push a la rama predeterminada en su lugar, o protege el paso para que una pull request de un fork lo salte con limpieza.

### ¿Es `pull_request_target` alguna vez seguro?

Solo cuando el job nunca toca el contenido propio de la pull request — sin checkout del head, sin ejecutar nada de la rama, sin instalación de dependencias que pueda ejecutar un script de ella. Para etiquetado y triaje eso es alcanzable. Para cualquier cosa que lea los archivos del colaborador, usa el patrón de dos flujos de trabajo con `workflow_run`, o no lo hagas en absoluto.

### ¿Por qué mi flujo de trabajo no hace nada cuando hago push?

Normalmente el filtro `paths`: se evalúa contra los archivos que cambió la pull request, así que un push que no tocó ningún archivo coincidente nunca encola una ejecución. La trampa relacionada es convertir un flujo de trabajo filtrado por `paths` en una comprobación de estado obligatoria — nunca informa sobre las pull requests que se salta, así que la fusión espera una comprobación que nunca va a llegar.

### ¿De verdad necesito `fetch-depth: 0`?

Solo si algo en el job compara contra el commit base, que es cómo se construye la lista de archivos cambiados. Un clon superficial no contiene ese commit, así que la comparación falla o no informa de nada. Nombrar los archivos explícitamente lo evita, y también lo evita una action que le pregunte a la API de GitHub por la lista en vez de a git.

### ¿Cómo evito que el bot comente en cada push?

Apaga el comentario propio de la action con `comment: false` y publica un comentario fijo en su lugar, con clave en una cabecera para que el mismo comentario se reescriba en el mismo sitio en cada ejecución. Aun así mantén los enlaces distintos por push — reutilizar un documento para cada commit hace que los enlaces antiguos del hilo describan un texto que ya no existe.

### ¿Qué pasa cuando una pull request toca veinte archivos?

La action publica veinte documentos desde un solo job y comenta una tabla de veinte filas, lo cual está bien. Encadenarlos en un solo documento con `merge: true` suele ser mejor para quien lee. Una matriz de veinte jobs en paralelo es la opción que hay que evitar: más coste de configuración que coste de conversión, y dos límites de peticiones esperando al final.

### ¿Puedo hacer esto sin una cuenta ni una clave de API?

Sí, con menos. Convierte el archivo en un navegador y pega el enlace tú mismo, o haz que el flujo de trabajo adjunte el HTML renderizado como un artefacto, que no necesita clave ni cuenta — quien lee solo necesita tener sesión iniciada en GitHub para descargarlo. La clave compra una sola cosa: un enlace que se abre para alguien que no tiene ninguna cuenta de GitHub.
