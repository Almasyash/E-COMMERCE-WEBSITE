export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt?: string;
  addresses?: Address[];
}

export interface Address {
  id?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
  type?: 'SHIPPING' | 'BILLING';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: {
    products: number;
  };
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  color?: string;
  size?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  brand: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  categoryId: string;
  category?: Category;
  rating: number;
  reviewCount: number;
  specifications?: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  inventory?: {
    quantity: number;
    minThreshold: number;
  };
  reviews?: Review[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  brand: string;
  image: string | null;
  variantId?: string | null;
  variantName?: string | null;
  price: number;
  originalPrice: number;
  quantity: number;
  total: number;
  inStock: boolean;
  availableStock: number;
}

export interface CartSummary {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  tax: number;
  estimatedTotal: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantName?: string | null;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  product?: {
    id: string;
    slug: string;
    images: { url: string }[];
  };
  reviews?: Review[];
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  trackingNumber?: string | null;
  notes?: string | null;
  createdAt: string;
  items: OrderItem[];
  payments?: any[];
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  startDate: string;
  expiryDate: string;
  usageLimit?: number | null;
  perUserLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
