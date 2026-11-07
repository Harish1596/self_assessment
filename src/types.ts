export type FieldId = string;
export type Rating = 'practice' | 'partial' | 'confident';
export type Source = { title: string; url: string };
export type Concept = {
  id: string;
  field: FieldId;
  title: string;
  summary: string;
  explanation: string[];
  example: string;
  takeaway: string;
  sources: Source[];
  questions: [string, string][];
};
export type Card = {
  id: string;
  conceptId: string;
  field: FieldId;
  question: string;
  answer: string;
};
export type Progress = {
  version: 1;
  read: string[];
  ratings: Record<string, { rating: Rating; reviewedAt: string; reviews: number }>;
};
export type SessionConfig = {
  mode: 'single' | 'multiple' | 'random';
  fields: string[];
  count: number;
  weakOnly: boolean;
};
