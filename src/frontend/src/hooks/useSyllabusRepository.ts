import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type JobPost } from '../backend';

export function useSyllabusRepository() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<JobPost[]>({
    queryKey: ['syllabusRepository'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSyllabusRepository();
    },
    enabled: !!actor && !isActorFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
