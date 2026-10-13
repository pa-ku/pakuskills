# Plantilla de tokens (W3C Design Tokens)

```json
{
  "color": {
    "primitive": {
      "brand": { "500": { "$value": "#2563EB", "$type": "color" } },
      "neutral": {
        "50":  { "$value": "#FFFEFC", "$type": "color" },
        "900": { "$value": "#212121", "$type": "color" }
      }
    },
    "semantic": {
      "action-primary": { "$value": "{color.primitive.brand.500}", "$type": "color" },
      "bg":   { "$value": "{color.primitive.neutral.50}",  "$type": "color" },
      "text": { "$value": "{color.primitive.neutral.900}", "$type": "color" },
      "error":   { "$value": "#D32F2F", "$type": "color" },
      "warning": { "$value": "#F9A825", "$type": "color" },
      "success": { "$value": "#2E7D32", "$type": "color" },
      "info":    { "$value": "#1976D2", "$type": "color" }
    }
  },
  "space": {
    "1": { "$value": "8px",  "$type": "dimension" },
    "2": { "$value": "16px", "$type": "dimension" },
    "3": { "$value": "24px", "$type": "dimension" },
    "4": { "$value": "32px", "$type": "dimension" }
  },
  "font": {
    "size": {
      "sm":   { "$value": "12.8px", "$type": "dimension" },
      "base": { "$value": "16px",   "$type": "dimension" },
      "lg":   { "$value": "20px",   "$type": "dimension" },
      "xl":   { "$value": "25px",   "$type": "dimension" }
    }
  },
  "radius": { "md": { "$value": "8px", "$type": "dimension" } }
}
```

Salida: Style Dictionary → CSS variables (`--color-action-primary`) o `tailwind.config`.

## Modo oscuro (sobre tokens semánticos)

Los primitivos no cambian; solo se reasignan los semánticos. Los componentes no se modifican.

```css
:root {
  --color-bg: #FFFEFC;
  --color-text: #212121;
  --color-action-primary: #2563EB;
}
:root[data-theme="dark"] {
  --color-bg: #212121;
  --color-text: #FFFEFC;
  --color-action-primary: #60A5FA; /* verificar contraste AA en ambos modos */
}
/* Opcional: respetar la preferencia del sistema si no hay data-theme */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --color-bg: #212121;
    --color-text: #FFFEFC;
    --color-action-primary: #60A5FA;
  }
}
```

Exponer a Tailwind: v4 con `@theme { --color-action-primary: var(--color-action-primary); ... }` en el CSS; v3 con `theme.extend.colors` apuntando a `var(--color-...)` en `tailwind.config`. Verificar la versión del proyecto.
