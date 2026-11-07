import type { CardInput, Choice } from './contracts';

export class ValidationError extends Error {}

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ValidationError(`${label} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string, limit: number): string {
  if (typeof value !== 'string' || !value.trim() || value.length > limit || value.includes('\0')) {
    throw new ValidationError(`${label} must be nonempty text of at most ${limit} characters.`);
  }
  return value.trim();
}

function id(value: unknown, label: string): string {
  const result = text(value, label, 200);
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/.test(result)) {
    throw new ValidationError(`${label} contains unsupported characters.`);
  }
  return result;
}

/** Validate content before creating a card revision; no database writes occur here. */
export function validateCardInput(value: unknown): CardInput {
  const input = record(value, 'Card');
  if (!['recall', 'single_choice', 'multiple_choice'].includes(String(input.kind))) {
    throw new ValidationError('Choose recall, single_choice or multiple_choice.');
  }
  if (!Array.isArray(input.answers) || input.answers.length < 1 || input.answers.length > 100) {
    throw new ValidationError('Provide between 1 and 100 accepted answers.');
  }
  const answers = input.answers.map((answer) => text(answer, 'Accepted answer', 50_000));
  if (new Set(answers).size !== answers.length) {
    throw new ValidationError('Accepted answers must not contain duplicates.');
  }
  if (!Array.isArray(input.choices) || input.choices.length > 100) {
    throw new ValidationError('Choices must be a list of at most 100 options.');
  }
  const choices: Choice[] = input.choices.map((value) => {
    const choice = record(value, 'Choice');
    if (typeof choice.correct !== 'boolean') {
      throw new ValidationError('Each choice must specify whether it is correct.');
    }
    return {
      id: id(choice.id, 'Choice ID'),
      label: text(choice.label, 'Choice label', 5000),
      correct: choice.correct,
    };
  });
  if (new Set(choices.map((choice) => choice.id)).size !== choices.length) {
    throw new ValidationError('Choice IDs must be unique within a card.');
  }
  if (input.kind === 'recall' && choices.length) {
    throw new ValidationError('Written recall cards cannot contain selectable choices.');
  }
  if (input.kind !== 'recall') {
    if (choices.length < 2) throw new ValidationError('Provide at least two selectable choices.');
    const correct = choices.filter((choice) => choice.correct).length;
    if (input.kind === 'single_choice' ? correct !== 1 : correct < 1) {
      throw new ValidationError(
        'Single-choice cards need one correct option; multiple-choice cards need at least one.',
      );
    }
  }
  return {
    id: id(input.id, 'Card ID'),
    conceptId: id(input.conceptId, 'Concept ID'),
    kind: input.kind as CardInput['kind'],
    question: text(input.question, 'Question', 20_000),
    answers,
    choices,
  };
}

export function validateResponse(
  value: unknown,
  card: Pick<CardInput, 'kind' | 'choices'>,
): { answerText: string; selectedChoiceIds: string[] } {
  const response = record(value, 'Response');
  if (
    typeof response.answerText !== 'string' ||
    response.answerText.length > 50_000 ||
    response.answerText.includes('\0') ||
    !Array.isArray(response.selectedChoiceIds) ||
    !response.selectedChoiceIds.every((choice) => typeof choice === 'string')
  ) {
    throw new ValidationError('Provide answer text and a list of selected choice IDs.');
  }
  const selected = response.selectedChoiceIds as string[];
  const available = new Set(card.choices.map((choice) => choice.id));
  if (
    new Set(selected).size !== selected.length ||
    selected.some((choice) => !available.has(choice))
  ) {
    throw new ValidationError('Selected choices must be unique and belong to this card.');
  }
  if (
    (card.kind === 'recall' && selected.length) ||
    (card.kind === 'single_choice' && selected.length > 1)
  ) {
    throw new ValidationError('The selection does not match this card’s answer type.');
  }
  return { answerText: response.answerText, selectedChoiceIds: [...selected] };
}

/** Written recall is self-assessed; selectable questions require the exact correct set. */
export function evaluateChoices(
  card: Pick<CardInput, 'kind' | 'choices'>,
  selected: string[],
): boolean | null {
  if (card.kind === 'recall') return null;
  const expected = new Set(
    card.choices.filter((choice) => choice.correct).map((choice) => choice.id),
  );
  return (
    selected.length === expected.size &&
    new Set(selected).size === selected.length &&
    selected.every((choice) => expected.has(choice))
  );
}
