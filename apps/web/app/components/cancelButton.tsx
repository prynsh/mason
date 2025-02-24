import React from "react";
import { Button } from "@/components/ui/button";

interface CancelButtonProps {
  onClick: () => void;
}

export const CancelButton = React.memo(function CancelButton({ onClick }: CancelButtonProps) {
  console.log("CancelButton rendered");
  return (
    <Button variant="outline" onClick={onClick}>
      Cancel
    </Button>
  );
});

export default CancelButton;
