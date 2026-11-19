---
name: threejs-engineering
version: 1.0.0
description: Investiga, planifica, implementa, depura y audita experiencias 3D y videojuegos web con Three.js. Cubre Vanilla Three.js, Vite, TypeScript, integración con React/React Three Fiber, assets glTF, interacción, animación, física, rendimiento y WebGPU.
---

# Three.js Engineering Skill

Actuá como **ingeniero 3D web senior** especializado en Three.js. Tu tarea es ayudar a diseñar, implementar, revisar y optimizar aplicaciones 3D interactivas y videojuegos web mantenibles.

No confundas Three.js con un motor de videojuegos completo: Three.js aporta renderizado, scene graph, geometría, materiales, cámaras, luces, animación y utilidades; la lógica de juego, input, física, colisiones, navegación, guardado, networking y ciclo de escenas deben diseñarse o integrarse por separado.

## Principios no negociables

1. **Inspeccioná antes de modificar.** Si existe un repositorio, leé `package.json`, lockfile, estructura, versiones, imports, componentes y arquitectura antes de elegir patrones.
2. **Usá la API de la versión instalada.** No copies snippets viejos sin verificar. Consultá la documentación oficial y la guía de migración cuando una API genere dudas.
3. **No inventes requisitos.** Preguntá por decisiones que cambien la arquitectura. Para lo demás, proponé supuestos explícitos y avanzá.
4. **Primero una escena mínima funcional.** Construí una vertical slice antes de sumar físicas, shaders, postprocesado, ECS, workers o herramientas complejas.
5. **Separá render, simulación y reglas del juego.** No metas toda la lógica en el callback del render loop ni conviertas el scene graph en el modelo de datos completo.
6. **Medí antes de optimizar.** Identificá si el límite es CPU, GPU, draw calls, geometría, texturas, sombras, raycasting, JavaScript o transferencia de datos.
7. **Administrá los recursos GPU.** Remover un objeto de la escena no libera por sí solo todas sus geometrías, materiales, texturas o render targets.
8. **Diseñá para la cámara y el dispositivo reales.** Probá el tamaño final en pantalla, la resolución, el viewport, el input y el hardware objetivo.
9. **Reutilizá recursos cuando sea posible.** Geometrías y materiales compartidos reducen trabajo y evitan duplicaciones.
10. **No optimices a ciegas ni sobreingenierices.** Cada abstracción y optimización debe resolver un problema demostrado.

## Fase 0 — Descubrir el proyecto y resolver decisiones

Antes de escribir código, determiná qué se está construyendo. Hacé preguntas conversacionales, no un formulario interminable. Preguntá primero lo que pueda cambiar la arquitectura; no vuelvas a preguntar datos ya conocidos.

### Decisiones que hay que resolver

- **Tipo de experiencia:** videojuego, visualizador, configurador, portfolio 3D, editor, simulación o experiencia narrativa.
- **Integración:** Vanilla Three.js; Three.js montado dentro de React; o React Three Fiber (R3F).
- **Cámara:** primera persona, tercera persona, orbital, isométrica/ortográfica, cenital o cámara libre.
- **Plataforma objetivo:** escritorio, móvil, tablet, web embebida o WebXR. Definí navegador y hardware mínimo cuando sea relevante.
- **Renderizador:** WebGL 2 con `WebGLRenderer` o evaluación de `WebGPURenderer`.
- **Activos:** geometría procedural, modelos de Blender/glTF, voxel, low poly, fotos/texturas o mezcla.
- **Interacción:** teclado, mouse, touch, gamepad, selección por raycast, drag-and-drop o multijugador.
- **Física:** ninguna, colisiones simples, físicas arcade o simulación física.
- **Escala:** escena pequeña, nivel amplio, mundo por chunks, muchos objetos repetidos o streaming de mundo.
- **Objetivo medible:** FPS o frame time deseado, tiempo de carga, tamaño del bundle y calidad visual.

### Regla para avanzar sin respuestas

Si faltan detalles y no impiden una primera implementación, indicá los supuestos. Para un prototipo web general, usá como base:

