---
name: vectorcraft-sticker-sheet
description: Convierte un documento VectorCraft con ilustraciones sueltas en una plancha de stickers lista para imprimir y cortar. Reagrupa los paths sueltos en stickers individuales, los alinea en una grilla uniforme, genera un contorno de corte con offset de 2 mm por sticker y exporta un SVG solo de corte y un PDF solo de arte, con las dos capas separadas.
---

# Plancha de stickers con corte para plotter

Produce dos archivos finales: **`<BASE>-corte.svg`** (solo la línea de corte, para el plotter) y
**`<BASE>-impresion.pdf`** (solo el arte, para la impresora). Nunca se juntan: el plotter no debe
recibir el arte y la impresora no debe recibir el magenta.

## Cuándo usar esta skill

- Hay que armar u ordenar una plancha de stickers a partir de un `.vectorcraft`.
- Hay que agregar línea de corte / troquelado para un plotter.
- Hay que alinear en grilla elementos que están "más o menos" alineados a mano.

## Requisitos

- MCP `vectorcraft` conectado (`opencode mcp list` → `✓ vectorcraft connected`).
  Si falta: `opencode mcp add vectorcraft --global -- /usr/bin/vectorcraft-cli mcp`.
- Todas las herramientas se llaman **dentro de `execute`** como `tools.vectorcraft.*`.
  Los comandos del motor que no son tools propios van por
  `tools.vectorcraft.run_command({command, params})`.
- Buscar ids de comandos y parámetros: `command_list({filter: "..."})` (el `params` describe la firma).

## Paso 0 — Diagnóstico (sin tocar nada)

```sh
vectorcraft-cli info archivo.vectorcraft   # artboards, unidades, colorMode, objetos, kinds, warnings
```

Luego, con el MCP:

```
open_file({path})
doc_inspect({depth: 1})          # capas y grupos contenedores
render_preview({max_side: 900})  # SIEMPRE: cuántos stickers hay de verdad
```

El render es obligatorio: la estructura de paths no dice cuántos stickers son.
Un contenedor con 300 paths puede ser 15 stickers de 20 paths cada uno.

## Paso 1 — Agrupar los paths en stickers

Los stickers suelen venir como paths sueltos dentro de **un único grupo**. Se agrupan por
**solapamiento puro de bounding boxes (t = 0)**. Cualquier tolerancia > 0 fusiona stickers vecinos.

```js
const d = await tools.vectorcraft.doc_inspect({ ids: [CONTENEDOR], childLimit: 1000, depth: 1 });
const items = d.nodes[0].children.map(k => ({ id: k.id, x: k.bounds.x, y: k.bounds.y, w: k.bounds.width, h: k.bounds.height }));
const p = items.map((_, i) => i);
const find = i => { while (p[i] !== i) { p[i] = p[p[i]]; i = p[i]; } return i; };
for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
  const a = items[i], b = items[j];
  if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) {
    const ra = find(i), rb = find(j); if (ra !== rb) p[ra] = rb;
  }
}
```

Ordenar el resultado **en filas por Y y dentro de cada fila por X** (tolerancia ~60 pt para
considerar que dos centros son de la misma fila) antes de asignar nombres.

**Antes de este paso, borrar cualquier objeto suelto de pruebas anteriores**
(`edit.clear`). Un objeto sobrante que solape un sticker se suma al cluster, y después su
contorno sale desplazado o agrandado.

## Paso 2 — Contorno de corte por sticker

El arte **no se toca**: se duplica, se une la copia, se hace el offset y se borra la copia.
Unir el arte real con `pathfinder.unite` lo aplana y **destruye los colores**.

```
edit.duplicate {ids: <ids del cluster>}          → {ids: dupIds}
object.pathfinder.unite {ids: dupIds}           → {ids: [silueta]}
object.path.offsetPath {offset: 5.67, joins: "round"}   // ⚠ actúa sobre la SELECCIÓN, no acepta ids
edit.clear {ids: <silueta>}
set_paint({ids: <ids del offset>, fill: "none", stroke: {c:0,m:100,y:0,k:0}, strokeWidth: 0.25})
```

- `offsetPath` no acepta `ids`: hay que dejar la silueta seleccionada (el `unite` anterior la
  deja seleccionada sola).
- Después de cada sticker verificar que el contorno sea **un solo path cerrado**
  (`doc_inspect({ids:[contorno], depth:2})` → `childCount` ausente). Si aparecen subpaths,
  el sticker tiene partes separadas y hay que revisarlo a mano.

## Paso 3 — Grilla uniforme

Las celdas se dimensionan por el **bbox del contorno** (no del arte), porque la línea de corte
es el borde real del sticker.

```js
const GAP = 14.17;                  // 5 mm entre líneas de corte
const colW = max width por columna; // sobre contornos
const rowH = max height por fila;
const totalW = sum(colW) + 2*GAP, totalH = sum(rowH) + 4*GAP;
const mx = (595.2756 - totalW)/2, my = (841.8898 - totalH)/2;   // A4, centrado
// celda (r,c): x = mx + sum(colW[0..c-1]) + c*GAP ; y = my + sum(rowH[0..r-1]) + r*GAP
// destino: centrar el CONTORNO en la celda → dx, dy = destino - bbox actual
```

Aplicar el mismo `dx/dy` al grupo de arte y a su contorno:

