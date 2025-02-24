import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TagsInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const TagsInput = React.memo(function TagsInput({ value, onChange, error }: TagsInputProps) {
  console.log("TagsInput rendered");

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="flex flex-col">
      <Label htmlFor="tags" className="pt-5 text-xl font-semibold">
        Tags
      </Label>
      <Input
        id="tags"
        placeholder="Enter tags separated by commas"
        value={value}
        onChange={handleChange}
        className={`mt-2 p-3 ${error ? 'border-red-500' : ''}`}
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
});