import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { JobId, ImportantDates, FeeCategory, AgeLimit, VacancyDetail, Category, Block } from '../backend';

interface JobPostInput {
  name: string;
  posterImage: string | null;
  dates: ImportantDates;
  fees: FeeCategory[];
  ageLimit: AgeLimit | null;
  vacancies: VacancyDetail[];
  selectionProcess: string | null;
  syllabusUrl: string | null;
  admitCardUrl: string | null;
  category: Category;
  links: {
    applyOnline?: string;
    notification?: string;
    officialWebsite?: string;
  };
  blocks: Block[];
}

export function useJobPostMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['jobPosts'] });
    queryClient.invalidateQueries({ queryKey: ['jobPost'] });
    queryClient.invalidateQueries({ queryKey: ['syllabusRepository'] });
    queryClient.invalidateQueries({ queryKey: ['admitCardPosts'] });
  };

  const addJobPost = useMutation({
    mutationFn: async (input: JobPostInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addJobPost(
        input.name,
        input.posterImage,
        input.dates,
        input.fees,
        input.ageLimit,
        input.vacancies,
        input.selectionProcess,
        input.syllabusUrl,
        input.admitCardUrl,
        input.category,
        input.links,
        input.blocks
      );
    },
    onSuccess: () => {
      invalidateQueries();
    },
    onError: (error: any) => {
      console.error('Error adding job post:', error);
      throw new Error(error.message || 'Failed to add job post');
    },
  });

  const updateJobPost = useMutation({
    mutationFn: async ({ id, ...input }: JobPostInput & { id: JobId }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJobPost(
        id,
        input.name,
        input.posterImage,
        input.dates,
        input.fees,
        input.ageLimit,
        input.vacancies,
        input.selectionProcess,
        input.syllabusUrl,
        input.admitCardUrl,
        input.category,
        input.links,
        input.blocks
      );
    },
    onSuccess: () => {
      invalidateQueries();
    },
    onError: (error: any) => {
      console.error('Error updating job post:', error);
      throw new Error(error.message || 'Failed to update job post');
    },
  });

  const deleteJobPost = useMutation({
    mutationFn: async (id: JobId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteJobPost(id);
    },
    onSuccess: () => {
      invalidateQueries();
    },
    onError: (error: any) => {
      console.error('Error deleting job post:', error);
      throw new Error(error.message || 'Failed to delete job post');
    },
  });

  return {
    addJobPost,
    updateJobPost,
    deleteJobPost,
  };
}
