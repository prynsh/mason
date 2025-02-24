'use client'
import { Button } from "@/components/ui/button";
import { SearchBar } from "./searchBar";
import { useRouter } from "next/navigation";
import { memo } from "react";

const Toolbar = memo(() => {
    const router = useRouter();
    
    return (
      <div className="flex justify-center w-full mb-4 space-x-10">
        <SearchBar />
        <Button 
          variant="outline" 
          onClick={() => router.push("/create")} 
          className="w-40 whitespace-nowrap"
        >
          Create Note
        </Button>
      </div>
    );
});
Toolbar.displayName = "Toolbar";

export default Toolbar;