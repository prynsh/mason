"use client"
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import EditNoteModal from "./editModal"; 
import { SearchBar } from "./searchBar";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from "@/components/ui/pagination";
import Footer from "./Footer";


function stripHTMLTags(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export function ExpandableCardDemo() {
  const [notes, setNotes] = useState<any[]>([]);
  const [active, setActive] = useState<any | boolean | null>(null);
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null); 
  const [showAISummary, setShowAISummary] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 6;

  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const router = useRouter();

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signup");
        return;
      }
      const response = await axios.get("http://localhost:3001/notes/bulk", {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        setNotes(response.data.notes);
        setFilteredNotes(response.data.notes);
      } else {
        console.error("Error fetching notes:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () => setActive(null));

  
  const openModalWithNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNoteId(null);
  };

  const handleNoteUpdate = (updatedNote: any) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note._id === updatedNote._id ? updatedNote : note))
    );
    setFilteredNotes((prevNotes) =>
      prevNotes.map((note) => (note._id === updatedNote._id ? updatedNote : note))
    );
    closeModal(); 
  };


  const handleDelete = async (noteId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/notes/${noteId}`, {
        headers: { Authorization: token },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      setFilteredNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber); // This will replace the current page number, not append
  };

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredNotes]);


  const handleCreateNote = () => {
    router.push("/create");
  };

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.div
              layoutId={`card-${active._id}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden p-6"
            >
              <motion.h3
                layoutId={`title-${active._id}-${id}`}
                className="font-bold text-2xl text-neutral-800 dark:text-neutral-200"
              >
                {active.title}
              </motion.h3>
              <motion.div
                layout
                className="text-neutral-600 dark:text-neutral-400 text-sm mt-4"
              >
                <motion.p layoutId={`description-${active._id}-${id}`}>
                {showAISummary 
                  ? (
                    <strong>AI Summary:</strong>
                  ) : (
                    <strong>Description:</strong>
                  )}{showAISummary?(active.aiSummary?.replace(/^\*\*Summary:\*\*\s*/, "") || "No summary available") 
                  : stripHTMLTags(active.content)}
              </motion.p>
              </motion.div>
              <Button onClick={() => setShowAISummary(!showAISummary)} variant="outline" className="mt-4">{showAISummary ? "Show Description" : "Show AI Summary"}</Button>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      {/* <div className="flex flex-col min-h-screen">  */}
      
      
      <div className="flex justify-center w-full mb-4 space-x-10">
        <SearchBar notes={notes} setFilteredNotes={setFilteredNotes} />
        <Button 
          variant="outline"
          onClick={handleCreateNote}
          className="w-40 whitespace-nowrap" 
        >
          Create Note
        </Button>
      </div>
      
      <motion.ul 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {currentNotes.map((note) => ( 
          <motion.div
          layoutId={`card-${note._id}-${id}`}
          key={note._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-4 w-full flex flex-col justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer bg-white dark:bg-gray-900 shadow-lg"
        >
          <div className="flex justify-between">
            <div className="flex-1" onClick={() => setActive(note)}>
              <motion.h3
                layoutId={`title-${note._id}-${id}`}
                className="font-medium text-neutral-800 dark:text-neutral-200 text-lg"
              >
                {note.title}
              </motion.h3>
              <motion.p
                layoutId={`description-${note._id}-${id}`}
                className="text-neutral-600 dark:text-neutral-400 text-sm mt-1 line-clamp-3"
              >
                {stripHTMLTags(note.content)}
              </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 mt-2"
                  layout
                >
                  {note.tags && note.tags.map((tag: string) => (
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
                <Button onClick={() => openModalWithNote(note._id)} variant="outline">Edit</Button>
                <Button onClick={() => handleDelete(note._id)} variant="destructive">Delete</Button>
                {/* <AIButton/> */}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.ul>
      {/* <Footer 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      /> */}
      
      {isModalOpen && selectedNoteId && (
        <EditNoteModal noteId={selectedNoteId} closeModal={closeModal} onNoteUpdate={handleNoteUpdate} />
      )}
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black dark:text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};


