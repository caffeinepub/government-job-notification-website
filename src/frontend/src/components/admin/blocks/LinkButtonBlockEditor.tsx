import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent } from '../../ui/card';

interface LinkButtonBlockEditorProps {
  linkText: string;
  url: string;
  onChange: (linkText: string, url: string) => void;
}

export default function LinkButtonBlockEditor({ linkText, url, onChange }: LinkButtonBlockEditorProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label htmlFor="link-text">Button Label</Label>
          <Input
            id="link-text"
            value={linkText}
            onChange={(e) => onChange(e.target.value, url)}
            placeholder="e.g., Apply Online, Download PDF"
          />
        </div>
        <div>
          <Label htmlFor="link-url">URL</Label>
          <Input
            id="link-url"
            value={url}
            onChange={(e) => onChange(linkText, e.target.value)}
            placeholder="https://..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
