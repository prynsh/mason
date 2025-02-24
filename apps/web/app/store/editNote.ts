import { create } from "zustand";
import axios from "axios";
import { useNoteStore } from "./useNote";

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
}

interface NoteStore {
  title: string;
  content: string;
  tags: string[];
  loading: boolean;
  fetchNote: (noteId: string) => Promise<void>;
  updateNote: (
    noteId: string, 
    token: string, 
    generateContent: (data: { title: string; content: string }) => Promise<string>, 
    onSuccess: () => void
  ) => Promise<void>;  
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTags: (tags: string[]) => void;
}

export const editNote = create<NoteStore>((set) => ({
  title: "",
  content: "",
  tags: [],
  loading: false,

  fetchNote: async (noteId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3001/notes/${noteId}`, {
        headers: { Authorization: token },
      });

      if (response.status === 200) {
        const { title, content, tags } = response.data.note;
        set({ title, content, tags });
      }
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  },

  updateNote: async (
    noteId: string, 
    token: string, 
    generateContent: (data: { title: string; content: string }) => Promise<string>, 
    onSuccess: () => void
  ) => {
    set({ loading: true });
  
    try {
      const { title, content, tags } = editNote.getState();
      
      const aiSummary = await generateContent({ title, content });
  
      const response = await axios.put(
        `http://localhost:3001/notes/${noteId}`, 
        { title, content, tags, aiSummary }, 
        { headers: { Authorization: token } }
      );
  
      if (response.status === 200) {
        onSuccess();
        
      }
    } catch (error) {
      console.error("Error updating note:", error);
    } finally {
      set({ loading: false });
    }
  },
  
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setTags: (tags) => set({ tags }),
}));
