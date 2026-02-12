import { useSyllabusRepository } from '../hooks/useSyllabusRepository';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { getLinkStatus } from '../utils/linkAvailability';

export default function SyllabusRepositoryPage() {
  const { data: posts, isLoading, error } = useSyllabusRepository();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
            <FileText className="w-7 h-7" />
            Syllabus Repository
          </h1>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-card border border-border rounded-sm p-4 animate-pulse">
                <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
            <FileText className="w-7 h-7" />
            Syllabus Repository
          </h1>
          <div className="bg-destructive/10 border border-destructive/20 rounded-sm p-6 text-center">
            <p className="text-destructive">Error loading syllabus repository. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <FileText className="w-7 h-7" />
          Syllabus Repository
        </h1>
        <p className="text-muted-foreground mb-6">
          Download syllabus PDFs directly without opening the full job post
        </p>

        {!posts || posts.length === 0 ? (
          <div className="bg-card border border-border rounded-sm p-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No syllabus available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => {
              const syllabusStatus = getLinkStatus(post.syllabusUrl);
              
              return (
                <div
                  key={post.id.toString()}
                  className="bg-card border border-border rounded-sm p-4 md:p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link
                        to="/post/$postId"
                        params={{ postId: post.id.toString() }}
                        className="text-base md:text-lg font-semibold text-foreground hover:text-primary transition-colors block mb-2"
                      >
                        {post.name}
                      </Link>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {post.importantDates.applicationBegin && (
                          <span>Start: {post.importantDates.applicationBegin}</span>
                        )}
                        {post.importantDates.lastDate && (
                          <span>Last Date: {post.importantDates.lastDate}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      {syllabusStatus.isAvailable ? (
                        <>
                          <a
                            href={post.syllabusUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold px-5 py-3 rounded-sm hover:bg-secondary/80 transition-colors border border-border min-h-[48px]"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Syllabus
                          </a>
                          <a
                            href={post.syllabusUrl!}
                            download
                            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-sm hover:bg-primary/90 transition-colors min-h-[48px]"
                          >
                            <FileText className="w-4 h-4" />
                            <Download className="w-4 h-4" />
                            Download PDF
                          </a>
                        </>
                      ) : (
                        <div className="inline-flex items-center justify-center gap-2 bg-muted text-muted-foreground font-semibold px-5 py-3 rounded-sm border border-border cursor-not-allowed min-h-[48px]">
                          <FileText className="w-4 h-4" />
                          {syllabusStatus.label}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
