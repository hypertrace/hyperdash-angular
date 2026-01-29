# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hyperdash Angular (`@hypertrace/hyperdash-angular`) is an Angular library providing dashboard runtime capabilities. It wraps the core `@hypertrace/hyperdash` library with Angular services, components, and directives.

**Structure**: Monorepo with a publishable library (`projects/hyperdash-angular/`) and demo app (`src/`).

## Common Commands

```bash
# Development
npm start                    # Dev server at localhost:4200
npm run build               # Build app and library

# Testing
npm test                    # Run tests (watch mode)
npm run test:ci:lib         # Library tests only (CI mode)
npm run test:ci:app         # App tests only (CI mode)
npm run test:ci             # Full CI suite (lint + all tests)

# Code Quality
npm run lint                # Run ESLint
npm run commit              # Interactive conventional commit (commitizen)
```

## Architecture

### Injectable Wrappers Pattern
Core `@hypertrace/hyperdash` classes are wrapped as Angular injectable services following the pattern `[ClassName]Service`:
- `DashboardManagerService`, `ModelManagerService`, `ThemeManagerService`, etc.
- Always use the service wrapper (e.g., `DashboardManagerService`) rather than the core class directly.

### Module System
- `DashboardCoreModule`: Main runtime module with default property types and deserializers
- `DashboardCoreModule.with(metadata)`: Extend with custom types, models, renderers, editors, deserializers
- `DashboardEditorModule`: Separate module for editing capabilities

### Key Injection Tokens
- `MODEL_PROPERTY_TYPES`: Register custom property types
- `DASHBOARD_DESERIALIZERS`: Register custom deserializers

### Rendering
- `DashboardComponent` (`<hda-dashboard>`): Main rendering component
- `DashboardModelDirective` (`hdaDashboardModel`): Injects models into template context
- `ThemePropertyPipe`: Theme-aware property rendering

## Code Conventions

### Selectors
- **Library components**: `hda-*` prefix (kebab-case)
- **Library directives**: `hda*` prefix (camelCase)
- **App components**: `app-*` prefix

### TypeScript
- Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, `strictNullChecks`
- Explicit access modifiers required (public/private/protected)
- No `any` types allowed
- Parameter properties preferred: `constructor(private readonly service: Service)`

### Testing
- Jest with `@ngneat/spectator` for component testing
- Test files: `*.test.ts` or `*.spec.ts`
- Coverage excludes: `*.module.ts`, `public_api.ts`, `test/` directory

### Commits
- Conventional commits required (enforced via commitlint)
- Use `npm run commit` for interactive commit wizard
- Pre-commit hook runs Prettier on staged files

## ESLint Rules of Note

- Max 500 lines per file
- Template conditional complexity: max 4
- Template cyclomatic complexity: max 5
- No inline templates > 10 lines
- Arrow functions: `as-needed` body style
- Prefer template literals over string concatenation
