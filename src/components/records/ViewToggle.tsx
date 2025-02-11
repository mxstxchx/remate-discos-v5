import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-background border rounded-lg">
      <Toggle
        pressed={view === 'grid'}
        onPressedChange={() => onChange('grid')}
        size="sm"
        aria-label="Grid view"
      >
        <LayoutGrid className="w-4 h-4" />
      </Toggle>
      <Toggle
        pressed={view === 'list'}
        onPressedChange={() => onChange('list')}
        size="sm"
        aria-label="List view"
      >
        <List className="w-4 h-4" />
      </Toggle>
    </div>
  );
}
