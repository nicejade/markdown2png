# Home Page Text Alignment & Outer Margin

**Date:** 2026-06-27  
**Status:** Approved  
**Scope:** Main converter mode (`/`)

## Problem

Users of the homepage `#container` document preview have conflicting preferences for body text alignment: some prefer left-aligned text, others prefer justified (两端对齐). The current implementation hardcodes `text-align: justify` on `.markdown` in `markdown.css`, with no user control.

Additionally, outer margin (`--wrapper-padding` on `.warpper`) is bundled into size presets (`SIZES_ARR`), preventing independent control of canvas width and padding.

## Requirements

| Requirement | Decision |
|-------------|----------|
| Alignment options | Two: left, justify |
| Default alignment | Left |
| Alignment UI | `HeadlessSelect` dropdown |
| Outer margin | Independent dropdown, decoupled from size |
| Margin presets | 4 levels: compact / standard / relaxed / wide |
| Default margin | Standard (2rem) |
| Layout | New typography row, visually separate from watermark row |
| Persistence | `localStorage` via `content` Pinia store |
| Export fidelity | Preview and snapdom export must match |

## Recommended Approach

**CSS modifier class + CSS variable** (Option A).

- Remove global `justify` from `.markdown`; default to `left`.
- Apply `.markdown--justify` modifier class when user selects justify.
- Bind `--wrapper-padding` on `#container` from margin selection, independent of size.
- Persist both settings in `content` store + `localStorage`.

### Rejected Alternatives

- **data-* attributes:** No existing convention; adds scattered CSS selectors with no benefit.
- **Inline styles on editor:** Fragile with contenteditable; hard to maintain.

## Data Model

### New constants (`src/helper/constant.ts`)

```ts
export const TEXT_ALIGN = 'text-align'
export const WRAPPER_MARGIN = 'wrapper-margin'

export const TEXT_ALIGN_ARR = [
  { id: 'left', name: '左对齐' },
  { id: 'justify', name: '两端对齐' },
]

export const MARGIN_ARR = [
  { id: 'compact',  name: '紧凑', style: '--wrapper-padding: 1rem;' },
  { id: 'standard', name: '标准', style: '--wrapper-padding: 2rem;' },
  { id: 'relaxed',  name: '宽松', style: '--wrapper-padding: 3rem;' },
  { id: 'wide',     name: '超宽', style: '--wrapper-padding: 4rem;' },
]
```

### Store extension (`src/stores/content.ts`)

| Field | Default | localStorage key |
|-------|---------|------------------|
| `textAlign` | `'left'` | `TEXT_ALIGN` |
| `wrapperMargin` | `'standard'` | `WRAPPER_MARGIN` |

Actions: `updateTextAlign(id)`, `updateWrapperMargin(id)`.

### Size decoupling

Remove `--wrapper-padding` from all `SIZES_ARR` entries. Each size retains only `width` and optional `--markdown-font-size`.

## Styling

### `markdown.css`

```css
.markdown {
  text-align: left;
  /* remove: text-align: justify; text-justify: inter-character; */
}

.markdown--justify {
  text-align: justify;
  text-justify: inter-character;
}
```

### `Home.vue` bindings

```html
<div id="container"
     class="container"
     :style="[currentSizeObj.style, currentMarginObj.style]">

<div id="editor"
     :class="['editor', 'markdown', { 'markdown--justify': textAlign === 'justify' }]">
```

### Unaffected elements

- Date footer: inline `text-align: right` (unchanged)
- Watermark: inline `text-align: center` + `:deep(.home-watermark)` rule (unchanged)
- Headings, lists, paragraphs: inherit parent alignment
- Code blocks / tables: inherit parent alignment

## UI Layout

Operate area reorganized into three rows:

```
Row 1: Theme | Size (mobile only) | Date
Row 2: Text Align | Outer Margin          ← new typography row
Row 3: Copy Image | Save Image | Watermark (mobile only)
```

Row 2 uses `HeadlessSelect` for both controls. Labels: 「文本对齐」「外边距」. Separate flex row with vertical spacing to distinguish from watermark row below.

## Data Flow

```
User selects option
  → store action + localStorage write
  → reactive update on #container style / #editor class
  → imageBlob cache cleared
  → generateContentHash includes textAlign + wrapperMargin
  → optional preGenerateBlob-optional preGenerateBlob()
```

Event handlers follow existing pattern (`handleSelectTheme`): update store, clear cache, debounced pre-generate, GA event.

## Compatibility & Edge Cases

| Scenario | Behavior |
|----------|----------|
| Existing user, no stored preference | Defaults: left align, standard margin |
| Behavior change | Previous implicit default was justify; new default is left per product decision |
| Image export | snapdom captures `#container`; CSS variables and classes apply automatically |
| Content hash | Must include `textAlign` and `wrapperMargin` to invalidate stale blob cache |

## Files to Change

| File | Change |
|------|--------|
| `src/helper/constant.ts` | Add constants, arrays; strip padding from `SIZES_ARR` |
| `src/stores/content.ts` | Add state, actions, localStorage persistence |
| `src/assets/styles/markdown.css` | Default left; add `.markdown--justify` |
| `src/views/Home.vue` | Typography row, bindings, handlers, hash update |
| `CHANGELOG.md` | Document new feature |

## Out of Scope

- Digest page (`/digest`) alignment changes
- Center alignment option
- Per-element alignment overrides (headings, code blocks)
- Desktop visibility fix for size/watermark controls (pre-existing)

## Success Criteria

1. User can switch between left and justify via dropdown; preview updates immediately.
2. User can switch outer margin independently of size; padding changes visibly.
3. Settings persist across page reloads.
4. Exported images reflect alignment and margin choices.
5. Typography row is visually separate from watermark row.
