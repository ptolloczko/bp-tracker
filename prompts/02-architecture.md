# Architecture — Blood Pressure Tracker MVP

**Version:** 1.0
**Date:** 2026-03-03
**Refs:** [01-prd.md](./01-prd.md)

---

## 1. Guiding Principles

- One service, one concern — no cross-cutting state
- Signals over subscriptions — no RxJS unless Angular forces it
- Flat component tree — no unnecessary abstraction for MVP scale
- No NgModules — standalone components throughout

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────┐
│                  App Shell                  │
│              (app.component.ts)             │
│                                             │
│  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Reading Form   │  │  Stats Summary  │  │
│  │   (add/edit)    │  │  (avg sys/dia)  │  │
│  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────────────────────────┐    │
│  │           Reading List              │    │
│  │  ┌──────────────────────────────┐  │    │
│  │  │        Reading Row           │  │    │
│  │  │  (display + edit + delete)   │  │    │
│  │  └──────────────────────────────┘  │    │
│  └─────────────────────────────────┘   │    │
└─────────────────────────────────────────────┘
         │ inject           │ inject
         ▼                  ▼
┌─────────────────────────────────────────────┐
│            ReadingService (signal store)    │
│  readings: Signal<Reading[]>                │
│  add() / update() / delete() / averages()  │
└─────────────────────────────────────────────┘
         │ read / write
         ▼
┌─────────────────────────────────────────────┐
│         localStorage ('bp-tracker-readings')│
└─────────────────────────────────────────────┘
```

---

## 3. Folder Structure

```
src/
├── app/
│   ├── models/
│   │   └── reading.model.ts          # Reading interface + validation constants
│   │
│   ├── services/
│   │   └── reading.service.ts        # Signal store + localStorage I/O
│   │
│   ├── components/
│   │   ├── reading-form/
│   │   │   ├── reading-form.component.ts
│   │   │   └── reading-form.component.html
│   │   │
│   │   ├── reading-list/
│   │   │   ├── reading-list.component.ts
│   │   │   └── reading-list.component.html
│   │   │
│   │   ├── reading-row/
│   │   │   ├── reading-row.component.ts
│   │   │   └── reading-row.component.html
│   │   │
│   │   └── stats-summary/
│   │       ├── stats-summary.component.ts
│   │       └── stats-summary.component.html
│   │
│   ├── app.component.ts
│   ├── app.component.html
│   └── app.config.ts
│
├── styles.css                        # Tailwind directives
└── main.ts
```

---

## 4. Model

```ts
// models/reading.model.ts

export interface Reading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  recordedAt: string;   // ISO 8601
  notes?: string;
}

export const VALIDATION = {
  systolic:  { min: 60,  max: 250 },
  diastolic: { min: 40,  max: 150 },
  pulse:     { min: 30,  max: 200 },
  notes:     { maxLength: 500 },
} as const;
```

---

## 5. Service

```ts
// services/reading.service.ts
@Injectable({ providedIn: 'root' })
export class ReadingService {
  private readonly STORAGE_KEY = 'bp-tracker-readings';

  readonly readings = signal<Reading[]>(this.load());

  readonly averages = computed(() => {
    const r = this.readings();
    if (!r.length) return null;
    return {
      systolic:  round1(avg(r.map(x => x.systolic))),
      diastolic: round1(avg(r.map(x => x.diastolic))),
    };
  });

  add(reading: Omit<Reading, 'id'>): void { ... }
  update(id: string, changes: Omit<Reading, 'id'>): void { ... }
  delete(id: string): void { ... }

  private load(): Reading[] { ... }   // JSON.parse from localStorage
  private save(): void { ... }        // JSON.stringify to localStorage
}
```

---

## 6. Components

### 6.1 `AppComponent`
- Root shell, layout only
- Hosts `ReadingForm`, `StatsSummary`, `ReadingList`
- Manages `editingReading` signal — the single selected reading for editing (null = add mode)
- Passes `editingReading` into `ReadingForm`; receives save/cancel events

### 6.2 `ReadingFormComponent`
- Input: `reading: Reading | null` (null = add mode, non-null = edit mode)
- Reactive Form with validators derived from `VALIDATION` constants
- Emits `(saved)` on success — parent calls service
- Emits `(cancelled)` — parent clears editing state
- Date field defaults to `new Date().toISOString()` in add mode

### 6.3 `StatsSummaryComponent`
- Input: `averages: { systolic: number; diastolic: number } | null`
- Pure display — no logic, no service injection
- Shows "—" when averages are null

### 6.4 `ReadingListComponent`
- Input: `readings: Reading[]`
- Renders a `ReadingRowComponent` per reading via `@for`
- Emits `(edit)` and `(delete)` up to `AppComponent`
- Shows empty state when readings array is empty

### 6.5 `ReadingRowComponent`
- Input: `reading: Reading`
- Outputs: `(edit)`, `(delete)`
- Inline delete confirmation (toggle, no modal for MVP)
- Truncates notes at 80 chars with ellipsis

---

## 7. State Flow

```
User action
    │
    ▼
Component emits output event
    │
    ▼
AppComponent calls ReadingService method
    │
    ▼
Service mutates signal + writes localStorage
    │
    ▼
Signals propagate → components re-render
```

No event bus. No shared mutable state outside the service.

---

## 8. Key Design Decisions

| Decision | Rationale |
|---|---|
| `editingReading` lives in `AppComponent`, not service | It's UI state, not domain state |
| `averages` is a `computed()` on the service | Derives automatically, never stale |
| No modal for delete confirmation | Inline toggle is simpler for MVP |
| `StatsSummary` is input-driven (no service injection) | Keeps it a pure presentational component |
| Single `@for` loop, no virtual scroll | Overkill for typical BP reading volumes |

---

## 9. What We Are Deliberately Not Building

- Router — one page, no need
- NgRx or external state library — signals are sufficient
- Separate CSS files — Tailwind utilities inline in templates
- Unit tests — post-MVP
- Error boundary / toast system — form validation is enough for MVP
