import { localStorageStore } from '../../utils/localStorageStore';

export const DAILY_QUIZ_KEY = 'dailyQuiz';

export type DailyQuiz = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  publishedAt: string;
};

export function getDailyQuiz(): DailyQuiz | null {
  return localStorageStore.get<DailyQuiz | null>(DAILY_QUIZ_KEY, null);
}

export function publishDailyQuiz(quiz: Omit<DailyQuiz, 'publishedAt'>): void {
  const quizWithTimestamp: DailyQuiz = {
    ...quiz,
    publishedAt: new Date().toISOString(),
  };
  localStorageStore.set(DAILY_QUIZ_KEY, quizWithTimestamp);
}

export function clearDailyQuiz(): void {
  localStorageStore.set(DAILY_QUIZ_KEY, null);
}
