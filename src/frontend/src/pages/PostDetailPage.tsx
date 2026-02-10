import { useParams, Link } from '@tanstack/react-router';
import { useJobPost } from '../hooks/useJobPost';
import { Calendar, IndianRupee, ExternalLink, Download, Globe, FileText, ArrowLeft } from 'lucide-react';

export default function PostDetailPage() {
  const { postId } = useParams({ from: '/post/$postId' });
  const { data: post, isLoading, error } = useJobPost(BigInt(postId));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-destructive/10 border border-destructive/20 rounded-sm p-6 text-center">
            <h2 className="text-xl font-bold text-destructive mb-2">Post Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The job post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <div className="bg-accent border-b border-border px-6 py-4">
            <h1 className="text-2xl font-bold text-accent-foreground">{post.name}</h1>
          </div>

          <div className="p-6 space-y-6">
            {/* Important Dates Section */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Important Dates
              </h2>
              <div className="bg-muted/50 border border-border rounded-sm p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Start Date</div>
                    <div className="font-semibold text-foreground">{post.importantDates.startDate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Last Date</div>
                    <div className="font-semibold text-foreground">{post.importantDates.endDate}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Fees Section */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                Application Fees
              </h2>
              <div className="bg-muted/50 border border-border rounded-sm p-4">
                <div className="font-semibold text-foreground">{post.fees}</div>
              </div>
            </section>

            {/* Important Links Section */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Important Links
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={post.links.applyOnline}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-3 rounded-sm hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Apply Online
                </a>
                <a
                  href={post.links.notification}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold px-4 py-3 rounded-sm hover:bg-secondary/80 transition-colors border border-border"
                >
                  <Download className="w-4 h-4" />
                  Download Notification
                </a>
                <a
                  href={post.links.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold px-4 py-3 rounded-sm hover:bg-secondary/80 transition-colors border border-border"
                >
                  <Globe className="w-4 h-4" />
                  Official Website
                </a>
              </div>
            </section>

            {/* Syllabus Section */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Syllabus
              </h2>
              <div className="bg-muted/50 border border-border rounded-sm p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={post.syllabusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold px-4 py-2 rounded-sm hover:bg-secondary/80 transition-colors border border-border"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Syllabus
                  </a>
                  <a
                    href={post.syllabusUrl}
                    download
                    className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold px-4 py-2 rounded-sm hover:bg-secondary/80 transition-colors border border-border"
                  >
                    <Download className="w-4 h-4" />
                    Download Syllabus
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
