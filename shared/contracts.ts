import type { Card, Concept, Progress, Rating, SessionConfig } from '../src/types';

export type QuestionKind = 'recall' | 'single_choice' | 'multiple_choice';
export type Choice = { id: string; label: string; correct: boolean };
export type Field = { id: string; name: string; description: string; color: string };
export type StoredCard = Card & {
  revisionId: string;
  revision: number;
  kind: QuestionKind;
  answers: string[];
  choices: Choice[];
};
export type Catalogue = {
  fields: Field[];
  concepts: Concept[];
  cards: StoredCard[];
};
export type SessionStatus = 'active' | 'paused' | 'completed' | 'abandoned';
export type SessionItem = {
  id: string;
  position: number;
  card: StoredCard;
  answerText: string;
  selectedChoiceIds: string[];
  status: 'pending' | 'revealed' | 'reviewed';
  rating: Rating | null;
  correct: boolean | null;
  revealedAt: string | null;
  reviewedAt: string | null;
};
export type StoredSession = {
  id: string;
  status: SessionStatus;
  config: SessionConfig;
  selectedFields: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
  finishedAt: string | null;
  items: SessionItem[];
};
export type SessionSummary = Omit<StoredSession, 'items'> & {
  total: number;
  reviewed: number;
};
export type Bootstrap = { catalogue: Catalogue; progress: Progress; sessions: SessionSummary[] };
export type CardInput = {
  id: string;
  conceptId: string;
  kind: QuestionKind;
  question: string;
  answers: string[];
  choices: Choice[];
};
export type CatalogueInput = {
  fields: Field[];
  concepts: Omit<Concept, 'questions'>[];
  cards: CardInput[];
};
