import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Card, CardContent } from '../../ui/card';

interface TitleBlockEditorProps {
  text: string;
  isMainHeading: boolean;
  onChange: (text: string, isMainHeading: boolean) => void;
}

export default function TitleBlockEditor({ text, isMainHeading, onChange }: TitleBlockEditorProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label htmlFor="title-level">Heading Level</Label>
          <Select
            value={isMainHeading ? 'h2' : 'h3'}
            onValueChange={(value) => onChange(text, value === 'h2')}
          >
            <SelectTrigger id="title-level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="h2">H2 (Main Heading)</SelectItem>
              <SelectItem value="h3">H3 (Sub Heading)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="title-text">Heading Text</Label>
          <Input
            id="title-text"
            value={text}
            onChange={(e) => onChange(e.target.value, isMainHeading)}
            placeholder="Enter heading text"
          />
        </div>
      </CardContent>
    </Card>
  );
}
