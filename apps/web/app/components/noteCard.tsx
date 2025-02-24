import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import parse, { DOMNode, Element, HTMLReactParserOptions, domToReact } from 'html-react-parser';
import DOMPurify from 'dompurify';

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  aiSummary?: string;
}

interface NoteCardProps {
  note: Note;
  layoutId: string;
  onEdit: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onActivate: (note: Note) => void;
}

const sanitizeHTML = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'span', 'u'],
    ALLOWED_ATTR: ['style']
  });
};

const truncateText = (text: string, maxLength: number = 200): string => {
  if (text.length <= maxLength) return text;
  const lastSpace = text.lastIndexOf(' ', maxLength);
  return text.slice(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
};

const parseOptions: HTMLReactParserOptions = {
  replace: (domNode: DOMNode) => {
    if (domNode instanceof Element) {
      const children = domNode.children as DOMNode[];
      
    
      switch (domNode.name) {
        case 'b':
        case 'strong':
          return <strong>{domToReact(children, parseOptions)}</strong>;
        case 'i':
        case 'em':
          return <em>{domToReact(children, parseOptions)}</em>;
        case 'u':
          return <u>{domToReact(children, parseOptions)}</u>;
        case 'p':
          return <p>{domToReact(children, parseOptions)}</p>;
        case 'span':
          return <span>{domToReact(children, parseOptions)}</span>;
        default:
          return <>{domToReact(children, parseOptions)}</>;
      }
    }
    
    if (domNode.type === 'text' && domNode.data) {
      if (!domNode.next) {
        return truncateText(domNode.data);
      }
      return domNode.data;
    }
  }
};

export default memo(function NoteCard({ note, layoutId, onEdit, onDelete, onActivate }: NoteCardProps) {
  const handleEdit = useCallback(() => {
    onEdit(note._id);
  }, [note._id, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(note._id);
  }, [note._id, onDelete]);

  const handleActivate = useCallback(() => {
    onActivate(note);
  }, [note, onActivate]);

  const sanitizedContent = sanitizeHTML(note.content);
  const processedContent = parse(sanitizedContent, parseOptions);

  return (
    <motion.div
      layoutId={`card-${note._id}-${layoutId}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 w-full flex flex-col justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer bg-white dark:bg-gray-900 shadow-lg"
    >
      <div className="flex justify-between">
        <div className="flex-1" onClick={handleActivate}>
          <motion.h3
            layoutId={`title-${note._id}-${layoutId}`}
            className="font-medium text-neutral-800 dark:text-neutral-200 text-lg"
          >
            {note.title}
          </motion.h3>
          <motion.div
            layoutId={`description-${note._id}-${layoutId}`}
            className="text-neutral-600 dark:text-neutral-400 text-sm mt-1 line-clamp-3"
          >
            {processedContent}
          </motion.div>
          <motion.div 
            className="flex flex-wrap gap-2 mt-2"
            layout
          >
            {note.tags?.map((tag: string) => (
              <motion.span
                key={tag}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded-full"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={handleEdit} variant="outline">Edit</Button>
          <Button onClick={handleDelete} variant="destructive">Delete</Button>
        </div>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.note._id === nextProps.note._id &&
    prevProps.note.title === nextProps.note.title &&
    prevProps.note.content === nextProps.note.content &&
    JSON.stringify(prevProps.note.tags) === JSON.stringify(nextProps.note.tags) &&
    prevProps.layoutId === nextProps.layoutId
  );
});