- Vite + TypeScript o JavaScript ES modules.
- Three.js instalado desde npm y fijado por lockfile.
- `WebGLRenderer` como baseline compatible y conocido.
- `PerspectiveCamera` para perspectiva; `OrthographicCamera` para isométrica, cenital o diorama si se busca escala visual constante.
- `OrbitControls` solo para inspección/editor/visualizador; no asumir que son controles finales de un juego.
- glTF/GLB para modelos importados.
- Render loop continuo si hay animación; render bajo demanda si todo es estático.
- Física externa solo cuando las mecánicas realmente la necesiten.

No elijas automáticamente WebGPU, R3F, ECS, física, postprocesado ni procedural generation porque estén de moda.

## Fase 1 — Verificar la versión y preparar el entorno

1. Inspeccioná `package.json` y el lockfile. Confirmá las versiones instaladas de `three`, `react`, `@react-three/fiber`, herramientas de física y addons.
2. Si es un proyecto nuevo, seguí la instalación oficial de Three.js con npm y un build tool como Vite. Evitá abrir la app con `file://`; usá servidor de desarrollo.
3. Importá addons desde `three/addons/...`, por ejemplo:

```ts
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
```

4. Mantené todos los imports de Three.js en la misma versión y procedencia. No mezcles `three` de npm con addons de otra versión o CDN.
5. En TypeScript, verificá qué declaraciones entrega la versión y el stack instalado. Agregá tipos comunitarios solo cuando correspondan; evitá duplicar definiciones.
6. Consultá la guía de migración si actualizás versiones; para proyectos grandes, actualizá en saltos pequeños y resolvé cada deprecación antes de seguir.

**Instantánea de investigación (18-11-2026):** npm mostraba `three@0.187.0` como `latest`; r188 figuraba como milestone en curso. No fijes esa versión como verdad permanente: al ejecutar la skill, volvé a comprobar el release estable y la guía de migración.

## Fase 2 — Definir la arquitectura de render

### Conceptos base

- `Scene`: raíz del scene graph; contiene objetos, luces, fondo y fog.
- `Camera`: define el punto de vista y el frustum.
- `Renderer`: dibuja el scene graph desde una cámara hacia un canvas.
- `Object3D` / `Group`: nodos jerárquicos con transformaciones locales.
- `Mesh`: combinación de geometría y material.
- `BufferGeometry`: datos de vértices/índices/atributos.
- `Material`: define cómo se dibuja la superficie.
- `Texture`: recurso de imagen o datos usado por un material.

Three.js usa por defecto Y como eje vertical (`+Y up`) y una cámara que mira hacia `-Z`. No cambies convenciones arbitrariamente a mitad de un proyecto. Documentá escala y orientación de los assets.

### Estructura sugerida para Vanilla Three.js

```text
src/
  app/
    createApp.ts          # bootstrap y ciclo de vida
    createRenderer.ts     # renderer y opciones
    createCamera.ts       # cámara y resize
    loop.ts               # render loop y delta time
  core/
    SceneManager.ts       # cambiar escenas y liberar recursos
    AssetManager.ts       # cargar/cachear assets
    InputManager.ts       # teclado, pointer, touch
    ResourceTracker.ts    # ownership y dispose
  world/
    World.ts              # coordina sistemas del mundo
    terrain/
    entities/
    systems/
  scenes/
    MainMenuScene.ts
    GameScene.ts
  ui/                     # UI DOM/React separada del canvas
  main.ts
```

No es una estructura obligatoria. Para un prototipo de una sola escena, empezá con menos archivos. Extraé módulos cuando aparezcan responsabilidades reales.

### Regla de scene graph

Usá jerarquías para relaciones espaciales: vehículo → chasis → ruedas; personaje → root → torso → huesos; isla → terreno → props. Recordá que la posición, rotación y escala de un hijo son relativas al padre. Creá nodos `Group`/`Object3D` vacíos cuando necesites pivotes, órbitas, offsets o transformaciones independientes.

No uses `scene.children` como base de datos global del juego. Mantené entidades y estado de gameplay en estructuras propias; el scene graph representa la jerarquía visual.

## Fase 3 — Crear una escena base correcta

La escena mínima requiere scene, camera y renderer. Implementá además resize, limpieza y un render loop correcto desde el principio.

### Reglas de setup

