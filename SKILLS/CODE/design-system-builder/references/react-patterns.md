# Patrones React: variantes, primitivos headless y pruebas

Verificar versiones vigentes en la documentación oficial (en particular `tailwind-merge` según la versión de Tailwind, y las rutas de importación de Storybook).

## 1. Utilidad `cn()`

```bash
npm i class-variance-authority clsx tailwind-merge
```

```ts
// lib/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

## 2. Variantes tipadas con `cva`

Las clases usan tokens semánticos (expuestos como utilidades de Tailwind), nunca valores hardcodeados.

```tsx
// components/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-action-primary text-on-action hover:bg-action-primary-hover",
        secondary: "bg-surface-muted text-text hover:bg-surface-muted-hover",
        danger: "bg-error text-on-error hover:bg-error-hover",
      },
      size: { sm: "h-8 px-3 text-sm", md: "h-10 px-4 text-base", lg: "h-12 px-6 text-lg" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

Estados `loading`/`error` que no son variantes visuales puras: modelarlos como props (`loading`, `aria-invalid`) y estilizarlos con `data-*` o `aria-*` selectors.

## 3. Primitivos headless con tokens del sistema

Cuándo: Modal/Dialog, Tabs, Dropdown/Menu, Select, Popover, Tooltip, Accordion.

```tsx
// components/dialog.tsx (envoltorio sobre Radix)
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({ className, children, ...props }: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-overlay" />
      <DialogPrimitive.Content
        className={cn("fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface p-6 shadow-lg", className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
```

Reglas:
- El primitivo aporta comportamiento y ARIA; el sistema aporta estilos (tokens) y API pública.
- Re-exportar con el nombre acordado del sistema; el resto del producto nunca importa el primitivo directo.
- Mantener `Title` y `Description` obligatorios en Dialog para accesibilidad.
- Una sola librería de primitivos por sistema.

## 4. Pruebas en Storybook

```bash
npm i -D @storybook/addon-a11y
```

```ts
// .storybook/main.ts
addons: ["@storybook/addon-a11y" /* , ...otros */]
```

Prueba de interacción con `play`:

```tsx
// button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within, fn } from "@storybook/test"; // Storybook 9+: "storybook/test"
import { Button } from "./button";

const meta = { component: Button, tags: ["autodocs"] } satisfies Meta<typeof Button>;
export default meta;

export const Primary: StoryObj<typeof meta> = {
  args: { children: "Guardar", onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole("button", { name: "Guardar" });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
```

Buenas prácticas:
- Una story por estado relevante (disabled, error, loading) y `play` para flujos con teclado (Tab, Enter, Escape, flechas).
- Panel a11y para revisión manual; en CI correr el test runner de Storybook para que las violaciones axe y los `play` fallidos rompan el build.
- Contraste en dark/light: probar ambos modos con un decorator de tema.
