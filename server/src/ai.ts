import type { Question } from '../../shared/types';

/**
 * MI modulis (Projektējums 2.1). Šobrīd atgriež iekodētus datus.
 * TODO: aizstāt ar OpenAI / Gemini API izsaukumu (atslēga — process.env).
 */
export class AiModule {
  async generateQuestions(topic: string, material?: string, count = 5): Promise<Omit<Question, 'id'>[]> {
    return Array.from({ length: count }, (_, i) => ({
      text: `Parauga jautājums ${i + 1} par "${topic}"?`,
      topic,
      options: ['A', 'B', 'C', 'D'],
      correct: 'A',
    }));
  }

  /** Brīvā teksta atbilžu vērtēšana. Izvēles jautājumiem pietiek ar salīdzināšanu. */
  async checkAnswer(question: Question): Promise<boolean> {
    return question.answer === question.correct;
  }
}

export const ai = new AiModule();
