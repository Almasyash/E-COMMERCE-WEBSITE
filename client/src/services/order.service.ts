import api from './api';
import { Order, Pagination, Address } from '../types';

export const OrderService = {
  checkout: async (data: {
    shippingAddress: Address;
    paymentMethod: string;
    couponCode?: string;
    notes?: string;
  }): Promise<Order> => {
    const res: any = await api.post('/orders/checkout', data);
    return res.data;
  },

  getMyOrders: async (page = 1, limit = 10): Promise<{ data: Order[]; pagination: Pagination }> => {
    const res: any = await api.get('/orders/my-orders', { params: { page, limit } });
    return { data: res.data, pagination: res.pagination };
  },

  getOrderById: async (id: string): Promise<Order> => {
    const res: any = await api.get(`/orders/${id}`);
    return res.data;
  },

  cancelOrder: async (id: string, reason: string): Promise<Order> => {
    const res: any = await api.post(`/orders/${id}/cancel`, { reason });
    return res.data;
  },
};

export const CouponService = {
  validateCoupon: async (code: string, cartTotal: number) => {
    const res: any = await api.post('/coupons/validate', { code, cartTotal });
    return res.data;
  },
};

export const ReviewService = {
  createReview: async (data: {
    productId: string;
    rating: number;
    title: string;
    content: string;
  }) => {
    const res: any = await api.post('/reviews', data);
    return res.data;
  },

  getProductReviews: async (productId: string, page = 1) => {
    const res: any = await api.get(`/reviews/product/${productId}`, { params: { page } });
    return { data: res.data, pagination: res.pagination };
  },
};

export const AdminService = {
  getStats: async () => {
    const res: any = await api.get('/admin/dashboard-stats');
    return res.data;
  },

  getOrders: async (params?: any) => {
    const res: any = await api.get('/orders/admin/all', { params });
    return { data: res.data, pagination: res.pagination };
  },

  updateOrderStatus: async (id: string, data: any) => {
    const res: any = await api.patch(`/orders/admin/${id}/status`, data);
    return res.data;
  },

  getProducts: async (params?: any) => {
    const res: any = await api.get('/products', { params });
    return { data: res.data, pagination: res.pagination };
  },

  createProduct: async (data: any) => {
    const res: any = await api.post('/products', data);
    return res.data;
  },

  updateProduct: async (id: string, data: any) => {
    const res: any = await api.put(`/products/${id}`, data);
    return res.data;
  },

  deleteProduct: async (id: string) => {
    const res: any = await api.delete(`/products/${id}`);
    return res.data;
  },

  getCategories: async () => {
    const res: any = await api.get('/categories');
    return res.data;
  },

  createCategory: async (data: any) => {
    const res: any = await api.post('/categories', data);
    return res.data;
  },

  deleteCategory: async (id: string) => {
    const res: any = await api.delete(`/categories/${id}`);
    return res.data;
  },

  getCoupons: async () => {
    const res: any = await api.get('/coupons');
    return res.data;
  },

  createCoupon: async (data: any) => {
    const res: any = await api.post('/coupons', data);
    return res.data;
  },

  deleteCoupon: async (id: string) => {
    const res: any = await api.delete(`/coupons/${id}`);
    return res.data;
  },

  getReviews: async (params?: any) => {
    const res: any = await api.get('/reviews/admin/all', { params });
    return { data: res.data, pagination: res.pagination };
  },

  toggleReviewApproval: async (id: string) => {
    const res: any = await api.patch(`/reviews/admin/${id}/approval`);
    return res.data;
  },

  deleteReview: async (id: string) => {
    const res: any = await api.delete(`/reviews/admin/${id}`);
    return res.data;
  },

  getCustomers: async (params?: any) => {
    const res: any = await api.get('/admin/customers', { params });
    return { data: res.data, pagination: res.pagination };
  },

  toggleCustomerStatus: async (id: string) => {
    const res: any = await api.patch(`/admin/customers/${id}/toggle-status`);
    return res.data;
  },
};
