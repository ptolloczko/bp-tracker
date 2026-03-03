# GitHub Issues — Blood Pressure Tracker MVP

## Issue 1: Project Setup — Initialize Angular 19 + Tailwind

**Description:**
Scaffold the Angular 19 project using standalone components (no NgModules), configure Tailwind CSS, and verify the dev server runs.

**Acceptance Criteria:**
- `ng new` with Angular 19, standalone, no routing
- Tailwind CSS installed and `@tailwind` directives in `styles.css`
- `src/` folder structure matches architecture doc (models/, services/, components/)
- `ng serve` starts without errors

**MVP Scope:** No app logic — scaffold only.

---

## Issue 2: Data Model — Reading Interface + Validation Constants

**Description:**
Create `src/app/models/reading.model.ts` with the `Reading` interface and `VALIDATION` constants as defined in the architecture.

**Acceptance Criteria:**
- `Reading` interface: `id`, `systolic`, `diastolic`, `pulse`, `recordedAt`, `notes?`
- `VALIDATION` const with min/max for systolic, diastolic, pulse and maxLength for notes
- Exported from the models file

**MVP Scope:** Types and constants only — no logic.

---

## Issue 3: ReadingService — Signal Store + localStorage Persistence

**Description:**
Implement `src/app/services/reading.service.ts` as an `@Injectable({ providedIn: 'root' })` service using Angular Signals.

**Acceptance Criteria:**
- `readings` signal initialized by loading from `localStorage` key `bp-tracker-readings`
- `add(reading: Omit<Reading, 'id'>)` — assigns `crypto.randomUUID()`, updates signal, saves
- `update(id, changes)` — replaces matching reading, updates signal, saves
- `delete(id)` — removes matching reading, updates signal, saves
- `averages` computed signal returns `{ systolic, diastolic }` rounded to 1 decimal, or `null` when empty
- Private `load()` / `save()` handle JSON serialization; `load()` returns `[]` on parse error

**MVP Scope:** No UI. No RxJS.

---

## Issue 4: StatsSummaryComponent — Averages Display

**Description:**
Create `src/app/components/stats-summary/` as a pure presentational component.

**Acceptance Criteria:**
- Input: `averages: { systolic: number; diastolic: number } | null`
- Displays average systolic and diastolic when non-null
- Shows `—` for both values when input is `null`
- No service injection

**MVP Scope:** Display only. No logic.

---

## Issue 5: ReadingFormComponent — Add/Edit Form with Validation

**Description:**
Create `src/app/components/reading-form/` with a Reactive Form supporting both add and edit modes.

**Acceptance Criteria:**
- Input: `reading: Reading | null` (null = add mode)
- Fields: systolic, diastolic, pulse (all required integers), recordedAt (required, defaults to now in add mode), notes (optional, max 500 chars)
- Validators derived from `VALIDATION` constants
- Inline error messages shown on submit
- Output `(saved)` emits form values on valid submit
- Output `(cancelled)` emits when user cancels (edit mode only)
- Form resets to empty/defaults after successful save

**MVP Scope:** No direct service calls — delegate via outputs.

---

## Issue 6: ReadingRowComponent — Row Display + Inline Delete Confirmation

**Description:**
Create `src/app/components/reading-row/` to display a single reading with edit and delete actions.

**Acceptance Criteria:**
- Input: `reading: Reading`
- Displays: date/time, systolic, diastolic, pulse, notes (truncated to 80 chars with ellipsis)
- Edit button emits `(edit)` output
- Delete button toggles inline confirmation (no modal); confirm emits `(delete)`, cancel hides confirmation

**MVP Scope:** No service injection. Inline toggle only — no modal.

---

## Issue 7: ReadingListComponent — List Container + Empty State

**Description:**
Create `src/app/components/reading-list/` to render the full list of readings.

**Acceptance Criteria:**
- Input: `readings: Reading[]`
- Renders a `ReadingRowComponent` per reading using `@for`
- Emits `(edit)` and `(delete)` outputs (bubbled from rows)
- Shows an empty-state message when `readings` is empty

**MVP Scope:** No service injection. Purely input/output driven.

---

## Issue 8: AppComponent — Shell, Layout, and State Wiring

**Description:**
Implement `app.component.ts` and `app.component.html` as the root orchestrator that connects all components and the service.

**Acceptance Criteria:**
- Hosts `ReadingFormComponent`, `StatsSummaryComponent`, `ReadingListComponent`
- `editingReading` signal: `Signal<Reading | null>` — null = add mode
- Passes `readings()` and `averages()` from `ReadingService` to child components as inputs
- On `(saved)`: calls `service.add()` or `service.update()` depending on mode; clears `editingReading`
- On `(cancelled)`: clears `editingReading`
- On `(edit)`: sets `editingReading` to the selected reading
- On `(delete)`: calls `service.delete()`
- Single-column layout matching the PRD wireframe

**MVP Scope:** No router. No NgRx.

---

## Issue 9: Responsive Layout + Accessibility

**Description:**
Apply Tailwind responsive classes and accessibility attributes across all components.

**Acceptance Criteria:**
- Layout is usable at ≥ 375px viewport width
- All form controls have `<label>` elements and ARIA labels
- Delete confirmation and form actions are keyboard navigable
- Semantic HTML throughout (headings, `<table>` or `<dl>` for readings list, `<form>`)
- No horizontal scroll on mobile

**MVP Scope:** No new functionality — polish only.

---

## GitHub CLI Commands