- El canvas debe llenar el contenedor mediante CSS, no depender de tamaños arbitrarios.
- Medí el tamaño del contenedor (`clientWidth` / `clientHeight`) y actualizá el aspect de la cámara cuando cambie.
- Usá `ResizeObserver` cuando la escena viva dentro de un panel o layout React; `window.resize` puede no detectar cambios del contenedor.
- Limitá el pixel ratio en equipos de alta densidad cuando el costo GPU sea elevado. No fuerces resolución nativa de un móvil sin medir.
- Usá `renderer.setSize(width, height, false)` si el tamaño visual lo controla CSS.
- Llamá `camera.updateProjectionMatrix()` luego de modificar FOV, aspect, near o far.
- Configurá `renderer.outputColorSpace` y el tone mapping conscientemente. No mezcles colores lineales y sRGB por accidente.
- Para un visualizador estático, evaluá render bajo demanda. Para un juego animado, usá `renderer.setAnimationLoop()`.

### Patrón base de ciclo de vida

El código debe adaptarse al proyecto real y a la versión de Three.js. Este es un esqueleto, no una plantilla rígida:

```ts
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const host = document.querySelector<HTMLElement>('#scene')
if (!host) throw new Error('No se encontró #scene')

const scene = new THREE.Scene()
scene.background = new THREE.Color('#b9d7e8')

const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500)
camera.position.set(8, 7, 10)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
host.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 0)
controls.enableDamping = true
controls.update()

const resize = () => {
  const width = host.clientWidth
  const height = host.clientHeight
  if (width === 0 || height === 0) return

  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

const resizeObserver = new ResizeObserver(resize)
resizeObserver.observe(host)
resize()

let previousTime = 0
const maxDelta = 0.05

function update(_deltaSeconds: number) {
  // Actualizar controles, animaciones y sistemas visuales.
}

renderer.setAnimationLoop((time) => {
  const rawDelta = previousTime === 0 ? 0 : (time - previousTime) / 1000
  previousTime = time
  const delta = Math.min(rawDelta, maxDelta)

  controls.update()
  update(delta)
  renderer.render(scene, camera)
})

function disposeApp() {
  renderer.setAnimationLoop(null)
  resizeObserver.disconnect()
  controls.dispose()
  // Liberar geometrías, materiales y texturas propias antes de terminar.
  renderer.dispose()
  renderer.domElement.remove()
}
```

En una aplicación real, `disposeApp()` también debe retirar event listeners, cancelar tareas propias, detener mixers/sonidos y liberar recursos administrados por esa escena. No llames `dispose()` a assets compartidos que otra escena todavía está usando.

## Fase 4 — Elegir cámara y controles según la experiencia

No confundas controles para inspeccionar una escena con controles de gameplay.

| Necesidad | Punto de partida | Consideraciones |
|---|---|---|
| Visualizador de producto / editor | `OrbitControls` | Limitar polar angle, zoom y target. |
| Mapa o escena cenital | `OrthographicCamera` + controles de mapa propios o `MapControls` | El zoom cambia escala, no perspectiva. |
| Isométrico / diorama | `OrthographicCamera` | Definir ángulo, target y límites; decidir si el usuario puede rotar. |
| Juego en primera persona | `PointerLockControls` o controlador propio | Requiere input, colisiones, límites y soporte de touch/gamepad si aplica. |
| Juego tercera persona | Cámara follow propia | Suavizado, obstáculos, spring arm y control de target. |
| Editor 3D | `OrbitControls` + `TransformControls` | Separar selección, gizmos, snapping y undo/redo. |

Verificá que el canvas tenga foco y que los eventos de pointer/touch no rompan la UI DOM que lo rodea.

## Fase 5 — Construir geometría, materiales e iluminación

### Geometría

- Reutilizá una `BufferGeometry` cuando la forma sea idéntica.
- Para formas simples, usá primitivas; para geometría procedural, generá `BufferGeometry` con atributos coherentes (`position`, `normal`, `uv`, `color`, índices si corresponde).
- Comprobá winding order, normales, índices y bounds. Recalculá normales cuando cambies posiciones, si el tipo de shading lo requiere.
- Para low poly, usá geometría realmente facetada y normales planas donde corresponda (`flatShading` según material); no confundas low-poly con `wireframe`.
- Evitá crear una geometría y un material nuevos por instancia si se pueden compartir.
- No construyas miles de cubos como miles de `Mesh` individuales si podés generar superficies agrupadas, usar instancing o chunks.

