import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface TableBlockEditorProps {
  title?: string;
  rows: string[][];
  onChange: (title: string | undefined, rows: string[][]) => void;
}

export default function TableBlockEditor({ title, rows, onChange }: TableBlockEditorProps) {
  const addRow = () => {
    const cols = rows.length > 0 ? rows[0].length : 2;
    onChange(title, [...rows, Array(cols).fill('')]);
  };

  const removeRow = (rowIndex: number) => {
    onChange(title, rows.filter((_, i) => i !== rowIndex));
  };

  const addColumn = () => {
    onChange(title, rows.map(row => [...row, '']));
  };

  const removeColumn = (colIndex: number) => {
    onChange(title, rows.map(row => row.filter((_, i) => i !== colIndex)));
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = rows.map((row, rIdx) =>
      rIdx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell)) : row
    );
    onChange(title, newRows);
  };

  const cols = rows.length > 0 ? rows[0].length : 0;

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label htmlFor="table-title">Table Title (Optional)</Label>
          <Input
            id="table-title"
            value={title || ''}
            onChange={(e) => onChange(e.target.value || undefined, rows)}
            placeholder="e.g., Important Dates, Fee Structure"
          />
        </div>

        <div className="space-y-2">
          <Label>Table Data</Label>
          <div className="overflow-x-auto border rounded-sm">
            <table className="w-full min-w-max">
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b last:border-b-0">
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="p-2 border-r last:border-r-0">
                        <Input
                          value={cell}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          placeholder={`R${rowIndex + 1}C${colIndex + 1}`}
                          className="min-w-[120px]"
                        />
                      </td>
                    ))}
                    <td className="p-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRow(rowIndex)}
                        disabled={rows.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={addRow}>
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={addColumn}>
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
            {cols > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeColumn(cols - 1)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Last Column
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
