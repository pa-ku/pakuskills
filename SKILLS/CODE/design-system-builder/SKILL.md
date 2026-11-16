---
name: design-system-builder
description: Crear, auditar o mejorar un Design System para productos web (React/Next.js/Tailwind). Usar siempre que el usuario mencione design system, sistema de diseño, design tokens, librería de componentes, Storybook, estandarizar UI entre proyectos, guía de estilos con código, paleta/tipografía/espaciado consistente o "unificar componentes", aunque no diga "design system" explícitamente.
---

# Design System Builder

Guía para construir un Design System pragmático: tokens como fuente única, componentes con todos sus estados, documentación viva en Storybook.

## Flujo (seguir en orden)

### 0. Validar necesidad
Preguntar: madurez del producto, tamaño del equipo, cuántos proyectos comparten UI. Si es un MVP o equipo de 1, proponer versión mínima (tokens + 5 componentes) y crecer por versiones. Un DS nunca "se termina".

### 1. Auditoría e inventario UI
La auditoría va antes que cualquier decisión: lo que se construye sale de lo que el producto realmente usa, no de un kit prefabricado. Listar los componentes **reales** del producto (desde el código o capturas, no desde archivos de diseño). Detectar duplicados e inconsistencias. Decidir: mantener / rediseñar / eliminar / crear.

### 2. Foundations → tokens
Definir en `tokens.json` (formato W3C Design Tokens). Ver `references/tokens-template.md`.
- **Espaciado:** base 8px; escala = base × (0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 20).
- **Color:** marca, énfasis, secundarios, neutros, funcionales (error/aviso/éxito/info). Variantes dark/main/light/faded. Contraste **WCAG AA** obligatorio. Evitar #000/#FFF puros.
- **Tipografía:** 2 fuentes, escala de ~8 tamaños (base 16px × 0.64, 0.8, 1, 1.25, 1.563, 1.953, 2.441, 3.052), interlineado alineado al grid.
- **Grid:** 4 breakpoints, 12 columnas (8 tablet, 4 móvil), gutters 24/16px.
- **Iconos:** nombrar por acción ("eliminar"), caja 24×24. **Motion:** duraciones y easing.
- Tokens en dos capas: *primitivos* (`blue-500`) y *semánticos* (`color-action-primary`). Modos claro/oscuro sobre los semánticos: en código se resuelven redefiniendo las variables CSS semánticas bajo `[data-theme="dark"]` (o `prefers-color-scheme`), sin tocar los componentes (ejemplo en `references/tokens-template.md`). Exponer los tokens a Tailwind según la versión del proyecto: `@theme` en CSS (v4) o `tailwind.config` (v3); verificarla antes de dar instrucciones.

### 3. Componentes (Atomic Design)
Átomos → moléculas → organismos. Cada componente debe cubrir **todos sus estados**: default, hover, focus, active, disabled, loading, error, success. Base mínima: Button, Link, Input, Checkbox/Radio, Modal, Toast, Card, Tabs.
Checklist por componente: ver `references/component-checklist.md`.

**Variantes en React (Tailwind):** usar `cva` (Class Variance Authority) para declarar variantes y tamaños tipados, combinado con `clsx` + `tailwind-merge` en una utilidad `cn()` para fusionar clases sin conflictos y permitir `className` externo. Las variantes consumen solo clases basadas en tokens semánticos. Tipar props con `VariantProps<typeof xVariants>`. En un MVP o equipo de una persona basta `cva` + `cn()`. Ejemplo en `references/react-patterns.md`.

**Primitivos headless:** para componentes con accesibilidad compleja (Modal/Dialog, Tabs, Dropdown/Menu, Select, Popover, Tooltip, Accordion) **no construir desde cero**: envolver primitivos headless (Radix UI o Headless UI; React Aria como alternativa) y aplicar encima los tokens del sistema. Ellos resuelven foco atrapado, teclado, ARIA y portales. Componentes simples (Button, Card, Input) pueden ser propios, y en un MVP los primitivos se incorporan cuando aparece el primer componente complejo. Elegir una sola librería de primitivos por sistema y adaptarla al stack del usuario.

### 4. Patterns
Combinar componentes en módulos reutilizables (header, formulario, tabla con filtros).

### 5. Nomenclatura
Un solo nombre en diseño y código. Proponerla y pedir confirmación al usuario.

### 6. Documentación con Storybook
Recomendado para stacks React/Next.js. Cada componente: nombre, cuándo usarlo y cuándo no, props, estados, ejemplo de código. Usar `autodocs`. Docs: https://storybook.js.org/docs
Comandos base:
```bash
npx storybook@latest init
```
Verificar la versión y el flujo actual en la documentación oficial antes de dar instrucciones detalladas.

**Pruebas automáticas dentro de Storybook:**
- *Accesibilidad:* `@storybook/addon-a11y` (axe) en cada story; fallar el CI ante violaciones AA.
- *Interacción:* funciones `play` con `@storybook/test` (`userEvent`, `expect`, `within`) para validar teclado, foco, apertura/cierre y estados (disabled, error, loading). En Storybook 9+ estas utilidades se importan desde `storybook/test`: confirmar en la documentación oficial.
- Ejecutarlas en CI con el test runner / modo Vitest de Storybook. Detalle en `references/react-patterns.md`.

### 7. Sincronía diseño ↔ código
Figma Variables (con modos) → Tokens Studio → Style Dictionary → CSS variables / Tailwind config. Si no se usa Figma, `tokens.json` es la fuente de verdad.

### 8. Testeo y lanzamiento
- Probar **coherencia** (no solo consistencia) con prototipos o usuarios reales.
- Presentarlo al equipo con ahorro estimado en tiempo/costes.
- Versionado semántico y changelog.

### 9. Mantenimiento
Asignar un responsable. Proceso para pedir nuevos componentes. Deprecar antes de eliminar. Auditar periódicamente.

## Entregables típicos
1. `tokens.json` + salida CSS/Tailwind
2. Componentes base en React con todos sus estados (variantes con `cva`, primitivos headless donde aplique)
3. Storybook configurado con autodocs + pruebas de accesibilidad e interacción
4. Documento de nomenclatura y guías de uso
5. Plan de mantenimiento

## Reglas
- Empezar chico; priorizar lo que más se repite en el producto.
- No inventar componentes que el producto no usa.
- Accesibilidad (AA, foco visible, navegación por teclado) desde el inicio.
- Adaptar al stack del usuario antes de proponer herramientas.
- No reimplementar a mano la accesibilidad de componentes complejos: usar primitivos headless.
- Preferir variantes tipadas (`cva`) a concatenar strings de clases a mano.
- Construir a partir de la auditoría del producto; no instalar un kit prefabricado (p. ej. shadcn/ui) como punto de partida.
