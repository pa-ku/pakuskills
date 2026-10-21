# Atomic Design examples

Contents: Quarks, Atoms, Molecules, Organisms, Templates and pages, Anti-patterns

## Quarks

```ts
// src/quarks/colors.ts
export const colors = {
  primary: { 50: '#e3f2fd', 500: '#2196f3', 900: '#0d47a1' },
  neutral: { 0: '#ffffff', 100: '#f5f5f5', 900: '#212121' },
};

// src/quarks/spacing.ts
export const spacing = { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' };

// src/quarks/typography.ts
export const typography = {
  fontFamily: { sans: 'Inter, system-ui, sans-serif', mono: 'Fira Code, monospace' },
  fontSize: { xs: '12px', sm: '14px', base: '16px', lg: '18px', xl: '24px' },
};
```

CSS variables work equally well and make runtime theming easier. Pick one approach per project.

## Atoms

```tsx
import styled from 'styled-components';
import { colors, spacing, typography } from '@/quarks';

export const Button = styled.button`
  /* tokens come from quarks */
  background-color: ${colors.primary[500]};
  padding: ${spacing.sm} ${spacing.md};
  font-family: ${typography.fontFamily.sans};
  font-size: ${typography.fontSize.base};
`;
```

Atoms get processed data, never fetch it:

```tsx
// Good
const PriceButton = ({ price, onClick }) => <Button onClick={onClick}>${price}</Button>;
```

## Molecules

```tsx
import { Label, Input } from '@/components/atoms';

export const FormField = ({ label, id, error, ...inputProps }) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} aria-invalid={!!error} {...inputProps} />
    {error && <span role="alert">{error}</span>}
  </div>
);
```

## Organisms

```tsx
import { Logo } from '@/components/atoms';
import { Navigation, SearchForm, UserMenu } from '@/components/molecules';

export const Header = ({ user, navigation, onLogout, onSearch }) => (
  <header>
    <Logo />
    <Navigation items={navigation} />
    <SearchForm onSubmit={onSearch} />
    <UserMenu user={user} onLogout={onLogout} />
  </header>
);
```

Data logic lives here or above:

```tsx
const ProductCard = ({ productId }) => {
  const { product } = useProduct(productId);
  return <PriceButton price={product.price} onClick={() => addToCart(product)} />;
};
```

## Templates and pages

```tsx
// template: structure and slots, no data
export const MainLayout = ({ children }) => (
  <div>
    <Header {...placeholderHeaderProps} />
    <main>{children}</main>
    <Footer />
  </div>
);

// page: template + real data
export const HomePage = () => {
  const { user } = useSession();
  const { items } = useFeaturedProducts();
  return (
    <MainLayout>
      <ProductGrid items={items} />
    </MainLayout>
  );
};
```

## Anti-patterns

```tsx
// atoms/Button.tsx
import { FormField } from '../molecules';   // upward import: wrong

// molecules/SearchForm.tsx
import { Header } from '../organisms';      // upward import: wrong

// atoms/PriceButton.tsx
const price = useProductPrice(productId);   // data fetching in an atom: wrong
```

Fixes: pass values as props or slots, move the logic up to an organism, or move the component to the correct level.
