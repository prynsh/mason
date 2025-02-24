
import { create } from "zustand";
import axios from "axios";

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  aiSummary?: string;
}

interface NoteManagementState {
  notes: Note[];
  filteredNotes: Note[];
  currentPage: number;
  notesPerPage: number;
  totalPages: number;
  selectedNote: Note | null;
  isLoading: boolean;
  error: string | null;

  activeNote: Note | null;
  selectedNoteId: string | null;
  showAISummary: boolean;
  isModalOpen: boolean;

  fetchNotes: () => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  updateNote: (updatedNote: Note) => void;
  setFilteredNotes: (notes: Note[]) => void;
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setSelectedNote: (note: Note | null) => void;
  searchNotes: (searchTerm: string) => void;

  setActiveNote: (note: Note | null) => void;
  setSelectedNoteId: (id: string | null) => void;
  toggleAISummary: () => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useNoteManagementStore = create<NoteManagementState>((set, get) => ({
  notes: [],
  filteredNotes: [],
  currentPage: 1,
  notesPerPage: 6,
  totalPages: 1,
  selectedNote: null,
  isLoading: false,
  error: null,

  activeNote: null,
  selectedNoteId: null,
  showAISummary: false,
  isModalOpen: false,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("http://localhost:3001/notes/bulk", {
        headers: { Authorization: token },
      });

      const totalPages = Math.ceil(response.data.notes.length / get().notesPerPage);

      set({
        notes: response.data.notes,
        filteredNotes: response.data.notes,
        totalPages,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  deleteNote: async (noteId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/notes/${noteId}`, {
        headers: { Authorization: token },
      });

      const updatedNotes = get().notes.filter((note) => note._id !== noteId);
      const totalPages = Math.ceil(updatedNotes.length / get().notesPerPage);

      set({
        notes: updatedNotes,
        filteredNotes: updatedNotes,
        totalPages,
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateNote: (updatedNote: Note) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note._id === updatedNote._id ? updatedNote : note
      ),
      filteredNotes: state.filteredNotes.map((note) =>
        note._id === updatedNote._id ? updatedNote : note
      ),
    }));
  },

  setFilteredNotes: (notes: Note[]) => {
    set({
      filteredNotes: notes,
      totalPages: Math.ceil(notes.length / get().notesPerPage),
      currentPage: 1,
    });
  },

  setCurrentPage: (page: number) => {
    const { totalPages } = get();
    if (page >= 1 && page <= totalPages) {
      set({ currentPage: page });
    }
  },

  nextPage: () => {
    const { currentPage, totalPages } = get();
    if (currentPage < totalPages) {
      set({ currentPage: currentPage + 1 });
    }
  },

  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      set({ currentPage: currentPage - 1 });
    }
  },

  setSelectedNote: (note: Note | null) => set({ selectedNote: note }),

  searchNotes: (searchTerm: string) => {
    const { notes } = get();
    const lowercaseSearch = searchTerm.toLowerCase();

    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowercaseSearch) ||
        note.content.toLowerCase().includes(lowercaseSearch) ||
        note.tags.some((tag) => tag.toLowerCase().includes(lowercaseSearch))
    );

    set({
      filteredNotes: filtered,
      totalPages: Math.ceil(filtered.length / get().notesPerPage),
      currentPage: 1, 
    });
  },

  setActiveNote: (note) => set({ activeNote: note }),
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),
  toggleAISummary: () => set((state) => ({ showAISummary: !state.showAISummary })),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
