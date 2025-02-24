import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const TitleInput = React.memo(function TitleInput({ value, onChange, error }: TitleInputProps) {
  console.log("TitleInput rendered");
  
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="flex flex-col">
      <Label htmlFor="title" className="text-xl font-semibold">
        Title
      </Label>
      <Input
        id="title"
        placeholder="Enter the title"
        value={value}
        onChange={handleChange}
        className={`mt-2 p-3 ${error ? 'border-red-500' : ''}`}
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
});