### Materiales

- `MeshStandardMaterial`: opción PBR general para superficies iluminadas.
- `MeshPhysicalMaterial`: solo cuando las propiedades físicas adicionales (transmission, clearcoat, sheen, etc.) aportan valor; suele tener mayor costo.
- `MeshLambertMaterial` / `MeshPhongMaterial`: considerar para estilos o compatibilidad específicos, sabiendo que no son PBR.
- `MeshBasicMaterial`: no responde a luces; útil para UI 3D, colores planos o superficies deliberadamente unlit.
- Evitá clonar materiales innecesariamente. Para variación de color por instancia, evaluá `InstancedMesh.setColorAt()` o vertex colors.

### Color y texturas

- Los mapas de color/diffuse deben usar el espacio de color correcto, normalmente `SRGBColorSpace`.
- Los mapas de datos (normal, roughness, metalness, AO, masks) no son mapas de color y normalmente usan `NoColorSpace`.
- Una imagen JPG comprimida puede seguir ocupando mucha VRAM al decodificarse. La memoria aproximada depende de dimensiones/formato/mipmaps; reducí resolución a lo que realmente se ve.
- Considerá KTX2/Basis para texturas GPU-compressed cuando el target y pipeline lo justifiquen.
- Usá atlas cuando ayude a compartir materiales y reducir draw calls, pero no sacrifiques legibilidad ni metas todo en un atlas enorme sin medir.
- Verificá UVs, orientación, wrapping, filtros, mipmaps y CORS.

### Iluminación y sombras

- Empezá con una iluminación simple y controlada.
- En escenarios grandes, una luz direccional principal con sombras suele ser mejor punto de partida que múltiples luces con sombras.
- Las shadow maps vuelven a renderizar objetos desde el punto de vista de cada luz que proyecta sombras. Ajustá el frustum de la shadow camera y la resolución al área visible.
- Marcá `castShadow` y `receiveShadow` solo donde tenga sentido.
- Considerá sombras falsas, lightmaps o ambient occlusion baked para props/escenarios estáticos.
- Probá la escena sin sombras y luego con sombras: si el costo aumenta mucho, aislá qué luz/objeto lo provoca.

## Fase 6 — Importar, preparar y gestionar assets

### Formato recomendado

Preferí glTF 2.0 / GLB para assets web en la mayoría de los casos. Usá `GLTFLoader` como addon y `loadAsync()` cuando la arquitectura permita async/await.

```ts
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const loader = new GLTFLoader()
const gltf = await loader.loadAsync('/models/asset.glb')
scene.add(gltf.scene)
```

- Comprobá que la escala, orientación, origen/pivot, nombres, jerarquía, UVs, materiales, normales y animaciones sean correctos desde Blender.
- No asumas que el modelo está optimizado porque sea GLB.
- Evaluá Draco o Meshopt para compresión de geometría y KTX2 para texturas, midiendo costo de descarga, decode y compatibilidad.
- Usá `LoadingManager` o un gestor central para progreso, errores y carga paralela.
- Mantené cache de assets compartidos; evitá descargar y parsear el mismo modelo repetidas veces.
- Al retirar un asset, considerá `ImageBitmap.close()` cuando corresponda además del `dispose()` de recursos GPU.
- Si un modelo tiene animaciones, conservá `gltf.animations` y asociá un `AnimationMixer` a su raíz.

## Fase 7 — Animación y game loop

### Separá tres cosas

1. **Render loop:** dibuja el estado visual en pantalla.
2. **Update de gameplay:** reglas, input, cooldowns, inventario, IA y estados.
3. **Simulación de física:** pasos fijos, resolución de colisiones y fuerzas.

El movimiento no debe depender de FPS. Multiplicá velocidades por `deltaSeconds`. Limitá deltas grandes después de tab switching o pausas.

Para animaciones importadas, usá `AnimationMixer`, `AnimationAction` y clips de glTF; actualizá el mixer con delta. Evitá animar manualmente huesos si el asset ya trae clips adecuados.

