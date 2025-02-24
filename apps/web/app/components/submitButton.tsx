import React from 'react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  loading: boolean;
  onClick: () => void;
}

export const SubmitButton = React.memo(function SubmitButton({ loading, onClick }: SubmitButtonProps) {
  console.log("SubmitButton rendered");

  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={`px-6 py-2 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={loading}
    >
      {loading ? 'Saving...' : 'Save'}
    </Button>
  );
});