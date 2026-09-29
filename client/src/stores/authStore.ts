import { create } from 'zustand';
import { User } from '../types';
import { AuthService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<User>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<User>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('apexcart_access_token'),
  isAdmin: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await AuthService.login({ email, password });
      localStorage.setItem('apexcart_access_token', res.tokens.accessToken);
      localStorage.setItem('apexcart_refresh_token', res.tokens.refreshToken);

      const user = res.user;
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'ADMIN',
        isLoading: false,
      });

      return user;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await AuthService.register(data);
      localStorage.setItem('apexcart_access_token', res.tokens.accessToken);
      localStorage.setItem('apexcart_refresh_token', res.tokens.refreshToken);

      const user = res.user;
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'ADMIN',
        isLoading: false,
      });

      return user;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('apexcart_access_token');
    localStorage.removeItem('apexcart_refresh_token');
    set({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
    });
  },

  fetchProfile: async () => {
    const token = localStorage.getItem('apexcart_access_token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false, user: null });
      return;
    }

    try {
      const user = await AuthService.getProfile();
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'ADMIN',
        isLoading: false,
      });
    } catch {
      localStorage.removeItem('apexcart_access_token');
      localStorage.removeItem('apexcart_refresh_token');
      set({ user: null, isAuthenticated: false, isAdmin: false, isLoading: false });
    }
  },

  updateUser: (updatedData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedData } : null,
    }));
  },
}));
