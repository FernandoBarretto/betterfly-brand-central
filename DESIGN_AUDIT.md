# Betterfly Brand Central — Design Audit

> Prepared for future reskin / design-system extraction.
> Source: `client/src/`, `tailwind.config.ts`, `client/src/index.css`

---

## 1. Design Tokens

### 1.1 Color Palette

#### Brand Colors (hard-coded hex values used across all pages)

| Token Name | Hex | Usage |
|---|---|---|
| Betterfly Green | `#19F578` | Primary accent, active nav states, CTAs, focus rings, status dots, decorative glows |
| Betterfly Yellow | `#E8FB10` | Secondary accent, CTA hover state, highlight sections, tag backgrounds |
| Forest Green | `#042914` | Sidebar bg, page-header bg, dark card bgs, heavy text, primary button bg |
| Surface / Off-white | `#F7F7F5` | Page backgrounds, input backgrounds, light card fills |
| Neutral / Warm Gray | `#E2E0D9` | Secondary button hover, dividers, muted UI elements |
| Canvas Gray | `#F0F0EE` / `#F0EEEB` | Asset Generator preview panel backgrounds |
| Mint Tint | `#F0FFF8` | Success / positive card backgrounds (Brand Guidelines) |

#### Opacity Variants (used inline as Tailwind arbitrary values)

- `#19f578/5`, `/8`, `/10`, `/20`, `/40` — green glows, tints, sub-nav active
- `#042914/8`, `/40`, `/60`, `/80`, `/90` — text opacity variants, muted labels
- `white/10`, `/15`, `/20`, `/30`, `/50`, `/70` — sidebar text & borders
- `black/8`, `/10`, `/15`, `/30`, `/50` — light borders, placeholders

#### shadcn/ui Semantic Tokens (HSL via CSS custom properties)

| CSS Variable | Light Value (HSL) | Purpose |
|---|---|---|
| `--background` | `0 0% 100%` | Page background |
| `--foreground` | `222.2 47.4% 11.2%` | Default text |
| `--primary` | `222.2 47.4% 11.2%` | Primary color (dark blue-gray, not brand green) |
| `--secondary` | `210 40% 96.1%` | Light gray |
| `--muted` | `210 40% 96.1%` | Muted surfaces |
| `--accent` | `210 40% 96.1%` | Accent color |
| `--destructive` | `0 100% 50%` | Error red |
| `--border` | `214.3 31.8% 91.4%` | Default border |
| `--ring` | `215 20.2% 65.1%` | Focus ring |
| `--radius` | `0.5rem` | Base border radius |
| `--card` | `transparent` | Card background |

> **Issue:** The shadcn semantic tokens use generic blue-gray values and are essentially unused — nearly all pages bypass them with hard-coded brand hex values. A reskin should replace the shadcn defaults with Betterfly brand colors.

### 1.2 Typography

#### Font Stacks

| Role | Font Family | Fallbacks |
|---|---|---|
| Display / Headlines | `Barlow Condensed` (proxy for `Obviously Narrow`) | `Obviously Narrow`, Helvetica, sans-serif |
| Body / UI | `Roboto` | ui-sans-serif, system-ui, sans-serif |

**Font Loading:** Google Fonts import in `index.css`:
- Barlow Condensed: weights 700, 800, 900
- Roboto: weights 400, 700

#### Typography Scale (CSS custom properties)

| Token | Family | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| `--display-medium` | Barlow Condensed | 72px | 900 (Black) | 100% | -0.5px |
| `--headings-h2` | Roboto | 21px | 700 (Bold) | 100% | 0 |
| `--headings-h3` | Roboto | 16px | 700 (Bold) | 130% | 0 |
| `--label-regular-400` | Roboto | 16px | 400 | 130% | 0 |
| `--label-small-400` | Roboto | 14px | 400 | 100% | 0 |
| `--label-small-500` | Roboto | 14px | 700 | 120% | 0 |
| `--label-xsmall` | Roboto | 12px | 400 | 100% | 0 |
| `--paragraph-p-regular` | Roboto | 18px | 400 | 140% | 0 |
| `--paragraph-p-small` | Roboto | 14px | 400 | 140% | 0 |

