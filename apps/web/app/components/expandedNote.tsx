import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface ExpandedNoteProps {
  note: {
    _id: string;
    title: string;
    content: string;
    aiSummary?: string;
  };
  id: string;
  showAISummary: boolean;
  onToggleAISummary: () => void;
  ref: React.RefObject<HTMLDivElement>;
}

const stripHTMLTags = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

export const ExpandedNote = ({ note, id, showAISummary, onToggleAISummary, ref }: ExpandedNoteProps) => {
    const [aiSummary, setAiSummary] = useState(note.aiSummary)


    useEffect(() => {
        
        setAiSummary(note.aiSummary);
    }, [note]); 
  return (
    <div className="fixed inset-0 grid place-items-center z-[100]">
      <motion.div
        layoutId={`card-${note._id}-${id}`}
        ref={ref}
        className="w-full max-w-[500px] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden p-6"
      >
        <motion.h3
          layoutId={`title-${note._id}-${id}`}
          className="font-bold text-2xl text-neutral-800 dark:text-neutral-200"
        >
          {note.title}
        </motion.h3>
        <motion.div
          layout
          className="text-neutral-600 dark:text-neutral-400 text-sm mt-4"
        >
          <motion.p layoutId={`description-${note._id}-${id}`}>
            {showAISummary ? (
              <>
                <strong>AI Summary:</strong>
                {note.aiSummary?.replace(/^\*\*Summary:\*\*\s*/, "") || "No summary available"}
              </>
            ) : (
              <>
                <strong>Description:</strong>
                {stripHTMLTags(note.content)}
              </>
            )}
          </motion.p>
        </motion.div>
        <Button 
          onClick={onToggleAISummary} 
          variant="outline" 
          className="mt-4"
        >
          {showAISummary ? "Show Description" : "Show AI Summary"}
        </Button>
      </motion.div>
    </div>
  );
};