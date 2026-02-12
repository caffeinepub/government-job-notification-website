import React from 'react';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Card, CardContent } from '../../ui/card';

interface ParagraphBlockEditorProps {
  text: string;
  onChange: (text: string) => void;
}

export default function ParagraphBlockEditor({ text, onChange }: ParagraphBlockEditorProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div>
          <Label htmlFor="paragraph-text">Paragraph Text</Label>
          <Textarea
            id="paragraph-text"
            value={text}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter paragraph content"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}
