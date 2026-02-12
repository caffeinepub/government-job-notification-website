import { useSyncExternalStore } from 'react';
import { localStorageStore } from '../utils/localStorageStore';
import { DAILY_QUIZ_KEY, DailyQuiz, getDailyQuiz, publishDailyQuiz } from '../features/dailyQuiz/dailyQuizStore';

export function useDailyQuiz() {
  const quiz = useSyncExternalStore(
    (listener) => localStorageStore.subscribe(DAILY_QUIZ_KEY, listener),
    () => localStorageStore.getSnapshot<DailyQuiz | null>(DAILY_QUIZ_KEY, null),
    () => null
  );

  return {
    quiz,
    publish: publishDailyQuiz,
  };
}
