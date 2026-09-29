import { OrderStatus } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const calculateDiscountPercentage = (price: number, salePrice?: number | null): number | null => {
  if (!salePrice || salePrice >= price) return null;
  return Math.round(((price - salePrice) / price) * 100);
};

export const getOrderStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'DELIVERED':
      return { label: 'Delivered', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'OUT_FOR_DELIVERY':
      return { label: 'Out for Delivery', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'SHIPPED':
      return { label: 'Shipped', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    case 'PROCESSING':
      return { label: 'Processing', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'CONFIRMED':
      return { label: 'Confirmed', bg: 'bg-teal-50 text-teal-700 border-teal-200' };
    case 'PENDING':
      return { label: 'Pending', bg: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
    case 'CANCELLED':
      return { label: 'Cancelled', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
    case 'RETURN_REQUESTED':
      return { label: 'Return Requested', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
    case 'RETURNED':
      return { label: 'Returned', bg: 'bg-gray-100 text-gray-700 border-gray-300' };
    default:
      return { label: status, bg: 'bg-gray-100 text-gray-700 border-gray-300' };
  }
};
