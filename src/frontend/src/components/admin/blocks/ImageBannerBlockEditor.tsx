import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent } from '../../ui/card';

interface ImageBannerBlockEditorProps {
  url: string;
  altText?: string;
  onChange: (url: string, altText?: string) => void;
}

export default function ImageBannerBlockEditor({ url, altText, onChange }: ImageBannerBlockEditorProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label htmlFor="image-url">Image URL</Label>
          <Input
            id="image-url"
            value={url}
            onChange={(e) => onChange(e.target.value, altText)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <Label htmlFor="image-alt">Alt Text (Optional)</Label>
          <Input
            id="image-alt"
            value={altText || ''}
            onChange={(e) => onChange(url, e.target.value || undefined)}
            placeholder="Describe the image"
          />
        </div>
        {url && (
          <div className="mt-4">
            <Label>Preview</Label>
            <div className="mt-2 border rounded-sm overflow-hidden max-w-md">
              <img
                src={url}
                alt={altText || 'Preview'}
                className="w-full h-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
