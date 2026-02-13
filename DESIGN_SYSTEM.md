# KodNest Premium Build System

A premium SaaS design system for a serious B2C product. One mind; no visual drift.

---

## Design philosophy

- **Calm, intentional, coherent, confident**
- Not flashy, not loud, not playful, not hackathon-style
- No gradients, no glassmorphism, no neon colors, no animation noise

---

## Color system

**Maximum 4 colors across the entire system.** All UI must use only these hues; success and warning are muted variants within the same restraint.

| Role       | Token             | Value     | Use                      |
|------------|-------------------|-----------|--------------------------|
| Background | `--kn-background` | `#F7F6F3` | Page and card background |
| Primary text | `--kn-text`     | `#111111` | Headings, body copy      |
| Accent     | `--kn-accent`    | `#8B0000` | Primary actions, focus   |
| Success    | `--kn-success`   | `#4A5D4A` | Success state, shipped  |
| Warning    | `--kn-warning`   | `#7A5F0A` | Warnings only            |

Derivatives allowed: `--kn-text-muted`, `--kn-border`, `--kn-border-focus` (opacity/derivatives of the above; no new hues).

---

## Typography

- **Headings:** Serif font (Georgia / system serif). Large, confident, generous spacing.
- **Body:** Clean sans-serif (Segoe UI / system UI). 16–18px, line-height 1.6–1.8.
- **Max width for text blocks:** 720px.
- No decorative fonts. No random sizes. Use the token scale only.

| Token                | Value   | Use           |
|----------------------|---------|---------------|
| `--kn-size-heading-xl` | 2.25rem | Page headline |
| `--kn-size-heading-lg` | 1.75rem | Section       |
| `--kn-size-heading-md` | 1.375rem | Card title    |
| `--kn-size-body-lg`  | 1.125rem | Lead/subtext  |
| `--kn-size-body`     | 1rem    | Body copy     |

---

## Spacing system

**Only these values.** Never use arbitrary values (e.g. 13px, 27px). Whitespace is part of the design.

| Token         | Value |
|---------------|-------|
| `--kn-space-1` | 8px   |
| `--kn-space-2` | 16px  |
| `--kn-space-3` | 24px  |
| `--kn-space-4` | 40px  |
| `--kn-space-5` | 64px  |

---

## Global layout structure

Every page must follow this order:

1. **Top Bar** → 2. **Context Header** → 3. **Primary Workspace + Secondary Panel** → 4. **Proof Footer**

### Top Bar

- **Left:** Project name
- **Center:** Progress indicator (e.g. “Step X / Y”)
- **Right:** Status badge: `Not Started` | `In Progress` | `Shipped`

### Context Header

- Large serif headline
- One-line subtext
- Clear purpose; no hype language

### Primary Workspace (70% width)

- Main product interaction
- Clean cards, predictable components, no crowding

### Secondary Panel (30% width)

- Short step explanation
- Copyable prompt box
- Buttons: Copy, Build in Lovable, It Worked, Error, Add Screenshot
- Calm styling

### Proof Footer (persistent)

- Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed
- Each checkbox requires user proof input

---

## Component rules

- **Primary button:** Solid deep red (`--kn-accent`). Secondary: outlined, border only.
- **Same hover effect and border radius everywhere:** `--kn-radius: 6px`, `--kn-transition: 180ms ease-in-out`.
- **Inputs:** Clean borders, no heavy shadows, clear focus state (accent border).
- **Cards:** Subtle border only; no drop shadows; padding from spacing scale.

---

## Interaction rules

- **Transitions:** 150–200ms, ease-in-out. No bounce, no parallax.

---

## Error and empty states

- **Errors:** Explain what went wrong and how to fix it. Never blame the user.
- **Empty states:** Provide the next action. Never feel dead.

---

## File structure

```
styles/
  design-tokens.css   # Colors, type, spacing, motion
  layout.css          # Top bar, context header, main, proof footer
  components.css      # Buttons, inputs, cards, badges, messages
  kodnest-design-system.css  # Entry point (imports all)
```

Use `kodnest-design-system.css` as the single stylesheet entry. Build all product UI on top of this system only.
