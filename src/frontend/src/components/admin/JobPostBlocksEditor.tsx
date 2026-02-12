import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Plus, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import type { Block } from '../../backend';
import TitleBlockEditor from './blocks/TitleBlockEditor';
import ParagraphBlockEditor from './blocks/ParagraphBlockEditor';
import LinkButtonBlockEditor from './blocks/LinkButtonBlockEditor';
import ImageBannerBlockEditor from './blocks/ImageBannerBlockEditor';
import TableBlockEditor from './blocks/TableBlockEditor';

interface JobPostBlocksEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export default function JobPostBlocksEditor({ blocks, onChange }: JobPostBlocksEditorProps) {
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const addBlock = (type: Block['__kind__']) => {
    let newBlock: Block;
    switch (type) {
      case 'title':
        newBlock = { __kind__: 'title', title: { text: '', isMainHeading: true } };
        break;
      case 'paragraph':
        newBlock = { __kind__: 'paragraph', paragraph: { text: '' } };
        break;
      case 'link':
        newBlock = { __kind__: 'link', link: { linkText: '', url: '' } };
        break;
      case 'image':
        newBlock = { __kind__: 'image', image: { url: '', altText: undefined } };
        break;
      case 'table':
        newBlock = { __kind__: 'table', table: { title: undefined, rows: [['', ''], ['', '']] } };
        break;
    }
    onChange([...blocks, newBlock]);
    setAddMenuOpen(false);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  const deleteBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const updateBlock = (index: number, updatedBlock: Block) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    onChange(newBlocks);
  };

  const getBlockLabel = (block: Block): string => {
    switch (block.__kind__) {
      case 'title':
        return 'Title';
      case 'paragraph':
        return 'Paragraph';
      case 'link':
        return 'Link Button';
      case 'image':
        return 'Image/Banner';
      case 'table':
        return 'Table';
    }
  };

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <div key={index} className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Block {index + 1}: {getBlockLabel(block)}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => moveBlock(index, 'up')}
                disabled={index === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => moveBlock(index, 'down')}
                disabled={index === blocks.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => deleteBlock(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          {block.__kind__ === 'title' && (
            <TitleBlockEditor
              text={block.title.text}
              isMainHeading={block.title.isMainHeading}
              onChange={(text, isMainHeading) =>
                updateBlock(index, { __kind__: 'title', title: { text, isMainHeading } })
              }
            />
          )}

          {block.__kind__ === 'paragraph' && (
            <ParagraphBlockEditor
              text={block.paragraph.text}
              onChange={(text) =>
                updateBlock(index, { __kind__: 'paragraph', paragraph: { text } })
              }
            />
          )}

          {block.__kind__ === 'link' && (
            <LinkButtonBlockEditor
              linkText={block.link.linkText}
              url={block.link.url}
              onChange={(linkText, url) =>
                updateBlock(index, { __kind__: 'link', link: { linkText, url } })
              }
            />
          )}

          {block.__kind__ === 'image' && (
            <ImageBannerBlockEditor
              url={block.image.url}
              altText={block.image.altText}
              onChange={(url, altText) =>
                updateBlock(index, { __kind__: 'image', image: { url, altText } })
              }
            />
          )}

          {block.__kind__ === 'table' && (
            <TableBlockEditor
              title={block.table.title}
              rows={block.table.rows}
              onChange={(title, rows) =>
                updateBlock(index, { __kind__: 'table', table: { title, rows } })
              }
            />
          )}
        </div>
      ))}

      <div className="flex justify-center pt-4">
        <Popover open={addMenuOpen} onOpenChange={setAddMenuOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <h4 className="font-medium text-sm mb-3">What do you want to add?</h4>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start"
                onClick={() => addBlock('title')}
              >
                Add Title
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start"
                onClick={() => addBlock('paragraph')}
              >
                Add Paragraph
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start"
                onClick={() => addBlock('link')}
              >
                Add Link Button
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start"
                onClick={() => addBlock('image')}
              >
                Add Image/Banner
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start"
                onClick={() => addBlock('table')}
              >
                Add Table
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No content blocks yet. Click the + button to add your first block.</p>
        </div>
      )}
    </div>
  );
}
