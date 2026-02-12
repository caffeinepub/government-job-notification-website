import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Scheme } from '../backend';

export function useSchemes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Scheme[]>({
    queryKey: ['schemes'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSchemes();
    },
    enabled: !!actor && !actorFetching,
  });
}
