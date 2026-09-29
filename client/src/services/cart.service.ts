import api from './api';
import { CartSummary } from '../types';

export const CartService = {
  getCart: async (): Promise<CartSummary> => {
    const res: any = await api.get('/cart');
    return res.data;
  },

  addToCart: async (productId: string, variantId?: string | null, quantity = 1): Promise<CartSummary> => {
    const res: any = await api.post('/cart/items', { productId, variantId, quantity });
    return res.data;
  },

  updateQuantity: async (itemId: string, quantity: number): Promise<CartSummary> => {
    const res: any = await api.put(`/cart/items/${itemId}`, { quantity });
    return res.data;
  },

  removeItem: async (itemId: string): Promise<CartSummary> => {
    const res: any = await api.delete(`/cart/items/${itemId}`);
    return res.data;
  },

  clearCart: async (): Promise<CartSummary> => {
    const res: any = await api.delete('/cart/clear');
    return res.data;
  },

  mergeCart: async (sessionId: string): Promise<CartSummary> => {
    const res: any = await api.post('/cart/merge', { sessionId });
    return res.data;
  },
};
