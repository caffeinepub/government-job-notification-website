import { ExternalLink, Download, Globe } from 'lucide-react';
import { JobPost } from '../../backend';
import { getLinkStatus } from '../../utils/linkAvailability';

interface ImportantLinksButtonsProps {
  post: JobPost;
}

export function ImportantLinksButtons({ post }: ImportantLinksButtonsProps) {
  const applyStatus = getLinkStatus(post.links.applyOnline);
  const notificationStatus = getLinkStatus(post.links.notification);
  const websiteStatus = getLinkStatus(post.links.officialWebsite);

  return (
    <section className="border-t border-border pt-6">
      <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">
        Important Links
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {applyStatus.isAvailable ? (
          <a
            href={post.links.applyOnline!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-4 rounded-sm hover:bg-primary/90 transition-colors min-h-[56px] text-center"
          >
            <ExternalLink className="w-5 h-5" />
            Apply Online
          </a>
        ) : (
          <div className="flex items-center justify-center gap-2 bg-muted text-muted-foreground font-bold px-6 py-4 rounded-sm border border-border cursor-not-allowed min-h-[56px] text-center">
            <ExternalLink className="w-5 h-5" />
            {applyStatus.label}
          </div>
        )}

        {notificationStatus.isAvailable ? (
          <a
            href={post.links.notification!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-4 rounded-sm hover:bg-primary/90 transition-colors min-h-[56px] text-center"
          >
            <Download className="w-5 h-5" />
            Download Official Notification
          </a>
        ) : (
          <div className="flex items-center justify-center gap-2 bg-muted text-muted-foreground font-bold px-6 py-4 rounded-sm border border-border cursor-not-allowed min-h-[56px] text-center">
            <Download className="w-5 h-5" />
            {notificationStatus.label}
          </div>
        )}

        {websiteStatus.isAvailable ? (
          <a
            href={post.links.officialWebsite!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-4 rounded-sm hover:bg-primary/90 transition-colors min-h-[56px] text-center"
          >
            <Globe className="w-5 h-5" />
            Official Website
          </a>
        ) : (
          <div className="flex items-center justify-center gap-2 bg-muted text-muted-foreground font-bold px-6 py-4 rounded-sm border border-border cursor-not-allowed min-h-[56px] text-center">
            <Globe className="w-5 h-5" />
            {websiteStatus.label}
          </div>
        )}
      </div>
    </section>
  );
}
