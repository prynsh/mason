import { create } from "zustand";
import axios from "axios";

interface AuthState {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  token: string | null;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  login: () => Promise<void>;
  signup: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  email: "",
  password: "",
  loading: false,
  error: null,
  token: null,

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),

  login: async () => {
    set({ loading: true, error: null });

    try {
      const { email, password } = get();
      const res = await axios.post("http://localhost:3001/signin", { email, password });

      if (res.status === 200) {
        const { token } = res.data;
        localStorage.setItem("token", token);
        set({ token });
        window.location.href = "/dashboard";
      } else {
        set({ error: "Failed to log in. Please check your credentials." });
      }
    } catch {
      set({ error: "Something went wrong. Please try again later." });
    } finally {
      set({ loading: false });
    }
  },

  signup: async () => {
    set({ loading: true, error: null });

    try {
      const { email, password } = get();
      const res = await axios.post("http://localhost:3001/signup", { email, password });

      if (res.status === 200) {
        window.location.href = "/signin"; // Redirect after signup
      } else {
        set({ error: "Failed to create account. Please try again." });
      }
    } catch {
      set({ error: "Something went wrong. Please try again later." });
    } finally {
      set({ loading: false });
    }
  },
}));
