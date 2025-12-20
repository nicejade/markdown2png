# 玉桃文飨轩 ｜ Markdown2PNG

## Project Purpose (WHY)

This is a **professional text-to-image conversion tool** that converts Markdown content into beautifully formatted shareable images. The project emphasizes **privacy protection** (all processing happens locally in the browser) and **user experience** (multiple themes, fonts, and background customization options).

Primary use cases:
- **Main Converter Mode** (`/`): General-purpose Markdown to image conversion
- **Digest Mode** (`/digest`): Specifically designed for reading notes and book excerpts sharing
- **About Page** (`/about`): Product introduction and usage instructions

Live URL: https://share.lovejade.cn

## Tech Stack (WHAT)

### Core Framework
- **Vue 3** + **TypeScript**: Main framework and type system
- **Vite**: Build tool and development server
- **Pinia**: State management (replaces Vuex)
- **Vue Router**: Routing management
- **TailwindCSS**: UI styling framework

### Key Dependencies
- **@silvia-odwyer/photon** (WASM): Browser-side image processing engine
- **html2canvas** + **@zumer/snapdom**: DOM to image conversion
- **marked**: Markdown parsing and rendering
- **@headlessui/vue**: Unstyled UI component library

### Project Structure
```
src/
├── views/          # Three main pages: Home, Digest, About
├── components/     # Reusable components
├── stores/         # Pinia state management (content, digest, toast)
├── router/         # Route configuration
├── helper/         # Constants and utility functions
└── assets/         # Static resources (images, fonts, styles)
```

### Path Alias Configuration
- `@` → `src/`
- `@assets` → `src/assets/`
- `@components` → `src/components/`
- `@views` → `src/views/`
- `@stores` → `src/stores/`
- `@helper` → `src/helper/`

## Development Guide (HOW)

### Package Manager
**pnpm is required** - do not use npm or yarn (project is configured with `packageManager: "pnpm@9.14.2"`)

### Common Commands
```bash
pnpm dev          # Start development server
pnpm type-check   # TypeScript type checking (must run after code changes)
pnpm build        # Full build (includes type checking + sitemap generation)
pnpm preview      # Preview build output
bash deploy.sh    # Deploy to GitHub Pages
```

### Development Standards
- **Code Comments**: All comments must be in English
- **Naming Conventions**: Follow best practices for naming - use descriptive, semantic names for variables, functions, and components
- **Code Quality**: Write clean, maintainable code following industry best practices and conventions
- **Code Simplicity**: Prefer simple and straightforward implementations, avoid over-engineering
- **Change Documentation**: After completing features, changes must be documented in `CHANGELOG.md`

### Verifying Your Changes
1. **Type Checking**: Run `pnpm type-check` to ensure no TypeScript errors
2. **Local Testing**: Use `pnpm dev` to test functionality in the browser
3. **Build Testing**: Run `pnpm build` to ensure production build succeeds

### Important Technical Details
- **State Persistence**: User settings (theme, size, content) are saved in localStorage
- **Code Splitting**: Vendor chunks are configured - keep large dependencies independently bundled (see `vite.config.ts`)
- **SVG Icons**: Uses `vite-plugin-svg-icons`, icons located in `src/assets/icons/`
- **SEO Optimization**: Route guards dynamically update page titles and meta tags

### Further Reading
- **README.md**: Complete feature introduction and usage instructions
- **vite.config.ts**: Build configuration, path aliases, performance optimization strategies
- **src/router/index.ts**: Route configuration and SEO meta tags
- **src/stores/**: State management logic
- **deploy.sh**: Deployment process and configuration
