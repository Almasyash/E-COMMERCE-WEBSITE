import api from './api';
import { User, Address } from '../types';

export const AuthService = {
  login: async (credentials: { email: string; password: string }) => {
    const res: any = await api.post('/auth/login', credentials);
    return res.data;
  },

  register: async (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => {
    const res: any = await api.post('/auth/register', data);
    return res.data;
  },

  getProfile: async (): Promise<User> => {
    const res: any = await api.get('/auth/me');
    return res.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res: any = await api.put('/auth/me', data);
    return res.data;
  },

  addAddress: async (data: Address): Promise<Address> => {
    const res: any = await api.post('/auth/addresses', data);
    return res.data;
  },

  updateAddress: async (id: string, data: Address): Promise<Address> => {
    const res: any = await api.put(`/auth/addresses/${id}`, data);
    return res.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/auth/addresses/${id}`);
  },
};
