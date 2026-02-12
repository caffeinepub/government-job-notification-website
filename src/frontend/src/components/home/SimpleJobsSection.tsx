import { useSimpleJobs } from '../../hooks/useSimpleJobs';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink, Calendar } from 'lucide-react';

export function SimpleJobsSection() {
  const { jobs } = useSimpleJobs();

  if (jobs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Job Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-3 border border-border rounded-sm hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 leading-tight">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="bg-secondary px-2 py-0.5 rounded">
                      {job.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Last Date: {job.lastDate}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={job.notificationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="default">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Notification
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
