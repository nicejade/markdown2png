# Home Text Alignment & Outer Margin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let homepage users choose left vs justified text alignment and independent outer margin presets, persisted in localStorage and reflected in image export.

**Architecture:** CSS modifier class (`.markdown--justify`) toggles alignment; CSS variable (`--wrapper-padding`) on `#container` controls outer margin, decoupled from size. Pinia `content` store holds both settings with localStorage persistence. A new typography row in the operate area hosts two `HeadlessSelect` dropdowns, separate from the watermark row.

**Tech Stack:** Vue 3, TypeScript, Pinia, TailwindCSS, HeadlessSelect component, snapdom

**Spec:** `docs/superpowers/specs/2026-06-27-home-text-align-margin-design.md`

---

## File Map

| File | Responsibility |
|------|----------------|
| `src/helper/constant.ts` | New storage keys, option arrays; remove padding from `SIZES_ARR` |
| `src/stores/content.ts` | State + actions for `textAlign` and `wrapperMargin` |
| `src/assets/styles/markdown.css` | Default left align; `.markdown--justify` modifier |
| `src/views/Home.vue` | UI row, computed props, event handlers, template bindings, hash update |
| `CHANGELOG.md` | Feature changelog entry |

---

### Task 1: Add constants and decouple size from padding

**Files:**
- Modify: `src/helper/constant.ts`

- [ ] **Step 1: Add storage keys and option arrays**

After the existing `CURRENT_SIZE` export, add:

```ts
export const TEXT_ALIGN = 'text-align'

export const WRAPPER_MARGIN = 'wrapper-margin'

export const TEXT_ALIGN_ARR = [
  { id: 'left', name: '左对齐' },
  { id: 'justify', name: '两端对齐' },
]

export const MARGIN_ARR = [
  { id: 'compact', name: '紧凑', style: '--wrapper-padding: 1rem;' },
  { id: 'standard', name: '标准', style: '--wrapper-padding: 2rem;' },
  { id: 'relaxed', name: '宽松', style: '--wrapper-padding: 3rem;' },
  { id: 'wide', name: '超宽', style: '--wrapper-padding: 4rem;' },
]
```

- [ ] **Step 2: Remove `--wrapper-padding` from `SIZES_ARR`**

Replace each entry's `style` to drop padding:

```ts
export const SIZES_ARR = [
  {
    name: '电脑端',
    id: 'laptop',
    style: 'width: 50rem;',
  },
  {
    name: '移动端',
    id: 'mobile',
    style: 'width: 20rem; --markdown-font-size: 0.9rem;',
  },
  {
    name: '平板端',
    id: 'tablet',
    style: 'width: 37.5rem;',
  },
  {
    name: '超级屏',
    id: 'desktop',
    style: 'width: 60rem;',
  },
]
```

- [ ] **Step 3: Run type check**

Run: `pnpm type-check`
Expected: PASS (no consumers yet, but no syntax errors)

- [ ] **Step 4: Commit**

```bash
git add src/helper/constant.ts
git commit -m "feat: add text align and margin constants, decouple size padding"
```

---

### Task 2: Extend content store

**Files:**
- Modify: `src/stores/content.ts`

- [ ] **Step 1: Update imports**

Change the import line to include new constants:

```ts
import { DEFAULT_TEXT, CURRENT_CONTENT, HAVE_DATE, HAVE_WATERMARK, CURRENT_THEME, CURRENT_SIZE, TEXT_ALIGN, WRAPPER_MARGIN, THEME_ARR, SIZES_ARR } from './../helper/constant'
```

- [ ] **Step 2: Add state fields**

Inside `state()`, add after `currentSize`:

```ts
textAlign: localStorage.getItem(TEXT_ALIGN) || 'left',
wrapperMargin: localStorage.getItem(WRAPPER_MARGIN) || 'standard',
```

- [ ] **Step 3: Add actions**

Inside `actions`, after `updateCurrentSize`:

```ts
updateTextAlign(id: string) {
  this.textAlign = id
  localStorage.setItem(TEXT_ALIGN, id)
},

updateWrapperMargin(id: string) {
  this.wrapperMargin = id
  localStorage.setItem(WRAPPER_MARGIN, id)
},
```

- [ ] **Step 4: Run type check**

Run: `pnpm type-check`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/stores/content.ts
git commit -m "feat: persist text align and wrapper margin in content store"
```

---

### Task 3: Update markdown styles

**Files:**
- Modify: `src/assets/styles/markdown.css`

- [ ] **Step 1: Change default alignment to left**

In the `.markdown` block (lines 13–28), replace:

```css
  text-align: justify;
  text-justify: inter-character;
```

with:

```css
  text-align: left;
```

- [ ] **Step 2: Add justify modifier class**

After the `.markdown` block closing brace, add:

```css
.markdown--justify {
  text-align: justify;
  text-justify: inter-character;
}
```

- [ ] **Step 3: Visual smoke test**

Run: `pnpm dev`
Open: `http://localhost:5173/`
Expected: Body text is left-aligned by default (before Home.vue wiring, no toggle yet)

- [ ] **Step 4: Commit**

```bash
git add src/assets/styles/markdown.css
git commit -m "feat: default markdown to left align, add justify modifier"
```

---

### Task 4: Wire Home.vue — script layer

**Files:**
- Modify: `src/views/Home.vue`

