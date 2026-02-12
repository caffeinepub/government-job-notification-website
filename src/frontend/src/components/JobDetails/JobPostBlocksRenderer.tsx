import React from 'react';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';
import type { Block } from '../../backend';

interface JobPostBlocksRendererProps {
  blocks: Block[];
}

export default function JobPostBlocksRenderer({ blocks }: JobPostBlocksRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <div key={index}>
          {block.__kind__ === 'title' && (
            <>
              {block.title.isMainHeading ? (
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  {block.title.text}
                </h2>
              ) : (
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {block.title.text}
                </h3>
              )}
            </>
          )}

          {block.__kind__ === 'paragraph' && (
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {block.paragraph.text}
            </p>
          )}

          {block.__kind__ === 'link' && (
            <div className="flex justify-start">
              <Button
                asChild
                variant="default"
                size="lg"
                className="gap-2"
              >
                <a
                  href={block.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {block.link.linkText}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          )}

          {block.__kind__ === 'image' && (
            <div className="rounded-sm overflow-hidden border border-border">
              <img
                src={block.image.url}
                alt={block.image.altText || 'Job post image'}
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}

          {block.__kind__ === 'table' && (
            <div className="space-y-2">
              {block.table.title && (
                <h4 className="text-lg font-semibold text-foreground">
                  {block.table.title}
                </h4>
              )}
              <div className="overflow-x-auto border border-border rounded-sm">
                <table className="w-full min-w-max">
                  <tbody>
                    {block.table.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={rowIndex % 2 === 0 ? 'bg-muted/30' : 'bg-background'}
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-3 border-r last:border-r-0 border-border text-sm"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
