import { Bell } from 'lucide-react';

export function SiteNoticeTicker() {
  const noticeText = "📢 No need to update! Visit daily for the latest government job notifications, admit cards, results, and exam updates • Stay informed with real-time updates";

  return (
    <div className="bg-accent text-accent-foreground overflow-hidden border-b border-border">
      <div className="flex items-center gap-2 py-2 px-4">
        <Bell className="h-4 w-4 flex-shrink-0 animate-pulse" />
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap inline-block">
            <span className="text-sm font-medium">{noticeText}</span>
            <span className="mx-8 text-sm font-medium">{noticeText}</span>
            <span className="mx-8 text-sm font-medium">{noticeText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
