import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type JobPost } from '../backend';

export function useAdmitCardPosts() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<JobPost[]>({
    queryKey: ['admitCardPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdmitCardPosts();
    },
    enabled: !!actor && !isActorFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