- [ ] **Step 1: Update imports**

Change constant import to include new arrays:

```ts
import { THEME_ARR, SIZES_ARR, TEXT_ALIGN_ARR, MARGIN_ARR } from './../helper/constant'
```

- [ ] **Step 2: Add store refs**

After `let { currentSize, currentTheme } = storeToRefs(contentStore)`, extend to:

```ts
let { currentSize, currentTheme, textAlign, wrapperMargin } = storeToRefs(contentStore)
```

- [ ] **Step 3: Add computed helpers**

After `currentThemeObj` computed, add:

```ts
interface Margin {
  id: string
  name: string
  style: string
}

const currentMarginObj = computed(() => {
  return MARGIN_ARR.filter((item: Margin) => item.id === wrapperMargin.value)[0]
})
```

- [ ] **Step 4: Update content hash**

In `generateContentHash()`, add to the hash string:

```ts
const align = contentStore.textAlign
const margin = contentStore.wrapperMargin
return btoa(encodeURIComponent(`${content}-${theme}-${size}-${withDate}-${withWatermark}-${align}-${margin}`)).slice(0, 16)
```

- [ ] **Step 5: Add event handlers**

After `handleSelectSize`, add:

```ts
function handleSelectTextAlign(item: { id: string; name: string }) {
  contentStore.updateTextAlign(item.id)
  imageBlob = null
  setTimeout(preGenerateBlob, 100)
  proxy.$reortGaEvent('home-text-align', 'main')
}

function handleSelectMargin(item: Margin) {
  contentStore.updateWrapperMargin(item.id)
  imageBlob = null
  setTimeout(preGenerateBlob, 100)
  proxy.$reortGaEvent('home-margin', 'main')
}
```

- [ ] **Step 6: Run type check**

Run: `pnpm type-check`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/views/Home.vue
git commit -m "feat: add text align and margin handlers in Home.vue"
```

---

### Task 5: Wire Home.vue — template and bindings

**Files:**
- Modify: `src/views/Home.vue`

- [ ] **Step 1: Bind container and editor styles**

Replace the `#container` div:

```html
<div id="container" class="container" style="text-autospace: normal;" :style="[currentSizeObj.style, currentMarginObj.style]">
```

Replace the `#editor` div class binding:

```html
<div id="editor" ref="editor" @blur="onEditorBlur" @focus="onEditorFocus"
  :class="['editor', 'markdown', { 'markdown--justify': textAlign === 'justify' }]"
  contenteditable="true">
```

- [ ] **Step 2: Insert typography row between existing rows**

After the first operate-area row (theme/size/date, closing `</div>` at line ~354), before the copy/save/watermark row, insert:

```html
<div class="flex flex-row items-center justify-evenly w-full py-2 space-x-6" role="group">
  <div class="flex flex-col items-center justify-between h-20">
    <p class="font-medium text-gray-400">文本对齐</p>
    <HeadlessSelect className="w-28" :sourceArr="TEXT_ALIGN_ARR" :defaultId="textAlign"
      @selected="handleSelectTextAlign" />
  </div>
  <div class="flex flex-col items-center justify-between h-20">
    <p class="font-medium text-gray-400">外边距</p>
    <HeadlessSelect className="w-24" :sourceArr="MARGIN_ARR" :defaultId="wrapperMargin"
      @selected="handleSelectMargin" />
  </div>
</div>
```

- [ ] **Step 3: Run type check**

Run: `pnpm type-check`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/views/Home.vue
git commit -m "feat: add typography controls row and bind align/margin to preview"
```

---

### Task 6: Changelog and verification

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Add changelog entry**

At the top of the changelog (after the header), add:

```markdown
## 2026-06-27
- Added homepage text alignment toggle (left / justify) with localStorage persistence.
- Added independent outer margin presets (compact / standard / relaxed / wide), decoupled from output size.
- Reorganized operate area with a dedicated typography row separate from watermark controls.
```

- [ ] **Step 2: Full verification**

Run: `pnpm type-check`
Expected: PASS

Run: `pnpm build`
Expected: PASS (no build errors)

- [ ] **Step 3: Manual browser test checklist**

Run: `pnpm dev`, open `http://localhost:5173/`

1. Default state: text is left-aligned, margin is standard (2rem padding around theme box)
2. Switch to「两端对齐」: paragraphs become justified immediately
3. Switch to「紧凑」: wrapper padding shrinks visibly; switch to「超宽」: padding expands
4. Change size (mobile): width changes but padding stays at selected margin level
5. Reload page: alignment and margin selections persist
6. Save image: exported PNG reflects current alignment and margin
7. Layout: typography row (文本对齐 / 外边距) sits above copy/save/watermark row

- [ ] **Step 4: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs: changelog for homepage text align and margin feature"
```

---

## Self-Review

| Spec requirement | Task |
|-----------------|------|
| Two alignment options, default left | Task 1, 3, 4, 5 |
| HeadlessSelect for alignment | Task 5 |
| Four margin presets, default standard | Task 1, 2, 5 |
| Margin decoupled from size | Task 1 |
| Typography row separate from watermark | Task 5 |
| localStorage persistence | Task 2 |
| Export fidelity + hash invalidation | Task 4 |
| CHANGELOG | Task 6 |

No placeholders. No test framework exists in this project; verification uses `pnpm type-check`, `pnpm build`, and manual browser checklist.
