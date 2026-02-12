import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export function useSchemeMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const addScheme = useMutation({
    mutationFn: async (data: { name: string; category: string; link: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addScheme(data.name, data.category, data.link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
      toast.success('Scheme added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add scheme');
    },
  });

  const updateScheme = useMutation({
    mutationFn: async (data: { id: bigint; name: string; category: string; link: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateScheme(data.id, data.name, data.category, data.link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
      toast.success('Scheme updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update scheme');
    },
  });

  const deleteScheme = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteScheme(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
      toast.success('Scheme deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete scheme');
    },
  });

  return {
    addScheme,
    updateScheme,
    deleteScheme,
  };
}
