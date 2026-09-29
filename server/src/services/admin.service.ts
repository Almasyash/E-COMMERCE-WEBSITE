import prisma from '../config/database';

export class AdminService {
  static async getDashboardStats() {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      pendingOrders,
      revenueResult,
      lowStockProducts,
      recentOrders,
      recentCustomers,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' as any } }),
      prisma.order.count({ where: { status: 'PENDING' as any } }),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' as any },
        _sum: { total: true },
      }),
      prisma.inventory.findMany({
        where: {
          quantity: { lte: 10 },
        },
        take: 8,
        include: {
          product: {
            select: { id: true, title: true, sku: true, price: true },
          },
        },
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      prisma.user.findMany({
        where: { role: 'CUSTOMER' as any },
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
    ]);

    const totalRevenue = revenueResult._sum.total ? Number(revenueResult._sum.total) : 0;

    // Monthly sales data for chart
    const ordersWithDates = await prisma.order.findMany({
      where: { paymentStatus: 'PAID' as any },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const salesByMonth: Record<string, number> = {};
    for (const order of ordersWithDates) {
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
      salesByMonth[month] = (salesByMonth[month] || 0) + Number(order.total);
    }

    const salesChart = Object.keys(salesByMonth).map((month) => ({
      name: month,
      revenue: salesByMonth[month],
    }));

    return {
      metrics: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
      },
      lowStockProducts,
      recentOrders,
      recentCustomers,
      salesChart: salesChart.length > 0 ? salesChart : [
        { name: 'May', revenue: 45000 },
        { name: 'Jun', revenue: 78000 },
        { name: 'Jul', revenue: 92000 },
        { name: 'Aug', revenue: 110000 },
        { name: 'Sep', revenue: totalRevenue || 145000 },
      ],
    };
  }

  static async getCustomers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { role: 'CUSTOMER' as any };

    if (search) {
      const term = search.trim();
      where.OR = [
        { email: { contains: term } },
        { firstName: { contains: term } },
        { lastName: { contains: term } },
      ];
    }

    const [total, customers] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
          _count: { select: { orders: true, reviews: true } },
        },
      }),
    ]);

    return { customers, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async toggleCustomerStatus(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    return await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: { id: true, email: true, isActive: true },
    });
  }
}
