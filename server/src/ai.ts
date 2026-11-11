import type { Question } from '../../shared/types';

/**
 * MI modulis (Projektējums 2.1). Gemini API, atslēga — process.env.GEMINI_API_KEY.
 * Bez atslēgas atgriež parauga datus.
 */
export class AiModule {
  async generateQuestions(topic: string, material?: string, count = 5): Promise<Omit<Question, 'id'>[]> {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      topic ||= 'Materiāls';
      return Array.from({ length: count }, (_, i) => ({
        text: `Parauga jautājums ${i + 1} par "${topic}"?`,
        topic,
        options: ['A', 'B', 'C', 'D'],
        correct: 'A',
      }));
    }

    const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
    const prompt =
      `Izveido ${count} izvēles jautājumus (4 atbilžu varianti, viens pareizs) latviešu valodā, lai pārbaudītu studenta zināšanas.` +
      (topic ? `\nTēma: ${topic}` : '') +
      (material ? `\nMācību materiāls:\n${material.slice(0, 100_000)}` : '') +
      `\nLaukā "topic" norādi īsu apakštēmu, "correct" jābūt precīzi vienam no "options".`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                text: { type: 'STRING' },
                topic: { type: 'STRING' },
                options: { type: 'ARRAY', items: { type: 'STRING' } },
                correct: { type: 'STRING' },
              },
              required: ['text', 'topic', 'options', 'correct'],
            },
          },
        },
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Gemini: ${data.error?.message ?? res.statusText}`);
    return JSON.parse(data.candidates[0].content.parts[0].text);
  }

  /** Brīvā teksta atbilžu vērtēšana. Izvēles jautājumiem pietiek ar salīdzināšanu. */
  async checkAnswer(question: Question): Promise<boolean> {
    return question.answer === question.correct;
  }
}

export const ai = new AiModule();
