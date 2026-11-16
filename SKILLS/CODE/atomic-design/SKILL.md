---
name: atomic-design
description: Organize, review, or scaffold UI components using Atomic Design (quarks, atoms, molecules, organisms, templates, pages). Use whenever the user creates or refactors a component library or design system, asks where a component belongs, audits import direction between component folders, sets up design tokens, or mentions atoms/molecules/organisms, Brad Frost, or Storybook structure. Applies even if they do not say "atomic design" explicitly but are structuring components in layers.
---

# Atomic Design

Brad Frost's methodology plus one extra level, **quarks** (design tokens). The only thing that matters in practice: each level has one job, and **imports only flow downward**.

## Levels

| Level | Job | Has logic? |
|---|---|---|
| quarks | Raw design tokens: colors, spacing, type scale, radii, shadows, motion, breakpoints. Not components. | No |
| atoms | Smallest usable UI element (Button, Input, Label, Icon, Avatar). Styled via quarks. | No. Props in, markup out |
| molecules | A few atoms with one purpose (FormField, SearchForm, NavItem, MediaObject). | Minimal local UI state only |
| organisms | Distinct interface section (Header, Footer, ProductCard, CommentList). | Yes: data, domain logic, side effects |
| templates | Page layout skeleton with content slots and placeholder content. | No data fetching |
| pages | A template filled with real data. The only level tied to routes and data sources. | Yes |

## Import rules

| Level | May import from |
|---|---|
| quarks | nothing |
| atoms | quarks |
| molecules | quarks, atoms |
| organisms | quarks, atoms, molecules, other organisms |
| templates | quarks, atoms, molecules, organisms |
| pages | everything below |

Notes:
- Templates may use atoms/molecules directly for structural bits (a `Container`, a `<main>` wrapper). They do not need to go through an organism.
- Avoid molecule-to-molecule imports. If you need one, the inner one is probably an atom, or the outer one is an organism.
- Never import upward. If a lower level "needs" something from above, pass it as a prop or slot (`children`, render prop) instead.

## Deciding where a component goes

Ask in order, stop at the first yes:
1. Is it a raw value, not something rendered? -> quark
2. Can it not be split without losing meaning? -> atom
3. Is it a small group of atoms with a single purpose? -> molecule
4. Does it own data, domain logic, or a whole interface section? -> organism
5. Is it page structure with no real content? -> template
6. Is it a template bound to real data or a route? -> page

Granularity check: if a "component" is just a wrapper around one element with no variants or behavior (`ButtonText`, `ButtonContainer`), don't make it an atom. If one component holds several labeled inputs plus a submit button inline, split it into molecules.

## Conventions

- Tokens live in `src/quarks/` (one name everywhere; do not mix `design-tokens/` and `quarks/`).
- One folder per component, PascalCase, with a barrel `index.ts`. Colocate test and story files.
- Props flow down: atoms take primitives and callbacks, molecules compose atom props, organisms take domain objects, templates take slots.
- Business logic (fetching, pricing, auth) starts at organisms. Atoms receive already-processed data.

```text
src/
  quarks/            colors.ts spacing.ts typography.ts ...
  components/
    atoms/Button/    Button.tsx Button.test.tsx Button.stories.tsx index.ts
    molecules/
    organisms/
    templates/
    pages/
```

Feature-based variant: keep `quarks/` and shared atoms/molecules global, and put feature-specific organisms, templates, and pages under `features/<name>/`.

## Enforcing it

Use `eslint-plugin-atomic-design` with the `hierarchical-import` rule. Verify the package name and current options on npm before adding it, then set levels to `["quarks", "atoms", "molecules", "=organisms", "templates", "pages"]` (the `=` allows organism-to-organism imports). Adjust the path patterns if the project uses a non-standard layout.

## Auditing an existing codebase

1. List component folders and map each to a level.
2. Grep imports in each level for anything pointing upward or skipping to a forbidden level.
3. Flag atoms containing hooks that fetch data, and organisms that are really molecules.
4. Report violations grouped by level with a suggested fix (move, split, or pass via props).

For code examples of each level, anti-patterns, and token setup, read `references/examples.md`.
