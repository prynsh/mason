"use client";
import { useEffect, useId, useRef, useCallback} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNoteManagementStore } from "../store/noteManagement";
import { useOutsideClick } from "../hooks/use-outside-click";
import { ExpandedNote } from "../components/expandedNote";
import NoteCard from "../components/noteCard";
import EditModal from "../components/editModal";
import Toolbar from "../components/searchSection";

export default function Dashboard() {
  const {
    filteredNotes,
    currentPage,
    fetchNotes,
    deleteNote,
    updateNote,
    activeNote,
    selectedNoteId,
    showAISummary,
    isModalOpen,
    setActiveNote,
    setSelectedNoteId,
    toggleAISummary,
    openModal,
    closeModal,
    setCurrentPage, // Ensure this function exists in the store
  } = useNoteManagementStore();

  const ref = useRef<HTMLDivElement>(null!);
  const layoutId = useId();

  const handleEdit = useCallback((noteId: string) => {
    setSelectedNoteId(noteId);
    openModal();
  }, [setSelectedNoteId, openModal]);

  const handleDelete = useCallback((noteId: string) => {
    deleteNote(noteId);
  }, [deleteNote]);

  const handleActivate = useCallback((note: any) => {
    setActiveNote(note);
  }, [setActiveNote]);

  const handleNoteUpdate = useCallback((updatedNote: any) => {
    updateNote(updatedNote);
    closeModal();
    setSelectedNoteId(null);
  }, [updateNote, closeModal, setSelectedNoteId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveNote(null);
      }
    };

    document.body.style.overflow = activeNote ? "hidden" : "auto";

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeNote, setActiveNote]);

  useOutsideClick(ref, () => setActiveNote(null));

  const notesPerPageFixed = 6;
  const indexOfLastNote = currentPage * notesPerPageFixed;
  const indexOfFirstNote = indexOfLastNote - notesPerPageFixed;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPageFixed);

  return (
    <>
      <AnimatePresence mode="wait">
        {activeNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeNote && (
          <ExpandedNote
            note={activeNote}
            id={layoutId}
            showAISummary={showAISummary}
            onToggleAISummary={toggleAISummary}
            ref={ref}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-center w-full mb-4 space-x-10">
        <Toolbar />
      </div>

      <motion.ul
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto min-h-[100px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {currentNotes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            layoutId={layoutId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onActivate={handleActivate}
          />
        ))}
      </motion.ul>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 fixed bottom-4 left-0 right-0">
          <div className="flex space-x-2  p-2 rounded-lg shadow-lg">
            <button
              className="px-4 py-2 text-sm font-semibold rounded-md transition-all bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="px-4 py-2 text-sm font-semibold">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              className="px-4 py-2 text-sm font-semibold rounded-md transition-all bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isModalOpen && selectedNoteId && (
        <EditModal
          noteId={selectedNoteId}
          closeModal={closeModal}
          onNoteUpdate={handleNoteUpdate}
        />
      )}
    </>
  );
}