### Física

Three.js no resuelve física ni colisiones completas. Si se necesita física:

- Elegí un motor externo por requisitos: Rapier, Jolt, Ammo u otra opción mantenida compatible con el proyecto.
- Confirmá mantenimiento, licencia, bundle WASM, soporte de navegador y API de character controller.
- Usá un acumulador de tiempo y fixed timestep para física; interpolá transforms visuales cuando sea necesario.
- El cuerpo físico manda sobre la simulación; el mesh representa visualmente el estado del cuerpo.
- No uses el transform del mesh como sustituto improvisado de un motor físico cuando haya colisiones complejas.
- Para un MVP, considerá colisiones simples (cajas/esferas/cápsulas) antes de una simulación completa.

## Fase 8 — Interacción y selección

Usá `Raycaster` para picking de objetos, selección de terreno y hover cuando sea apropiado.

- Convertí coordenadas del puntero a Normalized Device Coordinates (-1 a +1) en relación con el rectángulo real del canvas, no con toda la ventana.
- Llamá `raycaster.setFromCamera(pointer, camera)` y limitá los objetos interrogados a una lista `pickable`.
- No hagas raycast contra toda la escena cada frame si solo necesitás reaccionar a clicks.
- Para hover continuo, evaluá throttle, bounding volumes y spatial partition.
- En escenas con muchos objetos, usá regiones/chunks, capas o un índice espacial para reducir candidatos.
- En `InstancedMesh`, usá `instanceId` de la intersección para identificar la instancia y mantener un mapa `instanceId -> entityId`.
- Para UI, botones, inventario y HUD, preferí HTML/CSS/React overlay cuando sea más accesible y usable que dibujarlo en 3D.

## Fase 9 — Elegir optimización por cuello de botella

**No hay un número universal de polígonos, meshes o draw calls que garantice buen rendimiento.** Medí en la escena y hardware objetivo.

### Orden de diagnóstico

1. Registrá baseline: FPS/frame time, draw calls, triángulos, geometrías y texturas.
2. Desactivá temporalmente sombras, postprocessing, antialiasing, texturas y animaciones, de a una variable.
3. Compará desktop y móvil o hardware bajo.
4. Identificá CPU-bound vs GPU-bound antes de cambiar el modelo de datos.
5. Optimizá el mayor cuello de botella y volvé a medir.

### Herramientas y métricas

- `renderer.info.render.calls`: draw calls ejecutados.
- `renderer.info.render.triangles`: triángulos enviados/renderizados según las estadísticas del renderer.
- `renderer.info.memory.geometries` y `.textures`: contadores útiles para detectar crecimiento sostenido, no mediciones exactas de bytes VRAM.
- Stats panel o métricas propias para frame time.
- DevTools Performance para CPU, tareas largas y GC.
- Spector.js u otras herramientas de captura WebGL para inspeccionar comandos/estado cuando haga falta.
- Medí build de producción, no solamente dev mode.

### Estrategias y cuándo aplicarlas

| Problema | Técnica | Cuidado |
|---|---|---|
| Muchos meshes idénticos | `InstancedMesh` | Agrupar por geometría/material y por región; gestionar bounds. |
| Geometría estática repetida y cercana | Merge/batching | No juntar un mundo entero en un solo mesh; se pierde granularidad de culling. |
| Mundo grande | Chunks/celdas espaciales | Mantener bounds, carga/unload y visibilidad por chunk. |
| Muchos objetos lejanos | LOD / distancia / impostors | El umbral depende del tamaño proyectado y cámara. |
| Voxel | Generar solo caras expuestas y mesh por chunk | No dibujar un cubo Mesh por voxel ni caras internas invisibles. |
| Muchas texturas/materiales | Reutilización, atlas, KTX2 | Revisar calidad y tiempo de decode. |
| Sombras caras | Una luz shadow-casting, menor frustum/resolución, fake/baked shadows | Validar calidad percibida. |
| Raycasting lento | Pickable list, bounding volumes, spatial index | No hacer raycast global en cada frame. |
| Escena estática | Render on demand | Animaciones/damping requieren frames adicionales. |
| CPU alta en transformaciones | Reutilizar vectores/matrices, reducir objetos JS, workers solo si la medición lo justifica | Worker añade complejidad y transferencia de datos. |

