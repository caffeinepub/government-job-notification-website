import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { useClientAdminAuth } from './useClientAdminAuth';

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const { isUnlocked } = useClientAdminAuth();

  const query = useQuery<boolean>({
    queryKey: ['isAdmin', identity?.getPrincipal().toString(), isUnlocked],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isAdmin();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
    staleTime: 0, // Always refetch to ensure fresh admin status
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
