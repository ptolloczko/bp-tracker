export interface Reading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  recordedAt: string; // ISO 8601
  notes?: string;
}

export const VALIDATION = {
  systolic:  { min: 60,  max: 250 },
  diastolic: { min: 40,  max: 150 },
  pulse:     { min: 30,  max: 200 },
  notes:     { maxLength: 500 },
} as const;