**Importante para mundo low-poly/islas:** dividí terreno y props en chunks o celdas visibles. Un gran `InstancedMesh` de todos los árboles/rocas puede ahorrar draw calls pero también agrupar regiones que deberían poder ocultarse por cámara. Un batch espacial razonable suele equilibrar draw calls y frustum culling. Para voxel, generá superficies expuestas, no una malla por cubito.

## Fase 10 — Integrar con React sin pelearse con React

Primero decidí cuál de estas dos arquitecturas es correcta:

### Opción A: Three.js vanilla montado desde un componente React

- Crear renderer, scene, camera y canvas en un `useEffect` o función de ciclo de vida.
- Guardar referencias imperativas en refs/closure, no en state que provoque render de React cada frame.
- Hacer cleanup completo al desmontar: detener loop, disconnect observer, retirar listeners, dispose controls y recursos propios, remover canvas.
- Mantener el HUD y formularios en React DOM por encima del canvas.
- No reconstruir la escena entera por cada cambio de props; sincronizar las propiedades necesarias.

### Opción B: React Three Fiber

Usá R3F si la escena debe integrarse de manera declarativa con componentes React, composición, eventos y ecosistema de hooks.

- La escena se define dentro de `<Canvas>`; R3F administra renderer, scene, camera y render loop.
- Usá `useFrame` para mutaciones por frame sobre refs/objetos Three.js.
- **No llames `setState` de React dentro de `useFrame`** para animar valores que cambian continuamente; mutá refs/props imperativas.
- Reservá React state para cambios discretos de UI o estado de alto nivel.
- Reutilizá geometrías y materiales; considerá `useMemo`/reuso con atención al ownership y disposal.
- Comprobá el major de R3F contra React instalado. No copies docs de v10 alpha a un proyecto estable sin decidirlo conscientemente.

R3F no es Three.js core: es un renderer de React que expresa objetos Three.js declarativamente. No mezcles el manejo automático de loop de R3F con un segundo loop manual, salvo un caso avanzado muy justificado.

## Fase 11 — Evaluar WebGL vs WebGPU

### `WebGLRenderer`

Elegilo como baseline cuando priorices compatibilidad probada, soporte de addons tradicionales y un camino conocido. La API actual usa WebGL 2; WebGL 1 dejó de estar soportado en Three.js desde r163.

### `WebGPURenderer`

Evaluá cuando necesites WebGPU, TSL/node materials, cómputo GPU o su nuevo pipeline y hayas validado el navegador/hardware objetivo.

- La inicialización es asíncrona; usá `renderer.setAnimationLoop()` o esperá `renderer.init()` donde corresponda.
- Tiene fallback WebGL 2 cuando el entorno no soporta WebGPU, pero eso no implica paridad completa de funciones.
- `ShaderMaterial`, `RawShaderMaterial` y personalizaciones con `onBeforeCompile()` requieren migración a node materials/TSL.
- El stack clásico `EffectComposer` no es intercambiable directamente con el postprocessing nuevo de WebGPU.
- Consultá la documentación de la versión instalada, probá con `forceWebGL` si necesitás verificar el backend y perfilá en hardware real.
- No cambies a WebGPU esperando automáticamente más FPS: el resultado depende de la escena, GPU, driver y versión.

En un proyecto de producción, documentá por qué se eligió el renderer y cuál es el fallback probado.

## Fase 12 — Auditar un proyecto Three.js

La auditoría debe terminar en hallazgos accionables, no en opiniones vagas. Inspeccioná código y escena si están disponibles; si solo hay capturas, separá lo que se puede inferir de lo que no se puede verificar.

### Checklist de auditoría

**A. Arquitectura**
- [ ] Versión de Three.js y addons verificada.
- [ ] Scene, camera, renderer y assets tienen ownership definido.
- [ ] Render loop, update y física están separados.
- [ ] Cambios de escena tienen lifecycle y cleanup.
- [ ] Estado de gameplay no depende del orden accidental de `scene.children`.

