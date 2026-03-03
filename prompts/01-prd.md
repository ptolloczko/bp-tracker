# PRD — Blood Pressure Tracker MVP

**Version:** 1.0
**Date:** 2026-03-03
**Status:** Draft

---

## 1. Problem Statement

People managing hypertension or monitoring cardiovascular health have no simple, private tool to log and review blood pressure readings offline. Existing apps are bloated, require accounts, or send data to the cloud.

---

## 2. Goal

Deliver a single-page, client-only Angular application that lets one user log, review, and understand their blood pressure history — with zero backend and zero sign-in friction.

---

## 3. Users

| Persona | Description |
|---|---|
| Primary | Adult managing or monitoring blood pressure, using a personal device |

Single-user. No authentication. No data sharing.

---

## 4. Scope

### In Scope (MVP)
- Add a blood pressure reading
- Edit and delete readings
- View all readings in a list
- View average systolic and diastolic across all readings
- Persist data in `localStorage`
- Responsive layout (mobile + desktop)

### Out of Scope (MVP)
- User accounts or authentication
- Backend or cloud sync
- Charts or trend visualizations
- Date range filtering
- Clinical color-coding or risk classification
- Multi-user support
- Export / import

---

## 5. Functional Requirements

### 5.1 Add Reading

- Form fields:
  - **Systolic** (integer, required) — valid range: 60–250 mmHg
  - **Diastolic** (integer, required) — valid range: 40–150 mmHg
  - **Pulse** (integer, required) — valid range: 30–200 bpm
  - **Date & Time** (datetime, required) — defaults to current date/time
  - **Notes** (free text, optional) — max 500 characters
- Inline validation with clear error messages on submit
- On success: reading appears in list, form resets

### 5.2 Edit Reading

- Each reading has an Edit action
- Opens the form pre-populated with existing values
- Same validation rules apply
- On save: reading updates in place

### 5.3 Delete Reading

- Each reading has a Delete action
- Requires confirmation before deletion
- On confirm: reading is removed from list and storage

### 5.4 Reading List

- Displays all readings in insertion order (no sorting in MVP)
- Each row shows: date/time, systolic, diastolic, pulse, notes (truncated), edit and delete actions
- Empty state message when no readings exist

### 5.5 Summary Stats

- Displayed above the reading list
- Shows **average systolic** and **average diastolic** across all readings
- Rounded to one decimal place
- Hidden (or shows "—") when no readings exist

### 5.6 Persistence

- All data stored in `localStorage` under a single key (`bp-tracker-readings`)
- Data survives page refresh and browser restart
- No external calls of any kind

---

## 6. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Responsive | Mobile (≥ 375px) through desktop |
| Performance | Loads in < 2s on a mid-range device |
| Accessibility | Keyboard navigable, semantic HTML, ARIA labels on form controls |
| Browser support | Latest Chrome, Firefox, Safari, Edge |
| Privacy | No network requests; all data stays on device |

---

## 7. Technical Decisions

| Concern | Decision | Rationale |
|---|---|---|
| Framework | Angular 19 | Stated requirement |
| Components | Standalone (no NgModules) | Modern Angular best practice |
| Styling | Tailwind CSS | Utility-first, no design system dependency |
| State | Angular Signals + injectable service | Lightweight, reactive, no NgRx overhead for MVP |
| Storage | `localStorage` via a typed service | Simple, sufficient for single-user MVP |
| Forms | Angular Reactive Forms | Fine-grained validation control |

---

## 8. Data Model

```ts
interface Reading {
  id: string;           // crypto.randomUUID()
  systolic: number;     // 60–250
  diastolic: number;    // 40–150
  pulse: number;        // 30–200
  recordedAt: string;   // ISO 8601 datetime
  notes?: string;       // max 500 chars
}
```

---

## 9. UI Layout (Single Page)

```
┌─────────────────────────────────┐
│  Blood Pressure Tracker         │
├─────────────────────────────────┤
│  [ Add Reading Form ]           │
│  Systolic | Diastolic | Pulse   │
│  Date & Time | Notes            │
│  [ Save ]                       │
├─────────────────────────────────┤
│  Avg Systolic: 122.4            │
│  Avg Diastolic: 79.1            │
├─────────────────────────────────┤
│  Reading List                   │
│  Date | Sys | Dia | Pulse | ... │
│  [Edit] [Delete]                │
└─────────────────────────────────┘
```

---

## 10. Success Criteria

- User can add, edit, and delete readings without errors
- Validation blocks invalid input with clear messages
- Averages update correctly after every add, edit, or delete
- Data persists across page refresh
- Layout is usable on a 375px mobile screen

---

## 11. Open Questions

| # | Question | Owner |
|---|---|---|
| 1 | Should readings eventually support export to CSV? | PM |
| 2 | Do we want a max reading count before prompting cleanup? | PM |
| 3 | Is there a future multi-device sync requirement? | PM |
