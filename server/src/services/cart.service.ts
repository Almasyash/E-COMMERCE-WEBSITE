import prisma from '../config/database';
import { ApiError } from '../utils/apiError';

export class CartService {
  static async getOrCreateCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw ApiError.badRequest('Either userId or sessionId must be provided');
    }

    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                inventory: true,
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId || null,
          sessionId: !userId ? sessionId : null,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                  inventory: true,
                },
              },
              variant: true,
            },
          },
        },
      });
    }

    return this.calculateCartSummary(cart);
  }

  static async addToCart(
    identifier: { userId?: string; sessionId?: string },
    data: { productId: string; variantId?: string | null; quantity: number }
  ) {
    const { productId, variantId, quantity } = data;

    // Check product exists and is published
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { inventory: true, variants: true },
    });

    if (!product || !product.isPublished) {
      throw ApiError.notFound('Product not found or currently unavailable');
    }

    let availableStock = product.inventory?.quantity ?? 0;

    if (variantId) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant) {
        throw ApiError.notFound('Selected variant does not exist');
      }
      availableStock = variant.stock;
    }

    if (availableStock <= 0) {
      throw ApiError.badRequest('Product is out of stock');
    }

    const cart = await this.getRawCart(identifier);

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    const newQuantity = (existingItem?.quantity ?? 0) + quantity;

    if (newQuantity > availableStock) {
      throw ApiError.badRequest(
        `Cannot add ${quantity} item(s). Only ${availableStock} in stock (already in cart: ${existingItem?.quantity ?? 0})`
      );
    }

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
        },
      });
    }

    return this.getOrCreateCart(identifier.userId, identifier.sessionId);
  }

  static async updateQuantity(
    identifier: { userId?: string; sessionId?: string },
    itemId: string,
    quantity: number
  ) {
    if (quantity <= 0) {
      return this.removeItem(identifier, itemId);
    }

    const cart = await this.getRawCart(identifier);
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: {
        product: { include: { inventory: true } },
        variant: true,
      },
    });

    if (!item) {
      throw ApiError.notFound('Cart item not found');
    }

    const availableStock = item.variant ? item.variant.stock : item.product.inventory?.quantity ?? 0;
    if (quantity > availableStock) {
      throw ApiError.badRequest(`Requested quantity exceeds available stock (${availableStock})`);
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getOrCreateCart(identifier.userId, identifier.sessionId);
  }

  static async removeItem(identifier: { userId?: string; sessionId?: string }, itemId: string) {
    const cart = await this.getRawCart(identifier);
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw ApiError.notFound('Cart item not found');
    }

    await prisma.cartItem.delete({ where: { id: itemId } });
    return this.getOrCreateCart(identifier.userId, identifier.sessionId);
  }

  static async clearCart(identifier: { userId?: string; sessionId?: string }) {
    const cart = await this.getRawCart(identifier);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.getOrCreateCart(identifier.userId, identifier.sessionId);
  }

  static async mergeGuestCart(userId: string, sessionId: string) {
    const guestCart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) {
      return this.getOrCreateCart(userId);
    }

    const userCart = await this.getRawCart({ userId });

    for (const item of guestCart.items) {
      const existing = await prisma.cartItem.findFirst({
        where: {
          cartId: userCart.id,
          productId: item.productId,
          variantId: item.variantId,
        },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          },
        });
      }
    }

    await prisma.cart.delete({ where: { id: guestCart.id } });
    return this.getOrCreateCart(userId);
  }

  private static async getRawCart(identifier: { userId?: string; sessionId?: string }) {
    let cart = await prisma.cart.findFirst({
      where: identifier.userId ? { userId: identifier.userId } : { sessionId: identifier.sessionId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: identifier.userId || null,
          sessionId: !identifier.userId ? identifier.sessionId : null,
        },
      });
    }

    return cart;
  }

  private static calculateCartSummary(cart: any) {
    let subtotal = 0;
    let itemCount = 0;

    const formattedItems = cart.items.map((item: any) => {
      const price = item.variant
        ? Number(item.variant.salePrice || item.variant.price)
        : Number(item.product.salePrice || item.product.price);

      const originalPrice = item.variant
        ? Number(item.variant.price)
        : Number(item.product.price);

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;
      itemCount += item.quantity;

      const availableStock = item.variant
        ? item.variant.stock
        : item.product.inventory?.quantity ?? 0;

      return {
        id: item.id,
        productId: item.productId,
        productName: item.product.title,
        productSlug: item.product.slug,
        brand: item.product.brand,
        image: item.product.images[0]?.url || null,
        variantId: item.variantId,
        variantName: item.variant?.name || null,
        price,
        originalPrice,
        quantity: item.quantity,
        total: itemTotal,
        inStock: availableStock >= item.quantity,
        availableStock,
      };
    });

    const shippingFee = subtotal > 2000 || subtotal === 0 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% standard GST
    const estimatedTotal = subtotal + shippingFee + tax;

    return {
      id: cart.id,
      items: formattedItems,
      itemCount,
      subtotal,
      shippingFee,
      tax,
      estimatedTotal,
    };
  }
}
