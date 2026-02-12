import { useJobPosts } from '../hooks/useJobPosts';
import { useHomeCards } from '../hooks/useHomeCards';
import { Category } from '../backend';
import { Link } from '@tanstack/react-router';
import { Calendar, IndianRupee, FileText, Award, ClipboardList } from 'lucide-react';
import { QuickOfficialLinks } from '../components/home/QuickOfficialLinks';
import { StudyCornerSection } from '../components/home/StudyCornerSection';
import { SimpleJobsSection } from '../components/home/SimpleJobsSection';
import { VerticalTickerList } from '../components/home/VerticalTickerList';
import { PreparationResourcesSection } from '../components/home/PreparationResourcesSection';
import DailyQuizSection from '../components/home/DailyQuizSection';
import { SarkariSchemesSection } from '../components/home/SarkariSchemesSection';
import { useJobSearch } from '../contexts/JobSearchContext';

type BackendItem = {
  type: 'backend';
  id: string;
  post: any;
  index: number;
};

type FallbackItem = {
  type: 'fallback';
  id: string;
  item: any;
  index: number;
};

type JobItem = BackendItem | FallbackItem;

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
  const { items: homeCardItems } = useHomeCards();
  const { searchQuery } = useJobSearch();

  // Filter home card items by category
  const categoryKey = category === Category.latestJobs ? 'latestJobs' 
    : category === Category.admitCards ? 'admitCards' 
    : 'results';
  const fallbackItems = homeCardItems.filter(item => item.category === categoryKey);

  // Combine backend posts and fallback items for rendering
  let allItems: JobItem[] = posts && posts.length > 0 
    ? posts.map((post, index) => ({
        type: 'backend' as const,
        id: post.id.toString(),
        post,
        index,
      }))
    : fallbackItems.map((item, index) => ({
        type: 'fallback' as const,
        id: item.id,
        item,
        index,
      }));

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    allItems = allItems.filter((item): item is JobItem => {
      if (item.type === 'backend') {
        return item.post.name.toLowerCase().includes(query);
      } else {
        return item.item.title.toLowerCase().includes(query);
      }
    });
  }

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
        
        {!isLoading && !error && allItems.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground text-center">
            {searchQuery.trim() ? 'No matching posts found.' : 'No posts available at the moment.'}
          </div>
        )}
        
        {!isLoading && !error && allItems.length > 0 && (
          <VerticalTickerList speed={30}>
            {allItems.map((item) => {
              const isNew = item.index < 3;
              
              if (item.type === 'backend') {
                const { post } = item;
                const feesDisplay = post.fees.length > 0 
                  ? post.fees.map(f => `${f.name}: ${f.amount}`).join(', ')
                  : 'See details';

                return (
                  <Link
                    key={item.id}
                    to="/post/$postId"
                    params={{ postId: post.id.toString() }}
                    className="block p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      {isNew && (
                        <img 
                          src="/assets/generated/new-badge.dim_48x24.png" 
                          alt="NEW" 
                          className="w-12 h-6 flex-shrink-0 animate-blink"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-2 leading-tight">
                          {post.name}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                          {post.importantDates.applicationBegin && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Start: {post.importantDates.applicationBegin}</span>
                            </div>
                          )}
                          {post.importantDates.lastDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Last: {post.importantDates.lastDate}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" />
                            <span className="truncate" title={feesDisplay}>Fee: {feesDisplay}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              } else {
                const { item: cardItem } = item;
                return (
                  <div
                    key={item.id}
                    className="block p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      {isNew && (
                        <img 
                          src="/assets/generated/new-badge.dim_48x24.png" 
                          alt="NEW" 
                          className="w-12 h-6 flex-shrink-0 animate-blink"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-2 leading-tight">
                          {cardItem.title}
                        </h3>
                        <div className="text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Last Date: {cardItem.lastDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </VerticalTickerList>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Daily Quiz Section with anchor */}
      <div id="daily-quiz" className="mb-8 scroll-mt-20">
        <DailyQuizSection />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Main content - Job categories */}
        <div className="lg:col-span-3 space-y-6">
          {/* Simple Jobs Section */}
          <SimpleJobsSection />
          
          {/* Backend Job Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Sidebar - Quick Official Links */}
        <div className="lg:col-span-1">
          <QuickOfficialLinks />
        </div>
      </div>

      {/* Sarkari Schemes Section */}
      <div className="mb-8">
        <SarkariSchemesSection />
      </div>

      {/* Preparation & Resources Section */}
      <div className="mb-8">
        <PreparationResourcesSection />
      </div>

      {/* Study Corner Section with anchor */}
      <div id="study-material" className="scroll-mt-20">
        <StudyCornerSection />
      </div>
    </div>
  );
}
