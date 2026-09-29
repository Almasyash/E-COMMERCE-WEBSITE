import api from './api';
import { Product, Category, Pagination } from '../types';

export interface ProductQueryParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sortBy?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

export const ProductService = {
  getProducts: async (params?: ProductQueryParams): Promise<{ data: Product[]; pagination: Pagination }> => {
    const res: any = await api.get('/products', { params });
    return { data: res.data, pagination: res.pagination };
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const res: any = await api.get(`/products/${slug}`);
    return res.data;
  },

  getRelatedProducts: async (id: string, categoryId: string): Promise<Product[]> => {
    const res: any = await api.get(`/products/${id}/related`, { params: { categoryId } });
    return res.data;
  },

  getSuggestions: async (query: string): Promise<any[]> => {
    const res: any = await api.get('/products/suggestions', { params: { q: query } });
    return res.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const res: any = await api.get('/categories');
    return res.data;
  },
};