> **Issue:** These CSS-variable typography tokens are registered in Tailwind as font-family utilities (e.g., `font-display-medium`) but are rarely used in components. Most pages apply font styles directly via Tailwind utilities (`text-7xl font-black`, `text-sm font-bold`, etc.) or inline `style` attributes. The scale is inconsistently applied.

### 1.3 Border Radius

| Tailwind Token | Value | Actual Pages |
|---|---|---|
| `rounded-sm` | `calc(0.5rem - 4px)` = 4px | Rarely used |
| `rounded-md` | `calc(0.5rem - 2px)` = 6px | Occasionally |
| `rounded-lg` | `0.5rem` = 8px | Sidebar nav items, small buttons, tags, inputs |
| `rounded-xl` | 12px (Tailwind default) | Cards, inputs, pills, CTAs — **most common** |
| `rounded-2xl` | 16px (Tailwind default) | Large cards, section containers, dark panels |
| `rounded-full` | 9999px | Avatars, status dots, circular buttons, decorative glows |

> **Observation:** `rounded-xl` (12px) is the de-facto standard for interactive elements. `rounded-2xl` is used for container cards.

### 1.4 Spacing & Layout

#### Global Layout

- **Sidebar:** Fixed left, `w-64` (256px), full height, `bg-[#042914]`
- **Main content:** `ml-64 flex-1 min-h-screen overflow-y-auto`
- **No max-width constraint** on inner content — pages expand to fill viewport

#### Page Header Pattern (`PageHeader` component)

- `bg-[#042914] px-16 py-20` — generous padding, dark brand background
- Decorative butterfly emoji elements (🦋) with low opacity
- Subtle radial green glow (`bg-[#19f578]/5 blur-3xl`)
- Eyebrow: `text-[#19f578] text-xs font-bold uppercase tracking-widest`
- Title: `text-white text-7xl font-black` with Barlow Condensed
- Subtitle: `text-white/60 text-lg max-w-2xl leading-relaxed`

#### Common Page Padding

- Page body: `px-16 py-12` (most pages), sometimes `px-8` on tighter layouts
- Card padding: `p-5` to `p-8` depending on card size
- Section gaps: `space-y-6` to `space-y-8`
- Card gaps: `gap-6` in grid layouts

#### Grid Patterns

- 2-column: `grid grid-cols-2 gap-6`
- 3-column: `grid grid-cols-3 gap-6`
- 4-column: `grid grid-cols-4 gap-5`
- Limited responsive breakpoints — predominantly desktop-only, with occasional exceptions (e.g., `md:grid-cols-2` in CampaignAnalysis, `xl:grid-cols-4` in AssetGenerator)

### 1.5 Shadows

- Cards: `hover:shadow-lg transition-all` on interactive cards
- Buttons: No shadows on default buttons
- Modals/sheets: inherit from shadcn defaults
- Decorative: `blur-3xl` on background glow elements

### 1.6 Animations

Defined in `index.css`:

| Name | Duration | Description |
|---|---|---|
| `fade-in` | 1s ease | Translate Y(-10px) → 0, opacity 0 → 1 |
| `fade-up` | 1s ease | Translate Y(20px) → 0, opacity 0 → 1 |
| `shimmer` | 8s infinite | Background position sweep for loading states |
| `marquee` | var(--duration) infinite | Horizontal scroll loop |
| `marquee-vertical` | var(--duration) infinite | Vertical scroll loop |
| `spin` | 1s linear infinite | Rotation for loading spinners |
| `image-glow` | — | Opacity pulse for image decorations |
| `accordion-down/up` | 0.2s ease-out | Radix accordion expand/collapse |

---

## 2. Component Inventory

