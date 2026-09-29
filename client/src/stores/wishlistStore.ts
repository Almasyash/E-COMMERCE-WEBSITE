import { create } from 'zustand';
import api from '../services/api';

interface WishlistState {
  wishlistIds: Set<string>;
  wishlistItems: any[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: new Set<string>(),
  wishlistItems: [],
  isLoading: false,

  fetchWishlist: async () => {
    const token = localStorage.getItem('apexcart_access_token');
    if (!token) {
      set({ wishlistIds: new Set(), wishlistItems: [] });
      return;
    }

    try {
      set({ isLoading: true });
      const res: any = await api.get('/wishlist');
      const items = res.data || [];
      const ids = new Set<string>(items.map((i: any) => i.productId));
      set({ wishlistItems: items, wishlistIds: ids, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (productId: string) => {
    const token = localStorage.getItem('apexcart_access_token');
    if (!token) {
      throw new Error('Please log in to save items to your wishlist');
    }

    const res: any = await api.post('/wishlist/toggle', { productId });
    const { isInWishlist } = res.data;

    set((state) => {
      const nextIds = new Set(state.wishlistIds);
      if (isInWishlist) {
        nextIds.add(productId);
      } else {
        nextIds.delete(productId);
      }
      return {
        wishlistIds: nextIds,
        wishlistItems: isInWishlist
          ? state.wishlistItems
          : state.wishlistItems.filter((i) => i.productId !== productId),
      };
    });

    return isInWishlist;
  },

  isInWishlist: (productId: string) => {
    return get().wishlistIds.has(productId);
  },
}));
