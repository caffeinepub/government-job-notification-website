import { useParams, Link } from '@tanstack/react-router';
import { useJobPost } from '../hooks/useJobPost';
import { ArrowLeft } from 'lucide-react';
import { JobDetailsTables } from '../components/JobDetails/JobDetailsTables';
import { UsefulImportantLinksTable } from '../components/JobDetails/UsefulImportantLinksTable';
import { ImportantLinksButtons } from '../components/JobDetails/ImportantLinksButtons';
import JobPostBlocksRenderer from '../components/JobDetails/JobPostBlocksRenderer';
import JobPosterHero from '../components/JobDetails/JobPosterHero';

export default function PostDetailPage() {
  const { postId } = useParams({ from: '/post/$postId' });
  const { data: post, isLoading, error } = useJobPost(BigInt(postId));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-destructive mb-2">Job Post Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The job post you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/" className="inline-flex items-center text-primary hover:underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Job Poster Hero Banner */}
        <JobPosterHero posterImage={post.posterImage} jobName={post.name} />

        {/* Job Title Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{post.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded">
              {post.category === 'latestJobs' && 'Latest Jobs'}
              {post.category === 'admitCards' && 'Admit Cards'}
              {post.category === 'results' && 'Results'}
              {post.category === 'closedPosts' && 'Closed Posts'}
            </span>
          </div>
        </div>

        {/* Custom Content Blocks (rendered first) */}
        {post.blocks && post.blocks.length > 0 && (
          <div className="mb-8">
            <JobPostBlocksRenderer blocks={post.blocks} />
          </div>
        )}

        {/* Useful Important Links Table */}
        <div className="mb-8">
          <UsefulImportantLinksTable post={post} />
        </div>

        {/* Job Details Tables */}
        <JobDetailsTables post={post} />

        {/* Important Links Buttons */}
        <div className="mt-8">
          <ImportantLinksButtons post={post} />
        </div>
      </div>
    </div>
  );
}
