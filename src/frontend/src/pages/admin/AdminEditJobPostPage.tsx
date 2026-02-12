import { useParams, useNavigate } from '@tanstack/react-router';
import { useJobPost } from '../../hooks/useJobPost';
import { useJobPostMutations } from '../../hooks/useJobPostMutations';
import JobPostForm, { type JobPostFormData } from '../../components/admin/JobPostForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import AdminRouteGuard from '../../components/auth/AdminRouteGuard';

function AdminEditJobPostPageContent() {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const postId = params.postId ? BigInt(params.postId) : null;
  const { data: post, isLoading } = useJobPost(postId || 0n);
  const { addJobPost, updateJobPost } = useJobPostMutations();

  const handleSubmit = async (data: JobPostFormData) => {
    try {
      if (postId && post) {
        await updateJobPost.mutateAsync({
          id: postId,
          ...data,
        });
      } else {
        await addJobPost.mutateAsync(data);
      }
      navigate({ to: '/manage' });
    } catch (error) {
      console.error('Error saving job post:', error);
    }
  };

  if (postId && isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/manage' })}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">
            {postId ? 'Edit Job Post' : 'Create New Job Post'}
          </h1>
        </div>

        <JobPostForm
          initialData={post || undefined}
          onSubmit={handleSubmit}
          isSubmitting={addJobPost.isPending || updateJobPost.isPending}
        />
      </div>
    </div>
  );
}

export default function AdminEditJobPostPage() {
  return (
    <AdminRouteGuard>
      <AdminEditJobPostPageContent />
    </AdminRouteGuard>
  );
}
