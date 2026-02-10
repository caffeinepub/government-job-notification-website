import { useJobPosts } from '../hooks/useJobPosts';
import { Category } from '../backend';
import { Link } from '@tanstack/react-router';
import { Calendar, IndianRupee, FileText, Award, ClipboardList } from 'lucide-react';

function CategorySection({ 
  title, 
  category, 
  icon: Icon 
}: { 
  title: string; 
  category: Category;
  icon: React.ElementType;
}) {
  const { data: posts, isLoading, error } = useJobPosts(category);

  return (
    <div className="bg-card border border-border rounded-sm">
      <div className="bg-accent border-b border-border px-4 py-3">
        <h2 className="text-lg font-bold text-accent-foreground flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </h2>
      </div>
      
      <div className="divide-y divide-border">
        {isLoading && (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="p-4 text-sm text-destructive">
            Error loading posts. Please try again later.
          </div>
        )}
        
        {!isLoading && !error && posts && posts.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground text-center">
            No posts available at the moment.
          </div>
        )}
        
        {!isLoading && !error && posts && posts.length > 0 && (
          <>
            {posts.map((post) => (
              <Link
                key={post.id.toString()}
                to="/post/$postId"
                params={{ postId: post.id.toString() }}
                className="block p-4 hover:bg-accent/50 transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-2 leading-tight">
                  {post.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Start: {post.importantDates.startDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Last: {post.importantDates.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" />
                    <span>Fee: {post.fees}</span>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CategorySection 
          title="Latest Jobs" 
          category={Category.latestJobs}
          icon={ClipboardList}
        />
        <CategorySection 
          title="Admit Cards" 
          category={Category.admitCards}
          icon={FileText}
        />
        <CategorySection 
          title="Results" 
          category={Category.results}
          icon={Award}
        />
      </div>
    </div>
  );
}
