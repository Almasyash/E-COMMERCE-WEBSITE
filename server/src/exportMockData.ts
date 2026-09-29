import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: { addresses: true },
  });

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });

  const products = await prisma.product.findMany({
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
      category: true,
      inventory: true,
      reviews: {
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true },
          },
        },
      },
    },
  });

  const coupons = await prisma.coupon.findMany();

  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: {
            select: { id: true, slug: true, images: { take: 1 } },
          },
        },
      },
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const reviews = await prisma.review.findMany({
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true },
      },
      product: {
        select: { id: true, title: true, slug: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const exportData = {
    users,
    categories,
    products,
    coupons,
    orders,
    reviews,
  };

  const clientDataPath = path.resolve(__dirname, '../../client/src/data/mockDatabase.json');
  fs.mkdirSync(path.dirname(clientDataPath), { recursive: true });
  fs.writeFileSync(clientDataPath, JSON.stringify(exportData, null, 2));
  console.log(`Exported mock database with ${products.length} products, ${categories.length} categories, ${users.length} users, and ${orders.length} orders to ${clientDataPath}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
