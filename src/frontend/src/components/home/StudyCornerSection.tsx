import { useStudyCorner } from '../../hooks/useStudyCorner';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';
import { ExternalLink, FileText } from 'lucide-react';

export function StudyCornerSection() {
  const { categories } = useStudyCorner();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preparation & Notes</CardTitle>
        <CardDescription>Subject-wise study material and resources</CardDescription>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No study materials available at the moment.
          </p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {categories.map((category) => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="text-left">
                  <div>
                    <div className="font-semibold">{category.name}</div>
                    <div className="text-xs text-muted-foreground">{category.description}</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {category.items.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">
                      No items in this category yet.
                    </p>
                  ) : (
                    <div className="space-y-2 pt-2">
                      {category.items.map((item) => (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            size="sm"
                          >
                            {item.type === 'pdf' ? (
                              <FileText className="w-4 h-4 mr-2" />
                            ) : (
                              <ExternalLink className="w-4 h-4 mr-2" />
                            )}
                            <span className="truncate">{item.title}</span>
                          </Button>
                        </a>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
