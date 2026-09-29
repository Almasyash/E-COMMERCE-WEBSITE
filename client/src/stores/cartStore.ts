import { create } from 'zustand';
import { CartSummary, CartItem } from '../types';
import { CartService } from '../services/cart.service';
import { CouponService } from '../services/order.service';

interface CartState {
  cart: CartSummary | null;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  tax: number;
  estimatedTotal: number;
  isCartOpen: boolean;
  isLoading: boolean;
  appliedCoupon: {
    code: string;
    discountAmount: number;
    discountType: string;
    discountValue: number;
  } | null;
  openCart: () => void;
  closeCart: () => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId?: string | null, quantity?: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  items: [],
  itemCount: 0,
  subtotal: 0,
  shippingFee: 0,
  tax: 0,
  estimatedTotal: 0,
  isCartOpen: false,
  isLoading: false,
  appliedCoupon: null,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const cart = await CartService.getCart();
      const coupon = get().appliedCoupon;
      const discount = coupon ? coupon.discountAmount : 0;
      const taxable = Math.max(0, cart.subtotal - discount);
      const tax = Math.round(taxable * 0.18 * 100) / 100;
      const grandTotal = Math.round((taxable + cart.shippingFee + tax) * 100) / 100;

      set({
        cart,
        items: cart.items,
        itemCount: cart.itemCount,
        subtotal: cart.subtotal,
        shippingFee: cart.shippingFee,
        tax,
        estimatedTotal: grandTotal,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, variantId, quantity = 1) => {
    set({ isLoading: true });
    try {
      const cart = await CartService.addToCart(productId, variantId, quantity);
      const coupon = get().appliedCoupon;
      const discount = coupon ? coupon.discountAmount : 0;
      const taxable = Math.max(0, cart.subtotal - discount);
      const tax = Math.round(taxable * 0.18 * 100) / 100;

      set({
        cart,
        items: cart.items,
        itemCount: cart.itemCount,
        subtotal: cart.subtotal,
        shippingFee: cart.shippingFee,
        tax,
        estimatedTotal: Math.round((taxable + cart.shippingFee + tax) * 100) / 100,
        isCartOpen: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({ isLoading: false });
      throw err;
    }
  },

  updateItemQuantity: async (itemId, quantity) => {
    try {
      const cart = await CartService.updateQuantity(itemId, quantity);
      const coupon = get().appliedCoupon;
      const discount = coupon ? coupon.discountAmount : 0;
      const taxable = Math.max(0, cart.subtotal - discount);
      const tax = Math.round(taxable * 0.18 * 100) / 100;

      set({
        cart,
        items: cart.items,
        itemCount: cart.itemCount,
        subtotal: cart.subtotal,
        shippingFee: cart.shippingFee,
        tax,
        estimatedTotal: Math.round((taxable + cart.shippingFee + tax) * 100) / 100,
      });
    } catch (err: any) {
      throw err;
    }
  },

  removeItem: async (itemId) => {
    try {
      const cart = await CartService.removeItem(itemId);
      const coupon = get().appliedCoupon;
      const discount = coupon ? coupon.discountAmount : 0;
      const taxable = Math.max(0, cart.subtotal - discount);
      const tax = Math.round(taxable * 0.18 * 100) / 100;

      set({
        cart,
        items: cart.items,
        itemCount: cart.itemCount,
        subtotal: cart.subtotal,
        shippingFee: cart.shippingFee,
        tax,
        estimatedTotal: Math.round((taxable + cart.shippingFee + tax) * 100) / 100,
      });
    } catch (err: any) {
      throw err;
    }
  },

  clearCart: async () => {
    try {
      await CartService.clearCart();
      set({
        cart: null,
        items: [],
        itemCount: 0,
        subtotal: 0,
        shippingFee: 0,
        tax: 0,
        estimatedTotal: 0,
        appliedCoupon: null,
      });
    } catch (err: any) {
      throw err;
    }
  },

  applyCoupon: async (code: string) => {
    const subtotal = get().subtotal;
    if (subtotal <= 0) {
      throw new Error('Your cart is empty');
    }

    const result = await CouponService.validateCoupon(code, subtotal);
    const taxable = Math.max(0, subtotal - result.discountAmount);
    const tax = Math.round(taxable * 0.18 * 100) / 100;
    const shipping = get().shippingFee;

    set({
      appliedCoupon: {
        code: result.code,
        discountAmount: result.discountAmount,
        discountType: result.discountType,
        discountValue: result.discountValue,
      },
      tax,
      estimatedTotal: Math.round((taxable + shipping + tax) * 100) / 100,
    });
  },

  removeCoupon: () => {
    const subtotal = get().subtotal;
    const shipping = get().shippingFee;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;

    set({
      appliedCoupon: null,
      tax,
      estimatedTotal: Math.round((subtotal + shipping + tax) * 100) / 100,
    });
  },
}));