```bash
gh issue create \
  --title "Project Setup — Initialize Angular 19 + Tailwind" \
  --body "## Description
Scaffold the Angular 19 project using standalone components (no NgModules), configure Tailwind CSS, and verify the dev server runs.

## Acceptance Criteria
- \`ng new\` with Angular 19, standalone, no routing
- Tailwind CSS installed and \`@tailwind\` directives in \`styles.css\`
- \`src/\` folder structure matches architecture doc (models/, services/, components/)
- \`ng serve\` starts without errors

## MVP Scope
No app logic — scaffold only."

gh issue create \
  --title "Data Model — Reading Interface + Validation Constants" \
  --body "## Description
Create \`src/app/models/reading.model.ts\` with the \`Reading\` interface and \`VALIDATION\` constants as defined in the architecture.

## Acceptance Criteria
- \`Reading\` interface: \`id\`, \`systolic\`, \`diastolic\`, \`pulse\`, \`recordedAt\`, \`notes?\`
- \`VALIDATION\` const with min/max for systolic, diastolic, pulse and maxLength for notes
- Exported from the models file

## MVP Scope
Types and constants only — no logic."

gh issue create \
  --title "ReadingService — Signal Store + localStorage Persistence" \
  --body "## Description
Implement \`src/app/services/reading.service.ts\` as an \`@Injectable({ providedIn: 'root' })\` service using Angular Signals.

## Acceptance Criteria
- \`readings\` signal initialized by loading from \`localStorage\` key \`bp-tracker-readings\`
- \`add(reading: Omit<Reading, 'id'>)\` — assigns \`crypto.randomUUID()\`, updates signal, saves
- \`update(id, changes)\` — replaces matching reading, updates signal, saves
- \`delete(id)\` — removes matching reading, updates signal, saves
- \`averages\` computed signal returns \`{ systolic, diastolic }\` rounded to 1 decimal, or \`null\` when empty
- Private \`load()\` / \`save()\` handle JSON serialization; \`load()\` returns \`[]\` on parse error

## MVP Scope
No UI. No RxJS."

gh issue create \
  --title "StatsSummaryComponent — Averages Display" \
  --body "## Description
Create \`src/app/components/stats-summary/\` as a pure presentational component.

## Acceptance Criteria
- Input: \`averages: { systolic: number; diastolic: number } | null\`
- Displays average systolic and diastolic when non-null
- Shows \`—\` for both values when input is \`null\`
- No service injection

## MVP Scope
Display only. No logic."

gh issue create \
  --title "ReadingFormComponent — Add/Edit Form with Validation" \
  --body "## Description
Create \`src/app/components/reading-form/\` with a Reactive Form supporting both add and edit modes.

## Acceptance Criteria
- Input: \`reading: Reading | null\` (null = add mode)
- Fields: systolic, diastolic, pulse (all required integers), recordedAt (required, defaults to now in add mode), notes (optional, max 500 chars)
- Validators derived from \`VALIDATION\` constants
- Inline error messages shown on submit
- Output \`(saved)\` emits form values on valid submit
- Output \`(cancelled)\` emits when user cancels (edit mode only)
- Form resets to empty/defaults after successful save

## MVP Scope
No direct service calls — delegate via outputs."

gh issue create \
  --title "ReadingRowComponent — Row Display + Inline Delete Confirmation" \
  --body "## Description
Create \`src/app/components/reading-row/\` to display a single reading with edit and delete actions.

## Acceptance Criteria
- Input: \`reading: Reading\`
- Displays: date/time, systolic, diastolic, pulse, notes (truncated to 80 chars with ellipsis)
- Edit button emits \`(edit)\` output
- Delete button toggles inline confirmation (no modal); confirm emits \`(delete)\`, cancel hides confirmation

## MVP Scope
No service injection. Inline toggle only — no modal."

gh issue create \
  --title "ReadingListComponent — List Container + Empty State" \
  --body "## Description
Create \`src/app/components/reading-list/\` to render the full list of readings.

## Acceptance Criteria
- Input: \`readings: Reading[]\`
- Renders a \`ReadingRowComponent\` per reading using \`@for\`
- Emits \`(edit)\` and \`(delete)\` outputs (bubbled from rows)
- Shows an empty-state message when \`readings\` is empty

## MVP Scope
No service injection. Purely input/output driven."

gh issue create \
  --title "AppComponent — Shell, Layout, and State Wiring" \
  --body "## Description
Implement \`app.component.ts\` and \`app.component.html\` as the root orchestrator that connects all components and the service.

## Acceptance Criteria
- Hosts \`ReadingFormComponent\`, \`StatsSummaryComponent\`, \`ReadingListComponent\`
- \`editingReading\` signal: \`Signal<Reading | null>\` — null = add mode
- Passes \`readings()\` and \`averages()\` from \`ReadingService\` to child components as inputs
- On \`(saved)\`: calls \`service.add()\` or \`service.update()\` depending on mode; clears \`editingReading\`
- On \`(cancelled)\`: clears \`editingReading\`
- On \`(edit)\`: sets \`editingReading\` to the selected reading
- On \`(delete)\`: calls \`service.delete()\`
- Single-column layout matching the PRD wireframe

## MVP Scope
No router. No NgRx."

gh issue create \
  --title "Responsive Layout + Accessibility" \
  --body "## Description
Apply Tailwind responsive classes and accessibility attributes across all components.

## Acceptance Criteria
- Layout is usable at ≥ 375px viewport width
- All form controls have \`<label>\` elements and ARIA labels
- Delete confirmation and form actions are keyboard navigable
- Semantic HTML throughout (headings, \`<table>\` or \`<dl>\` for readings list, \`<form>\`)
- No horizontal scroll on mobile

## MVP Scope
No new functionality — polish only."
```