```
object.group {ids: <ids del cluster>}            → {id}
object.setProps {ids: [id], name: "frasco-1"}    // nombre = diseño + columna
transform({ids: [grupo], dx, dy})
transform({ids: [contorno], dx, dy})
```

Si después hay que corregir el tamaño de algún contorno, **recalcular la grilla** con las
alturas definitivas: si no, esa fila queda con un hueco distinto al resto.

## Paso 4 — Capas

```
layer.setProps {ids: [capaOriginal], name: "ARTE"}
layer.new {name: "CORTE", top: true, color: "#ff00ff"}   → {id}
layer.setCurrent {id: <capa CORTE>}
object.arrange.sendToCurrentLayer {ids: <todos los contornos>}
```

`sendToCurrentLayer` a veces no hace nada la primera vez: **verificar** con
`doc_inspect({depth:1})` que `CORTE` tenga N hijos y reintentar si quedó vacía.

## Paso 5 — Exportar con las capas separadas

Se controla por visibilidad: `export` no tiene parámetro de capas.

```js
// 1) PDF solo arte
await tools.vectorcraft.run_command({ command: "layer.setProps", params: { ids: [CORTE], visible: false } });
await tools.vectorcraft.export({ format: "pdf", path: BASE + "-impresion.pdf" });
await tools.vectorcraft.run_command({ command: "layer.setProps", params: { ids: [CORTE], visible: true } });

// 2) SVG solo corte
await tools.vectorcraft.run_command({ command: "layer.setProps", params: { ids: [ARTE], visible: false } });
await tools.vectorcraft.export({ format: "svg", path: BASE + "-corte.svg" });
await tools.vectorcraft.run_command({ command: "layer.setProps", params: { ids: [ARTE], visible: true } });

// 3) Control visual (ambas visibles)
await tools.vectorcraft.export({ format: "png", path: BASE + "-plancha.png", options: { ppi: 300, background: "white" } });

// 4) Maestro editable
await tools.vectorcraft.save_file({ path: BASE + ".vectorcraft", preview: true });
```

**Nunca sobrescribir el archivo original.** `<BASE>` es un nombre nuevo
(`ORIGINAL-plancha`), y el `.vectorcraft` de entrada queda con su fecha intacta.

## Constantes que importan

| Dato | Valor |
| --- | --- |
| Borde blanco / offset de corte | 2 mm = **5,67 pt** (3 mm = 8,50 pt) |
| Hueco entre líneas de corte | 5 mm = **14,17 pt** |
| Trazo de corte | **0,25 pt**, `fill: "none"`, `joins: "round"` |
| Magenta de corte (CMYK) | `{c:0, m:100, y:0, k:0}` → el SVG lo escribe como `#f01796` |
| A4 | 595,2756 × 841,8898 pt |
| PNG de control | `ppi: 300`, `background: "white"` |
| Clustering | solapamiento puro, **t = 0** |

## Trampas (síntoma → arreglo)

| Síntoma | Causa | Arreglo |
| --- | --- | --- |
| Un sticker aparece como mancha de color sólida | un objeto de prueba quedó dentro del grupo y tapa el arte | `edit.clear` del sobrante y regenerar su contorno desde el arte real |
| Un contorno es más grande que sus hermanos | se unió arte + un contorno viejo | borrar el contorno, rehacer desde el bbox del arte |
| El `unite` aplana los colores | se unió el arte real | siempre duplicar primero |
| `offsetPath` tira "unknown parameter ids" | no acepta `ids` | dejar la silueta seleccionada y llamar sin params de selección |
| El PNG sale con fondo negro al verlo | PNG transparente por defecto | `options: { background: "white" }` |
| Dos stickers vecinos se fusionan | tolerancia de clustering > 0 | usar t = 0 |
| `sendToCurrentLayer` no mueve nada | capa no actual todavía | verificar y reintentar |
| El color de corte no es `#ff00ff` | documento CMYK | es correcto: el equivalente RGB de magenta 100 % es `#f01796` |
| El PDF avisa "N RGB colours" en documento CMYK | el arte trae colores RGB | avisar al usuario; se corrige con Editar → Editar colores → Convertir a CMYK |

## Checklist antes de entregar

- [ ] N contornos = N stickers, cada uno un path cerrado y sin islas
- [ ] huecos verticales y horizontales iguales (±0,2 pt)
- [ ] `<BASE>-corte.svg` contiene solo paths con `fill="none"` y el magenta
- [ ] `<BASE>-impresion.pdf` no contiene nada magenta
- [ ] `render_preview` final correcto (ningún sticker tapado ni cortado)
- [ ] archivo original con fecha y tamaño intactos

## Uso físico (explicar al usuario)

1. Imprimir `<BASE>-impresion.pdf` en A4 a **100 % / tamaño real** (nunca "ajustar a la página").
2. Dejar secar la tinta; laminar si va con vinilo de protección.
3. Al plotter, `<BASE>-corte.svg` **sin escalar**, con el mismo tamaño de página que el impreso.
4. Con marcas de registro: las agrega el software de corte (Silhouette Studio, Cricut) o el flujo
   del plotter. VectorCraft no las genera.
5. En Silhouette/Cricut también sirve el SVG completo con ambas capas, asignando corte solo al
   color magenta; el archivo de corte separado es para flujos directos (Graphtec, Roland).