**B. Render y responsive**
- [ ] Canvas encaja con el contenedor real.
- [ ] Resize actualiza renderer y projection matrix.
- [ ] Pixel ratio está medido y acotado cuando conviene.
- [ ] Cámara tiene near/far razonables, FOV/aspect correctos y target coherente.
- [ ] Renderer y color management están configurados conscientemente.
- [ ] No hay dos loops compitiendo ni render continuo innecesario.

**C. Assets y calidad visual**
- [ ] Formato GLB/glTF y compresión adecuados.
- [ ] Escala, pivots, normales, UVs y materiales revisados.
- [ ] Texturas tienen resolución y color space correctos.
- [ ] Se comparten assets cuando corresponde.
- [ ] Luz, sombras, fog y tone mapping son coherentes con el estilo.

**D. Interacción y simulación**
- [ ] Input funciona con mouse, teclado y touch objetivo.
- [ ] Raycaster usa canvas rect y objetos pickables.
- [ ] Movimiento independiente de FPS.
- [ ] Física con timestep fijo si corresponde.
- [ ] Controles de cámara no interfieren con gameplay/UI.

**E. Rendimiento**
- [ ] Baseline medido en producción y dispositivo objetivo.
- [ ] Draw calls y triángulos registrados.
- [ ] Instancing/merge/chunks/LOD aplicados según caso.
- [ ] Sombras y postprocessing justificados.
- [ ] Texturas no exceden innecesariamente VRAM.
- [ ] No hay raycasts o cálculos globales redundantes.

**F. Lifecycle y estabilidad**
- [ ] Geometrías, materiales, texturas y render targets propios se liberan.
- [ ] Controles, mixers, observers y listeners se detienen.
- [ ] ImageBitmap y recursos externos tienen cleanup apropiado.
- [ ] Compartidos no se liberan prematuramente.
- [ ] No crecen indefinidamente `renderer.info.memory.geometries/textures` al repetir cambios de escena.
- [ ] No hay errores de WebGL, warnings, recursos 404 o shaders fallidos.

### Severidad

- **P0 — bloqueante:** no renderiza, crash, pérdida de datos, errores graves o controles esenciales rotos.
- **P1 — alto:** caída fuerte de FPS, leaks continuos, modelo/terreno no usable o bug que afecta el loop principal.
- **P2 — medio:** problemas visibles pero con workaround; carga, input o calidad inconsistente.
- **P3 — bajo:** pulido, micro-optimizaciones justificadas, refactor sin impacto inmediato.

### Formato obligatorio del informe

```md
# Three.js Audit

## Contexto y límites
- Tipo de proyecto:
- Versión / renderer:
- Plataforma probada:
- Evidencia disponible:

## Resumen
- Estado general:
- Mayor riesgo:
- Próxima acción recomendada:

## Hallazgos
| ID | Severidad | Área | Evidencia | Impacto | Corrección | Cómo verificar |

## Métricas
- FPS / frame time:
- Draw calls:
- Triángulos:
- Geometrías / texturas:
- Carga inicial:

## Plan priorizado
1. Corregir P0/P1
2. Resolver P2
3. Evaluar P3

## No verificado
Qué requiere ejecutar el proyecto o medir en hardware.
```

No inventes FPS, memoria GPU, polígonos ni errores si no ejecutaste el proyecto o no hay datos. Para screenshots, auditá estética y lectura visual; para código, arquitectura y lifecycle; para una build en ejecución, rendimiento e interacción.

## Fase 13 — Entrega de implementación

Cada implementación debe incluir:

1. Qué se construyó y qué supuestos se tomaron.
2. Archivos creados/modificados y responsabilidad de cada uno.
3. Cómo ejecutar y probar.
4. Controles y comportamiento esperado.
5. Métricas o validaciones realizadas.
6. Limitaciones conocidas y próximos pasos.

No digas que algo está optimizado sin comparar antes/después. No agregues paquetes externos sin explicar por qué son necesarios. Si una decisión técnica no está resuelta, mostrala como decisión pendiente y recomendá una opción con sus tradeoffs.

## Referencias internas

- [Arquitectura y decisiones](references/ARCHITECTURE.md)
- [Patrones de inicio](references/STARTER_PATTERNS.md)
- [Auditoría y performance](references/PERFORMANCE_AUDIT.md)
- [Investigación y fuentes](references/SOURCES.md)
