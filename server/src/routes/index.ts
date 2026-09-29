import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import cartRoutes from './cart.routes';
import wishlistRoutes from './wishlist.routes';
import orderRoutes from './order.routes';
import couponRoutes from './coupon.routes';
import reviewRoutes from './review.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ApexCart E-Commerce Platform API',
    version: '1.0.0',
  });
});

import { authenticate, requireAdmin } from '../middleware/auth.middleware';

router.post('/setup-db', authenticate, requireAdmin, async (_req, res) => {
  const { ensureDatabaseSetup } = await import('../config/initDatabase');
  const result = await ensureDatabaseSetup();
  res.status(result.success ? 200 : 500).json(result);
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/coupons', couponRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);

export default router;