### 2.1 shadcn/ui Primitives (47 files in `components/ui/`)

A large shadcn/ui library is installed, but very few primitives are actually imported by application code. Most page UIs are built with raw Tailwind classes rather than the shadcn component system.

**Imported by app pages/components (outside `ui/` folder):**
- `toaster` — global toast notifications (`App.tsx`)
- `tooltip` / `TooltipProvider` — wraps entire app (`App.tsx`)
- `card` / `CardContent` — used on the 404 page (`not-found.tsx`)
- `toast` hooks — via `use-toast.ts`

**Used only as internal shadcn cross-dependencies (not imported by app code):**
- `button` (imported by `carousel`, `calendar`, `pagination`, `alert-dialog`, `sidebar`)
- `dialog` (imported by `command`)
- `label` (imported by `form`)
- `input`, `separator`, `sheet`, `skeleton` (imported by `sidebar`)
- `toggle` (imported by `toggle-group`)

**Installed but completely unused (47 files total; candidates for removal):**
- `accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `calendar`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `sidebar`, `slider`, `switch`, `table`, `tabs`, `textarea`, `toggle`, `toggle-group`

> **Key Finding:** The app almost entirely bypasses shadcn components. Buttons, cards, inputs, selects, and tables are all hand-built with inline Tailwind. A reskin should decide whether to adopt the shadcn component system or continue with the current approach.

### 2.2 Custom App Components

| Component | File | Purpose |
|---|---|---|
| `Layout` | `components/Layout.tsx` | Sidebar + main content wrapper |
| `Sidebar` | `components/Sidebar.tsx` | Fixed nav with sections, sub-navs, active states |
| `PageHeader` | `components/PageHeader.tsx` | Dark hero banner with eyebrow/title/subtitle |
| `DriveSetupBanner` | `components/DriveSetupBanner.tsx` | Google Drive integration CTA |
| `DriveFileModal` | `components/DriveFileModal.tsx` | File preview modal for Drive files |

### 2.3 Page Components

| Page | Route | Key UI Patterns |
|---|---|---|
| `Passcode` | *(pre-router gate)* | Full-screen dark login with radial glows; shown before any routes load |
| `Home` | `/` | Dashboard grid, stat cards, quick-link cards |
| `FileLibrary` | `/file-library` | Search + filter bar, file grid, upload modal |
| `AudiencePlaybooks` | `/playbooks`, `/playbooks/:audience` | Tabbed audience selector, persona cards, strategy sections |
| `CarrierOverview` | `/playbooks/carriers/overview` | Deep-dive carrier playbook page |
| `BrokersOverview` | `/playbooks/brokers/overview` | Deep-dive broker playbook page |
| `BrandVoice` | `/brand-voice` | Copy-to-clipboard cards, voice attribute grid |
| `VisualIdentity` | `/visual-identity` | Color swatches, typography specimens, logo grid |
| `Templates` | `/templates` | Filterable template cards with color-coded tags |
| `BrandGuidelines` | `/brand-guidelines` | Long-form content sections, dark panels, checklists |
| `AssetGenerator` | `/asset-generator` | Multi-step wizard, audience/format picker, AI preview panel |
| `MarketIntelligence` | `/market-intelligence` | Overview hub with cards linking to sub-pages |
| `BattleCards` | `/market-intelligence/battle-cards` | Competitor cards, SWOT-style layout, objection handlers |
| `CampaignAnalysis` | `/market-intelligence/trends` | Data table, competitor comparison matrix, tabbed detail view |
| `AdminTrends` | `/admin/trends` | CRUD interface for trend/theme management |
| `NotFound` | *(catch-all)* | 404 page using shadcn Card |

---

## 3. Pattern Library

### 3.1 Button Patterns

| Variant | Classes | Context |
|---|---|---|
| Primary CTA | `bg-[#19f578] text-[#042914] font-bold rounded-xl hover:bg-[#e8fb10]` | Main actions |
| Dark CTA | `bg-[#042914] text-white font-bold rounded-xl hover:bg-[#042914]/80` | Secondary prominence |
| Ghost/Outline | `bg-white border border-black/10 text-[#042914] rounded-xl hover:border-[#19f578]` | Tertiary actions |
| Small Pill | `text-xs font-bold px-3 py-1.5 rounded-lg` | Tags, filters, inline actions |
| Icon Button | `w-7 h-7 rounded-lg bg-[#f7f7f5] hover:bg-[#e2e0d9] flex items-center justify-center` | Edit/delete actions |

> **Issue:** Buttons are not using the shadcn `<Button>` component or its variant system. All button styles are inline Tailwind, making global style changes difficult.

### 3.2 Card Patterns

| Variant | Classes |
|---|---|
| Light card | `bg-white border border-black/8 rounded-2xl p-8 hover:shadow-lg` |
| Surface card | `bg-[#f7f7f5] border border-black/8 rounded-xl p-6` |
| Dark card | `bg-[#042914] rounded-xl p-6` (white text inside) |
| Accent card | `bg-[#e8fb10] rounded-2xl p-10` (dark text) |
| Edit card | `bg-white border-2 border-[#19f578] rounded-2xl p-5` |

### 3.3 Input Patterns

- Default: `border border-black/15 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#19f578]`
- Dark variant: `bg-white/10 border text-white placeholder-white/30 rounded-xl px-5 py-4`
- Search: Often paired with `Search` icon from Lucide

### 3.4 Section Headers

- Eyebrow: `text-[#042914]/40 text-xs font-bold uppercase tracking-widest`
- Section title: `text-[#042914] font-black text-xl` or `text-2xl`
- Nav section label: `text-white/20 text-[10px] font-bold uppercase tracking-widest`

### 3.5 Status Indicators

- Green dot: `w-2 h-2 bg-[#19f578] rounded-full`
- Numbered badge: `w-5 h-5 bg-[#042914] rounded-full text-white text-xs font-bold`
- Check badge: `w-5 h-5 bg-[#19f578] rounded-full text-[#042914]`

---

## 4. Icon Set

**Library:** `lucide-react` — used exclusively throughout the app.

**Icons in use across pages and components:**

| Category | Icons |
|---|---|
| Navigation | `Home`, `ChevronRight`, `ChevronLeft`, `ArrowRight`, `X` |
| Content | `Target`, `Mic2`, `Palette`, `FolderOpen`, `Ruler`, `Library`, `FileText` |
| Data/Analytics | `TrendingUp`, `BarChart2`, `BarChart3`, `PieChart`, `Activity` |
| Actions | `Download`, `Eye`, `Search`, `Copy`, `Check`, `RefreshCw`, `ExternalLink` |
| Status | `AlertTriangle`, `AlertCircle`, `CheckCircle`, `XCircle`, `Shield` |
| Domain | `Building2`, `Users`, `User`, `Heart`, `Brain`, `Sparkles`, `Zap`, `Star` |
| Media | `Film`, `Presentation` |
| Layout | `PanelLeft`, `GripVertical`, `MoreHorizontal` |
| Misc | `Lightbulb`, `MessageSquare`, `ThumbsDown`, `Headphones`, `Loader2` |

Default icon size: `16px` (sidebar), contextually `13px` (sub-nav) to `20px+` (hero sections).

---

## 5. Accessibility & Responsiveness

### Accessibility

- **No ARIA landmarks** beyond default HTML semantics
- **No skip-to-content link**
- **Focus indicators:** Rely on `focus:ring-2 focus:ring-[#19f578]` on inputs; buttons have no visible focus ring
- **Color contrast:** Green (`#19F578`) on Forest Green (`#042914`) passes WCAG AA for large text; white/30 sidebar text (~4.5:1 on #042914) is borderline
- **Keyboard navigation:** Sidebar links are `<a>` tags (keyboard accessible); tab order follows DOM order
- **Screen reader:** Decorative 🦋 emojis have `pointer-events-none` but no `aria-hidden`

### Responsiveness

- **Predominantly desktop-only** — most layouts use fixed column counts, though a few pages include breakpoints (e.g., `md:grid-cols-2` in CampaignAnalysis, `xl:grid-cols-4` in AssetGenerator)
- Sidebar is fixed 256px; no collapse/hamburger for smaller screens
- Page headers use large fixed padding (`px-16 py-20`) that won't work on mobile
- `container` class configured (`center: true, padding: 2rem, max-width: 1400px`) but not used on any page
- Overall: responsive support is inconsistent and insufficient for mobile/tablet use

---

## 6. Reskin Recommendations

### 6.1 Token Consolidation (Priority: High)

1. **Replace shadcn HSL tokens** with Betterfly brand colors:
   - `--primary` → `#19F578` (Betterfly Green)
   - `--primary-foreground` → `#042914` (Forest Green)
   - `--background` → `#F7F7F5` (Surface)
   - `--foreground` → `#042914` (Forest Green)
   - Add `--brand-yellow: #E8FB10` and `--brand-forest: #042914`
2. **Eliminate hard-coded hex values** — replace all `bg-[#042914]`, `text-[#19f578]`, etc. with semantic Tailwind classes (`bg-primary`, `text-brand-green`, etc.)
3. **Consolidate opacity variants** into named tokens (e.g., `text-foreground/60` instead of `text-[#042914]/60`)

### 6.2 Typography System (Priority: High)

1. **Use the defined CSS variable scale** instead of ad-hoc Tailwind utilities
2. **License and load Obviously Narrow** as the true display font (currently proxied by Barlow Condensed)
3. **Define a page-title size** between `text-7xl` (72px, hero) and `text-xl` (20px, section title) — there's a large gap in the scale

### 6.3 Component Standardization (Priority: Medium)

1. **Wrap button patterns** in the shadcn `<Button>` variant system — currently all inline Tailwind
2. **Create a `<Card>` variant system** for the 5 card patterns (light, surface, dark, accent, edit)
3. **Extract `<SectionHeader>`** component for the eyebrow + title pattern used on every page
4. **Create `<StatusDot>`** and `<NumberBadge>`** components for the repeated indicator patterns

### 6.4 Responsive Design (Priority: Medium)

1. **Add sidebar collapse** on screens < `lg` with hamburger toggle
2. **Convert grids** to responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
3. **Scale page header padding** down for mobile: `px-6 py-10 md:px-16 md:py-20`
4. **Use the `container` class** already configured in Tailwind

### 6.5 Accessibility (Priority: Medium)

1. Add `aria-hidden="true"` to decorative 🦋 emojis
2. Add visible focus rings to all interactive elements
3. Add skip-to-content link
4. Audit all `white/30` and `white/50` text for WCAG AA contrast compliance
5. Add `<nav>`, `<main>`, `<aside>` landmark roles where missing

### 6.6 Animation & Polish (Priority: Low)

1. Standardize transition durations (currently mix of `transition-all`, `transition-colors`)
2. Consider `prefers-reduced-motion` media query for `fade-in`, `fade-up` animations
3. Add subtle hover scale transforms to cards for consistency

---

## 7. File Inventory

### Critical Files for Reskin

| File | What to Change |
|---|---|
| `client/src/index.css` | CSS custom properties, font imports, animations |
| `tailwind.config.ts` | Color tokens, font families, border radius, plugins |
| `client/src/components/Layout.tsx` | Responsive wrapper, max-width |
| `client/src/components/Sidebar.tsx` | Responsive collapse, color tokens |
| `client/src/components/PageHeader.tsx` | Spacing, typography tokens |
| `client/src/pages/*.tsx` (all 17 pages) | Replace hard-coded hex with tokens |
| `client/src/components/ui/button.tsx` | Add Betterfly brand variants |
| `client/src/components/ui/card.tsx` | Add dark/accent/surface variants |
