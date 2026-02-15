# KodNest Premium Build System - Quick Reference

## CSS Classes

### Layout
- `.top-bar` - Top navigation bar
- `.top-bar__project-name` - Project name (left)
- `.top-bar__progress` - Progress indicator (center)
- `.top-bar__status` - Status badge (right)
  - `.top-bar__status--not-started`
  - `.top-bar__status--in-progress`
  - `.top-bar__status--shipped`
- `.context-header` - Context header section
- `.context-header__headline` - Main headline (serif)
- `.context-header__subtext` - Subtext below headline
- `.main-container` - Flex container for workspace + panel
- `.primary-workspace` - Main content area (70%)
- `.secondary-panel` - Side panel (30%)
- `.proof-footer` - Persistent footer with checklist

### Components
- `.btn` - Base button
  - `.btn--primary` - Solid deep red
  - `.btn--secondary` - Outlined
  - `.btn--small` - Smaller size
  - `.btn--large` - Larger size
- `.card` - Card container
  - `.card__header` - Card header
  - `.card__title` - Card title
  - `.card__body` - Card content
  - `.card__footer` - Card footer
- `.badge` - Status badge
  - `.badge--success` - Success variant
  - `.badge--warning` - Warning variant
  - `.badge--accent` - Accent variant
- `.input`, `.textarea`, `.select` - Form inputs
- `.form-group` - Form field wrapper
  - `.form-group__label` - Field label
  - `.form-group__help` - Help text
- `.prompt-box` - Copyable code/prompt box
- `.step-explanation` - Step instructions panel
- `.action-buttons` - Button group container
- `.error-state` - Error message container
- `.empty-state` - Empty state container
- `.proof-checklist` - Checklist container
  - `.proof-checklist__item` - Checklist item
  - `.proof-checklist__checkbox` - Checkbox input
  - `.proof-checklist__label` - Checkbox label
  - `.proof-checklist__input` - Proof input field

## CSS Variables

### Colors
```css
--color-bg: #F7F6F3
--color-text-primary: #111111
--color-accent: #8B0000
--color-success: #4A6741
--color-warning: #B8860B
```

### Spacing
```css
--spacing-xs: 8px
--spacing-sm: 16px
--spacing-md: 24px
--spacing-lg: 40px
--spacing-xl: 64px
```

### Typography
```css
--font-heading: serif (Georgia/Times)
--font-body: sans-serif (system fonts)
--font-size-body: 17px
--line-height-body: 1.7
--max-width-text: 720px
```

### Transitions
```css
--transition-fast: 150ms ease-in-out
--transition-base: 200ms ease-in-out
```

## HTML Structure Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="design-system/kodnest.css">
</head>
<body>
  <!-- Top Bar -->
  <header class="top-bar">
    <div class="top-bar__project-name">Project Name</div>
    <div class="top-bar__progress">Step X / Y</div>
    <div class="top-bar__status top-bar__status--in-progress">In Progress</div>
  </header>

  <!-- Context Header -->
  <section class="context-header">
    <h1 class="context-header__headline">Page Title</h1>
    <p class="context-header__subtext">One-line description.</p>
  </section>

  <!-- Main Container -->
  <div class="main-container">
    <!-- Primary Workspace (70%) -->
    <main class="primary-workspace">
      <!-- Your main content here -->
    </main>

    <!-- Secondary Panel (30%) -->
    <aside class="secondary-panel">
      <!-- Step explanation, prompts, buttons -->
    </aside>
  </div>

  <!-- Proof Footer -->
  <footer class="proof-footer">
    <!-- Checklist -->
  </footer>
</body>
</html>
```

## Design Rules

1. **Never use random spacing** - Only: 8px, 16px, 24px, 40px, 64px
2. **No gradients** - Solid colors only
3. **No glassmorphism** - Solid backgrounds
4. **No neon colors** - Muted palette only
5. **No animation noise** - Subtle transitions only (150-200ms)
6. **Consistent border radius** - Use CSS variables
7. **Text blocks max width** - 720px for readability
8. **Whitespace is design** - Use spacing system consistently
