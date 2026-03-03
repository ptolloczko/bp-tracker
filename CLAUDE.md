# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Blood Pressure Tracker — single-page Angular app with zero backend. All data stored in `localStorage`.

## Commands

```bash
ng serve          # dev server at http://localhost:4200
ng build          # production build → dist/bp-tracker
ng test           # unit tests (Karma)
ng lint           # lint (if configured)
```

## Architecture

- **Framework:** Angular 21, standalone components, no NgModules, no router
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` (`vite.config.ts`)
- **State:** Angular Signals + `ReadingService` (no RxJS, no NgRx)
- **Storage:** `localStorage` key `bp-tracker-readings` (JSON)
- **Forms:** Angular Reactive Forms; validators derived from `VALIDATION` constants

### Key files

| Path | Purpose |
|---|---|
| `src/app/models/reading.model.ts` | `Reading` interface + `VALIDATION` constants |
| `src/app/services/reading.service.ts` | Signal store — `readings`, `averages`, add/update/delete |
| `src/app/app.ts` | Root shell; owns `editingReading` signal; wires service to components |
| `src/app/components/reading-form/` | Reactive form, add/edit mode, emits `saved`/`cancelled` |
| `src/app/components/reading-list/` | Table container, empty state, bubbles edit/delete |
| `src/app/components/reading-row/` | Single row, inline delete confirmation |
| `src/app/components/stats-summary/` | Pure presentational averages display |

### State flow

```
User action → Component output → AppComponent → ReadingService → signal update → re-render
```

`editingReading` (UI state) lives in `AppComponent`, not the service.

## Conventions

- Standalone components only — no NgModules
- Signal inputs (`input()`, `input.required()`) and outputs (`output()`) throughout
- No direct service injection in leaf components (form, row, stats-summary, list)
- Tailwind utility classes inline in templates — no separate CSS files
- `VALIDATION` constants are the single source of truth for field constraints
