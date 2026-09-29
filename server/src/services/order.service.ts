import prisma from '../config/database';
import { ApiError } from '../utils/apiError';
import { CouponService } from './coupon.service';

export class OrderService {
  static async checkout(
    userId: string,
    data: {
      shippingAddress: any;
      paymentMethod: string;
      couponCode?: string;
      notes?: string;
    }
  ) {
    // 1. Retrieve user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { inventory: true },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw ApiError.badRequest('Your cart is empty');
    }

    // 2. Validate inventory for all items
    let subtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of cart.items) {
      if (!item.product.isPublished) {
        throw ApiError.badRequest(`Product "${item.product.title}" is no longer available`);
      }

      const availableStock = item.variant
        ? item.variant.stock
        : item.product.inventory?.quantity ?? 0;

      if (availableStock < item.quantity) {
        throw ApiError.badRequest(
          `Insufficient stock for "${item.product.title}${
            item.variant ? ` (${item.variant.name})` : ''
          }". Available: ${availableStock}, Requested: ${item.quantity}`
        );
      }

      const unitPrice = item.variant
        ? Number(item.variant.salePrice || item.variant.price)
        : Number(item.product.salePrice || item.product.price);

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        variantId: item.variantId || null,
        productName: item.product.title,
        variantName: item.variant?.name || null,
        sku: item.variant ? item.variant.sku : item.product.sku,
        price: unitPrice,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // 3. Process Coupon Discount server-side
    let discount = 0;
    let validCoupon: any = null;

    if (data.couponCode) {
      validCoupon = await CouponService.validateCoupon(data.couponCode, subtotal, userId);
      discount = validCoupon.discountAmount;
    }

    const shippingFee = subtotal > 2000 ? 0 : 99;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * 0.18 * 100) / 100; // 18% standard GST
    const grandTotal = Math.round((taxableAmount + shippingFee + tax) * 100) / 100;

    const orderNumber = `APX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // 4. Create Order and deduct stock in a Prisma transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: 'CONFIRMED' as any,
          paymentStatus: (data.paymentMethod === 'COD' ? 'PENDING' : 'PAID') as any,
          paymentMethod: data.paymentMethod,
          subtotal,
          discount,
          shippingFee,
          tax,
          total: grandTotal,
          shippingAddress: JSON.stringify(data.shippingAddress),
          notes: data.notes || null,
          items: {
            create: orderItemsData,
          },
          payments: {
            create: {
              amount: grandTotal,
              currency: 'INR',
              provider: data.paymentMethod,
              transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
              status: (data.paymentMethod === 'COD' ? 'PENDING' : 'PAID') as any,
            },
          },
        },
        include: {
          items: true,
          payments: true,
        },
      });

      // Deduct inventory
      for (const item of cart.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
        if (item.product.inventory) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: { quantity: { decrement: item.quantity } },
          });
        }
      }

      // Record coupon usage
      if (validCoupon) {
        await tx.couponUsage.create({
          data: {
            couponId: validCoupon.couponId,
            userId,
            orderId: newOrder.id,
            discountAmount: discount,
          },
        });

        await tx.coupon.update({
          where: { id: validCoupon.couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Empty user cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      // Create notification
      await tx.notification.create({
        data: {
          userId,
          title: 'Order Confirmed!',
          message: `Your order #${orderNumber} for ₹${grandTotal.toLocaleString()} has been placed successfully.`,
          type: 'ORDER',
          link: `/account/orders/${newOrder.id}`,
        },
      });

      return newOrder;
    });

    return order;
  }

  static async getCustomerOrders(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, orders] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  slug: true,
                  images: { where: { isPrimary: true }, take: 1 },
                },
              },
            },
          },
          payments: true,
        },
      }),
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getOrderById(orderId: string, userId?: string) {
    const where: any = { id: orderId };
    if (userId) {
      where.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
            reviews: {
              where: userId ? { userId } : undefined,
            },
          },
        },
        payments: true,
        couponUsages: {
          include: { coupon: true },
        },
      },
    });

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    return {
      ...order,
      shippingAddress: JSON.parse(order.shippingAddress),
    };
  }

  static async cancelOrder(orderId: string, userId: string, reason: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true },
    });

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    const cancellableStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING'];
    if (!cancellableStatuses.includes(order.status)) {
      throw ApiError.badRequest(
        `Order cannot be cancelled in "${order.status}" status. Please contact customer support.`
      );
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const cancelled = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED' as any,
          cancelledAt: new Date(),
          cancellationReason: reason,
        },
      });

      // Restore stock
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }
        await tx.inventory.updateMany({
          where: { productId: item.productId },
          data: { quantity: { increment: item.quantity } },
        });
      }

      await tx.notification.create({
        data: {
          userId,
          title: 'Order Cancelled',
          message: `Your order #${order.orderNumber} has been cancelled.`,
          type: 'ORDER',
          link: `/account/orders/${order.id}`,
        },
      });

      return cancelled;
    });

    return updatedOrder;
  }

  // Admin Order Operations
  static async getAllOrders(query: {
    status?: string;
    paymentStatus?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 15;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.paymentStatus) {
      where.paymentStatus = query.paymentStatus;
    }

    if (query.search) {
      const term = query.search.trim();
      where.OR = [
        { orderNumber: { contains: term } },
        { user: { email: { contains: term } } },
        { user: { firstName: { contains: term } } },
        { user: { lastName: { contains: term } } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          items: true,
          payments: true,
        },
      }),
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async updateOrderStatus(
    orderId: string,
    data: {
      status?: string;
      trackingNumber?: string;
      paymentStatus?: string;
    }
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(data.status ? { status: data.status as any } : {}),
        ...(data.trackingNumber !== undefined ? { trackingNumber: data.trackingNumber } : {}),
        ...(data.paymentStatus ? { paymentStatus: data.paymentStatus as any } : {}),
      },
    });

    if (data.status && data.status !== order.status) {
      await prisma.notification.create({
        data: {
          userId: order.userId,
          title: `Order Status Update: ${data.status}`,
          message: `Your order #${order.orderNumber} is now ${data.status}.`,
          type: 'ORDER',
          link: `/account/orders/${order.id}`,
        },
      });
    }

    return updated;
  }
}
