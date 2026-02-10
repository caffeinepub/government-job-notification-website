import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Category, type JobPost } from '../backend';

export function useJobPosts(category?: Category) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<JobPost[]>({
    queryKey: ['jobPosts', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJobPostsByCategory(category ?? null);
    },
    enabled: !!actor && !isActorFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
