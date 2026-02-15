# KodNest Premium Build System

A premium SaaS design system built with calm, intentional, coherent, and confident design principles.

## Design Philosophy

- **Calm**: No flashy animations or distracting elements
- **Intentional**: Every element serves a purpose
- **Coherent**: Consistent patterns throughout
- **Confident**: Strong typography and clear hierarchy

## Color System

Maximum 4 colors across the entire system:

- **Background**: `#F7F6F3` (off-white)
- **Primary Text**: `#111111`
- **Accent**: `#8B0000` (deep red)
- **Success**: `#4A6741` (muted green)
- **Warning**: `#B8860B` (muted amber)

## Typography

- **Headings**: Serif font (Georgia/Times), large, confident, generous spacing
- **Body**: Clean sans-serif, 16-18px, line-height 1.6-1.8, max 720px width

## Spacing System

Consistent scale only: `8px`, `16px`, `24px`, `40px`, `64px`

Never use random spacing values.

## Global Layout Structure

Every page follows this structure:

```
[Top Bar] → [Context Header] → [Primary Workspace + Secondary Panel] → [Proof Footer]
```

### Top Bar
- Left: Project name
- Center: Progress indicator (Step X / Y)
- Right: Status badge (Not Started / In Progress / Shipped)

### Context Header
- Large serif headline
- 1-line subtext
- Clear purpose, no hype language

### Primary Workspace (70% width)
- Main product interaction area
- Clean cards, predictable components

### Secondary Panel (30% width)
- Step explanation (short)
- Copyable prompt box
- Action buttons: Copy, Build in Lovable, It Worked, Error, Add Screenshot

### Proof Footer (persistent bottom)
- Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed
- Each checkbox requires user proof input

## Components

### Buttons
- **Primary**: Solid deep red (`btn--primary`)
- **Secondary**: Outlined (`btn--secondary`)
- Same hover effect and border radius everywhere
- Transitions: 150-200ms, ease-in-out

### Inputs
- Clean borders
- No heavy shadows
- Clear focus state
- Border color changes on focus

### Cards
- Subtle border
- No drop shadows
- Balanced padding
- Hover: slight border color change

### Badges
- Status indicators
- Variants: default, success, warning, accent

## Interaction Rules

- Transitions: 150-200ms, ease-in-out
- No bounce, no parallax
- Consistent hover states

## Error & Empty States

- **Errors**: Explain what went wrong + how to fix, never blame user
- **Empty States**: Provide next action, never feel dead

## Usage

Include the main stylesheet:

```html
<link rel="stylesheet" href="design-system/kodnest.css">
```

Or import in your CSS:

```css
@import './design-system/kodnest.css';
```

## File Structure

```
design-system/
├── tokens.css      # Design tokens (colors, typography, spacing)
├── base.css        # Reset and foundational styles
├── layout.css      # Layout components
├── components.css  # Component styles
├── kodnest.css     # Main stylesheet (imports all)
├── example.html    # Example implementation
└── README.md       # This file
```

## Principles

1. **No visual drift**: Everything feels like one mind designed it
2. **Whitespace is design**: Use spacing system consistently
3. **Predictable patterns**: Same components behave the same way
4. **Accessible**: Clear focus states, semantic HTML
5. **Performance**: Minimal CSS, efficient selectors
