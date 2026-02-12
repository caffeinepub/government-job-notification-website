import { useOfficialLinks } from '../../hooks/useOfficialLinks';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';

export function QuickOfficialLinks() {
  const { links } = useOfficialLinks();

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Quick Official Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {links.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No official links available at the moment.
          </p>
        ) : (
          links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant={link.isHighlighted ? 'default' : 'outline'}
                className={`w-full justify-between ${
                  link.isHighlighted ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''
                }`}
                size="sm"
              >
                <span className="text-left truncate">{link.label}</span>
                <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2" />
              </Button>
            </a>
          ))
        )}
      </CardContent>
    </Card>
  );
}
