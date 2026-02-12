import { useState } from 'react';
import { useSchemes } from '../../hooks/useSchemes';
import { ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import type { Scheme } from '../../backend';

export function SarkariSchemesSection() {
  const { data: schemes, isLoading, error } = useSchemes();
  const [activeTab, setActiveTab] = useState<'Rajasthan' | 'India'>('Rajasthan');

  const filteredSchemes = schemes?.filter(scheme => scheme.category === activeTab) || [];

  const handleApplyNow = (scheme: Scheme) => {
    if (scheme.link) {
      window.open(scheme.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="bg-card border border-border rounded-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-950 dark:to-pink-950 border-b border-border px-4 py-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">🏛️</span>
          <span>आम आदमी योजना (Sarkari Schemes)</span>
        </h2>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'Rajasthan' | 'India')} className="w-full">
        <div className="border-b border-border bg-muted/30">
          <TabsList className="w-full h-auto bg-transparent rounded-none p-0 grid grid-cols-2">
            <TabsTrigger 
              value="Rajasthan" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-orange-50 dark:data-[state=active]:bg-orange-950/50 data-[state=active]:text-orange-700 dark:data-[state=active]:text-orange-400 py-3 font-semibold"
            >
              Rajasthan Govt
            </TabsTrigger>
            <TabsTrigger 
              value="India" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/50 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 py-3 font-semibold"
            >
              India Govt
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="Rajasthan" className="mt-0">
          <SchemesList 
            schemes={filteredSchemes} 
            isLoading={isLoading} 
            error={error}
            onApply={handleApplyNow}
            colorScheme="orange"
          />
        </TabsContent>

        <TabsContent value="India" className="mt-0">
          <SchemesList 
            schemes={filteredSchemes} 
            isLoading={isLoading} 
            error={error}
            onApply={handleApplyNow}
            colorScheme="blue"
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function SchemesList({ 
  schemes, 
  isLoading, 
  error,
  onApply,
  colorScheme
}: { 
  schemes: Scheme[]; 
  isLoading: boolean; 
  error: Error | null;
  onApply: (scheme: Scheme) => void;
  colorScheme: 'orange' | 'blue';
}) {
  if (isLoading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive">
        Error loading schemes. Please try again later.
      </div>
    );
  }

  if (schemes.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No schemes available at the moment.
      </div>
    );
  }

  const borderColor = colorScheme === 'orange' 
    ? 'border-orange-300 dark:border-orange-700' 
    : 'border-blue-300 dark:border-blue-700';
  
  const bgGradient = colorScheme === 'orange'
    ? 'from-orange-50 to-pink-50 dark:from-orange-950/30 dark:to-pink-950/30'
    : 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30';

  const buttonColor = colorScheme === 'orange'
    ? 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800'
    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800';

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {schemes.map((scheme) => (
        <div 
          key={scheme.id.toString()} 
          className={`border-2 ${borderColor} rounded-lg overflow-hidden bg-gradient-to-br ${bgGradient} shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="p-4 space-y-3">
            {/* Scheme Name */}
            <h3 className="font-bold text-foreground text-base leading-tight min-h-[3rem] flex items-center">
              {scheme.name}
            </h3>

            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                colorScheme === 'orange' 
                  ? 'bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  : 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {scheme.category}
              </span>
            </div>

            {/* Apply Button */}
            {scheme.link ? (
              <Button
                onClick={() => onApply(scheme)}
                className={`w-full ${buttonColor} text-white font-semibold gap-2`}
                size="sm"
              >
                Apply Now
                <ExternalLink className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                disabled
                variant="outline"
                className="w-full font-semibold"
                size="sm"
              >
                Link Unavailable
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
