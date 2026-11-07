import { describe, expect, it } from 'vitest';
import { evaluateChoices, validateCardInput, validateResponse } from './validation';

const recall = {
  id: 'binary-1',
  conceptId: 'binary',
  kind: 'recall',
  question: 'Which digits does binary use?',
  answers: ['0 and 1', 'Zero and one'],
  choices: [],
};
const multiple = {
  ...recall,
  id: 'devices-1',
  kind: 'multiple_choice',
  question: 'Select input devices.',
  answers: ['Keyboard and microphone'],
  choices: [
    { id: 'keyboard', label: 'Keyboard', correct: true },
    { id: 'speaker', label: 'Speaker', correct: false },
    { id: 'microphone', label: 'Microphone', correct: true },
  ],
};

describe('card definitions', () => {
  it('accepts several written answers without confusing them with selectable choices', () => {
    expect(validateCardInput(recall).answers).toEqual(['0 and 1', 'Zero and one']);
    expect(() => validateCardInput({ ...recall, choices: multiple.choices })).toThrow(/recall/);
  });
  it('supports multiple correct choices while enforcing single-choice semantics', () => {
    expect(validateCardInput(multiple).choices.filter((choice) => choice.correct)).toHaveLength(2);
    expect(() => validateCardInput({ ...multiple, kind: 'single_choice' })).toThrow(/one correct/);
    const single = { ...multiple, kind: 'single_choice', choices: multiple.choices.slice(0, 2) };
    expect(validateCardInput(single).kind).toBe('single_choice');
  });
  it('rejects unusable definitions before storage', () => {
    for (const input of [
      { ...recall, answers: [] },
      { ...recall, answers: ['x', 'x'] },
      { ...recall, question: ' ' },
      { ...recall, kind: 'unknown' },
      { ...multiple, choices: [multiple.choices[0], multiple.choices[0]] },
      { ...multiple, choices: multiple.choices.map((choice) => ({ ...choice, correct: false })) },
    ])
      expect(() => validateCardInput(input)).toThrow();
  });
});

describe('session responses', () => {
  it('preserves written text and validates choice IDs against the session card', () => {
    const card = validateCardInput(multiple);
    const answer = { answerText: 'My reasoning\n', selectedChoiceIds: ['keyboard', 'microphone'] };
    expect(validateResponse(answer, card)).toEqual(answer);
    expect(() =>
      validateResponse({ ...answer, selectedChoiceIds: ['another-card-choice'] }, card),
    ).toThrow(/belong/);
    expect(() =>
      validateResponse({ ...answer, selectedChoiceIds: ['keyboard', 'keyboard'] }, card),
    ).toThrow(/unique/);
  });
  it('does not silently accept multiple selections for a single-choice card', () => {
    const card = validateCardInput({
      ...multiple,
      kind: 'single_choice',
      choices: multiple.choices.slice(0, 2),
    });
    expect(() =>
      validateResponse({ answerText: '', selectedChoiceIds: ['keyboard', 'speaker'] }, card),
    ).toThrow(/type/);
  });
  it('requires the exact correct set and leaves written answers self-assessed', () => {
    const card = validateCardInput(multiple);
    expect(evaluateChoices(card, ['microphone', 'keyboard'])).toBe(true);
    expect(evaluateChoices(card, ['keyboard'])).toBe(false);
    expect(evaluateChoices(card, ['keyboard', 'microphone', 'speaker'])).toBe(false);
    expect(evaluateChoices(card, ['keyboard', 'keyboard'])).toBe(false);
    expect(evaluateChoices(validateCardInput(recall), [])).toBeNull();
  });
});
