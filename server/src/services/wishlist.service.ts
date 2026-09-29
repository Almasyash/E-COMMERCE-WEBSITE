import prisma from '../config/database';
import { ApiError } from '../utils/apiError';

export class WishlistService {
  static async getWishlist(userId: string) {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                inventory: true,
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                  inventory: true,
                },
              },
            },
          },
        },
      });
    }

    return wishlist.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      title: item.product.title,
      slug: item.product.slug,
      brand: item.product.brand,
      price: Number(item.product.price),
      salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
      rating: item.product.rating,
      image: item.product.images[0]?.url || null,
      inStock: (item.product.inventory?.quantity ?? 0) > 0,
      createdAt: item.createdAt,
    }));
  }

  static async toggleWishlist(userId: string, productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return { isInWishlist: false, message: 'Removed from wishlist' };
    } else {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });
      return { isInWishlist: true, message: 'Added to wishlist' };
    }
  }
}
