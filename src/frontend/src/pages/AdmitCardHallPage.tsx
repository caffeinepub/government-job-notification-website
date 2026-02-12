import { useAdmitCardPosts } from '../hooks/useAdmitCardPosts';
import { CreditCard, Download, Calendar } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { getLinkStatus } from '../utils/linkAvailability';
import { useJobSearch } from '../contexts/JobSearchContext';

export default function AdmitCardHallPage() {
  const { data: posts, isLoading, error } = useAdmitCardPosts();
  const { searchQuery } = useJobSearch();

  // Apply search filter
  let filteredPosts = posts || [];
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter((post) => post.name.toLowerCase().includes(query));
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
            <CreditCard className="w-7 h-7" />
            Admit Card Hall
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
            <CreditCard className="w-7 h-7" />
            Admit Card Hall
          </h1>
          <div className="bg-destructive/10 border border-destructive/20 rounded-sm p-6 text-center">
            <p className="text-destructive">Error loading admit cards. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <CreditCard className="w-7 h-7" />
          Admit Card Hall
        </h1>
        <p className="text-muted-foreground mb-6">
          Active admit card download links, sorted by newest first
        </p>

        {filteredPosts.length === 0 ? (
          <div className="bg-card border border-border rounded-sm p-8 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchQuery.trim() ? 'No matching admit cards found.' : 'No admit cards available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => {
              const admitCardStatus = getLinkStatus(post.admitCardUrl);
              
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
                        {post.importantDates.examDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Exam: {post.importantDates.examDate}
                          </span>
                        )}
                        {post.importantDates.lastDate && (
                          <span>Last Date: {post.importantDates.lastDate}</span>
                        )}
                      </div>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-sm ${
                            admitCardStatus.isAvailable
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {admitCardStatus.isAvailable ? '✓ Available Now' : admitCardStatus.label}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      {admitCardStatus.isAvailable ? (
                        <a
                          href={post.admitCardUrl!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-sm hover:bg-primary/90 transition-colors min-h-[48px]"
                        >
                          <Download className="w-5 h-5" />
                          Download Admit Card
                        </a>
                      ) : (
                        <div className="inline-flex items-center justify-center gap-2 bg-muted text-muted-foreground font-semibold px-6 py-3 rounded-sm border border-border cursor-not-allowed min-h-[48px]">
                          <CreditCard className="w-5 h-5" />
                          {admitCardStatus.label}
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
