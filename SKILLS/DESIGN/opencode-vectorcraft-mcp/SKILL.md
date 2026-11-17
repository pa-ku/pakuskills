---
name: opencode-vectorcraft-mcp
description: Instala y conecta el servidor MCP de VectorCraft en OpenCode V2, verifica la conexión, elige entre modo headless y app de escritorio, y confina o limita las herramientas del agente. Incluye el diagnóstico de los errores típicos de configuración.
---

# Conectar OpenCode con VectorCraft

VectorCraft expone un servidor MCP por stdio (`vectorcraft-cli mcp`) con ~33 herramientas para
dibujar, consultar el documento, exportar y manejar la app de escritorio. Esta skill cubre solo la
conexión y su diagnóstico; el trabajo de diseño está en la skill `vectorcraft-sticker-sheet`.

## Cuándo usar esta skill

- "No me aparece VectorCraft en OpenCode" / "¿cómo conecto el MCP?".
- Hay que reinstalar `vectorcraft-cli` o mover el binario.
- Hay que limitar qué carpetas puede tocar el agente.
- Las herramientas de UI (`inspect_ui`, `type_text`, `open_panel`) fallan.

## Paso 1 — Verificar el binario

```sh
command -v vectorcraft-cli      # normalmente /usr/bin/vectorcraft-cli
vectorcraft-cli --version       # p. ej. 0.24.1
dpkg -S /usr/bin/vectorcraft-cli  # si vino del paquete .deb "vectorcraft"
```

Si no está instalado, hay dos caminos:

```sh
# paquete del sistema (preferido en Linux)
sudo dpkg -i vectorcraft_<version>_amd64.deb

# o compilar desde el código
git clone https://github.com/storytold/vectorcraft
cd vectorcraft && cargo build --release -p vectorcraft-cli
# binario: target/release/vectorcraft-cli
```

## Paso 2 — Registrar el servidor MCP

La vía recomendada es el CLI, que respeta el resto de la configuración:

```sh
opencode mcp add vectorcraft --global -- /usr/bin/vectorcraft-cli mcp
```

`--global` escribe en `~/.config/opencode/opencode.json`. Sin `--global` escribe en el
`opencode.json` del proyecto actual.

Equivalente manual (**OpenCode V2**):

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "servers": {
      "vectorcraft": {
        "type": "local",
        "command": ["/usr/bin/vectorcraft-cli", "mcp"]
      }
    }
  }
}
```

⚠️ **Muchas guías que circulan son de V1** y dicen `"mcp": { "vectorcraft": {...} }` con
`"enabled": true`. En V2 los servidores van bajo **`mcp.servers`** y el campo `enabled` no existe:
para dejar uno configurado sin conectar se usa `"disabled": true`.

## Paso 3 — Verificar

```sh
opencode mcp list
# ✓ vectorcraft  connected
```

Prueba funcional de solo lectura (dentro de `execute`):

```js
await tools.vectorcraft.command_list({ brief: true, filter: "export" })
await tools.vectorcraft.doc_inspect({ depth: 0 })
```

Si responde, el servidor está operativo. OpenCode además agrega las instrucciones del servidor al
system prompt, así que los tools aparecen agrupados como `tools.vectorcraft.*` (Code Mode).

## Paso 4 — Elegir el backend

| Modo | Cómo | Qué permite |
| --- | --- | --- |
| **App de escritorio** | `vectorcraft --control 7979`, y el MCP sin flags | Todo: UI, paneles, diálogos, teclado, capturas de ventana |
| **Headless** | automático si no hay app en `127.0.0.1:7979` | Dibujar, abrir, guardar, exportar, inspeccionar. Las tools de UI fallan |

Al conectar, comprobar cuál está activo: `inspect_ui` funciona solo contra la app.
Si nada escucha en el puerto, el MCP cae a headless en silencio (no es un error).

## Paso 5 — Confinar carpetas o limitar herramientas

**Carpetas** (recomendado si el agente no debe salir del proyecto):

```jsonc
"command": [
  "/usr/bin/vectorcraft-cli", "mcp",
  "--automation-read-root", "/media/apku/Data/DESIGN",
  "--automation-write-root", "/media/apku/Data/DESIGN"
]
```

Cada flag se puede repetir. Ausente un tipo, ese acceso no se concede. **Implican `--headless`**:
no se combinan con la app por el puerto; en ese caso los límites se le pasan a
`vectorcraft --control PORT --automation-read-root ...`.

**`--allow-plugin-grants`**: permite instalar plug-ins y aceptar sus permisos sin aprobación
humana. No usarlo salvo que se sepa lo que implica, y nunca junto con los roots (son excluyentes).

**Ocultar herramientas sin desconectar el servidor**:

```jsonc
"permissions": [
  { "action": "vectorcraft_ui_screenshot", "resource": "*", "effect": "deny" }
]
```

## Notas de V2

- Los cambios de configuración **se aplican en caliente**; no hace falta reiniciar. Para forzar,
  `/reload`. Reiniciar el servicio (`opencode service restart`) es solo para problemas de servicio.
- `codemode: false` expone las tools en la lista nativa del proveedor en vez de agruparlas en
  `execute`. Por defecto van en Code Mode.

## Diagnóstico

| Síntoma | Causa probable | Arreglo |
| --- | --- | --- |
| `No MCP servers configured` justo después de `add` | lectura temprana / caché del CLI | volver a correr `opencode mcp list`; verificar que el JSON tenga `mcp.servers` |
| `connected` pero `inspect_ui` da error | no hay app en `7979` | abrir `vectorcraft --control 7979` |
| El servidor no arranca | ruta equivocada o binario sin permiso | probar `vectorcraft-cli --version` con la ruta exacta |
| Aparece en el JSON y no conecta | sintaxis V1 (`mcp.vectorcraft`, `enabled`) | mover a `mcp.servers` y quitar `enabled` |
| El agente no puede abrir un archivo | roots de automatización | agregar `--automation-read-root` con esa carpeta |
| Funciona en un proyecto y en otro no | se agregó sin `--global` | repetir con `--global` o copiar la entrada |

## Checklist de conexión

- [ ] `vectorcraft-cli --version` responde
- [ ] `opencode mcp list` muestra `✓ vectorcraft connected`
- [ ] `command_list` devuelve comandos
- [ ] se sabe si el backend es app o headless
- [ ] si hay roots, el proyecto está dentro de ellos
