import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type JobPost, type JobId } from '../backend';

export function useJobPost(id: JobId) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<JobPost | null>({
    queryKey: ['jobPost', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getJobPost(id);
      } catch (error) {
        console.error('Error fetching job post:', error);
        return null;
      }
    },
    enabled: !!actor && !isActorFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
