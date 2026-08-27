# Theme guide

## Import

```tsx
import { useTheme, useThemedStyles, AppTheme } from '../../theme';
```

## Pattern

```tsx
const MyScreen = () => {
  const { colors, isTablet, isLandscape } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Hello</Text>
    </View>
  );
};

const createStyles = ({ spacing, colors, radius, typography, shadow }: AppTheme) => ({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    color: colors.text,
  },
});
```

## Rules

1. **No raw numbers or hex.** Always `spacing.md`, `colors.text` — never `16`, `'#1A1A1A'`.
2. **Never call `moderateScale()` yourself.** Already baked into `spacing` / `radius` / `iconSize`.
3. **`isTablet` / `isLandscape` = layout shape only**, never sizing. `flexDirection: isTablet ? 'row' : 'column'` ✅ — `padding: isTablet ? 20 : 16` ❌
4. **Styles always via `createStyles(theme)` + `useThemedStyles`** — no inline style objects.
5. **Reuse `<Button />` / `<AppText />`** instead of hand-rolled primitives.
6. **Elevation via `shadow.sm/md/lg`**, never hand-written `shadowColor`/`elevation`. Needs a solid `backgroundColor` to render. Don't combine with a visible border.

## Tokens

| Need | Token |
|---|---|
| Spacing | `spacing.xs/sm/md/lg/xl/xxl` |
| Radius | `radius.sm/md/lg/xl/full` |
| Icon size | `iconSize.xs/sm/md/lg/xl` |
| Font size | `typography.fontSize.sm/md/lg/xl/xxl/xxxl` |
| Text style | `typography.variants.h1/h2/subtitle/body/caption` |
| Color | `colors.text/textLight/background/surface/border/primary/error/...` |
| Shadow | `shadow.sm/md/lg` |
| Device (layout only) | `isTablet`, `isLandscape` |

## Checklist

- [ ] No raw numbers/hex
- [ ] No manual `moderateScale()`
- [ ] Styles via `createStyles` + `useThemedStyles`
- [ ] `isTablet`/`isLandscape` used for structure only
- [ ] Reused `<Button />` / `<AppText />`
- [ ] Elevation via `shadow.x`, not hand-written