import { create } from 'zustand';
import axios from 'axios';

interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  empresa: string;
  especialidad?: string;
  activo: boolean;
}

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

const API_BASE_URL = 'http://localhost:8888';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // Get all users and find matching email
      const response = await axios.get(`${API_BASE_URL}/api/usuarios`);
      const users: Usuario[] = response.data;

      const user = users.find(u => u.email === email && u.activo);

      if (user) {
        // In a real app, you'd verify password hash on backend
        // For now, just accept any password for demo
        set({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      } else {
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false
    });
    localStorage.removeItem('user');
  },

  checkAuth: () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      set({
        user,
        isAuthenticated: true
      });
    }
  }
}));
