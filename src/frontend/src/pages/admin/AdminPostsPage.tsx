import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useJobPosts } from '../../hooks/useJobPosts';
import { useJobPostMutations } from '../../hooks/useJobPostMutations';
import AdminRouteGuard from '../../components/auth/AdminRouteGuard';
import DeleteJobPostDialog from '../../components/admin/DeleteJobPostDialog';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { JobPost } from '../../backend';

function AdminPostsContent() {
  const navigate = useNavigate();
  const { data: posts, isLoading, error } = useJobPosts();
  const { deleteJobPost } = useJobPostMutations();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<JobPost | null>(null);

  const handleDeleteClick = (post: JobPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    try {
      await deleteJobPost.mutateAsync(postToDelete.id);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleEditClick = (postId: bigint) => {
    navigate({ to: '/admin/posts/$postId/edit', params: { postId: postId.toString() } });
  };

  const handleCreateClick = () => {
    navigate({ to: '/admin/posts/new' });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-destructive">Error loading posts</p>
      </div>
    );
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      latestJobs: 'Latest Jobs',
      admitCards: 'Admit Cards',
      results: 'Results',
      closedPosts: 'Closed Posts',
    };
    return labels[category] || category;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Job Posts</h1>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Post
        </Button>
      </div>

      {posts && posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No job posts yet. Create your first post!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts?.map((post) => (
            <Card key={post.id.toString()}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{post.name}</CardTitle>
                    <Badge variant="secondary">{getCategoryLabel(post.category)}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(post.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(post)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Vacancies</p>
                    <p className="font-medium">{post.vacancies.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Syllabus</p>
                    <p className="font-medium">{post.syllabusUrl ? 'Available' : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Admit Card</p>
                    <p className="font-medium">{post.admitCardUrl ? 'Available' : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Post ID</p>
                    <p className="font-medium">{post.id.toString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {postToDelete && (
        <DeleteJobPostDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          jobPostName={postToDelete.name}
          isDeleting={deleteJobPost.isPending}
        />
      )}
    </div>
  );
}

export default function AdminPostsPage() {
  return (
    <AdminRouteGuard>
      <AdminPostsContent />
    </AdminRouteGuard>
  );
}
