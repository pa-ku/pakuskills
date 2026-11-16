# Checklist por componente

- [ ] Nombre acordado (igual en Figma y código)
- [ ] Descripción: cuándo usar / cuándo NO usar
- [ ] Variantes (primary/secondary, tamaños) declaradas con `cva` y tipadas
- [ ] Componente complejo basado en primitivo headless (Radix / Headless UI), no hecho desde cero
- [ ] `className` externo fusionado con `cn()` (clsx + tailwind-merge)
- [ ] Estados: default, hover, focus, active, disabled, loading, error, success
- [ ] Solo usa tokens (sin valores hardcodeados)
- [ ] Contraste AA verificado
- [ ] Foco visible y navegación por teclado
- [ ] Atributos ARIA cuando corresponda
- [ ] Responsive (móvil/tablet/escritorio)
- [ ] Story en Storybook con autodocs
- [ ] Pruebas: a11y (`@storybook/addon-a11y`) y `play` de interacción (`@storybook/test`)
- [ ] Ejemplo de código copiable
