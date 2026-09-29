import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { checkoutSchema, updateOrderStatusSchema, cancelOrderSchema } from '../validators/order.validator';

const router = Router();

router.post('/checkout', authenticate, validateRequest({ body: checkoutSchema }), OrderController.checkout);
router.get('/my-orders', authenticate, OrderController.getMyOrders);
router.get('/:id', authenticate, OrderController.getOrderById);
router.post('/:id/cancel', authenticate, validateRequest({ body: cancelOrderSchema }), OrderController.cancelOrder);

// Admin order routes
router.get('/admin/all', authenticate, requireAdmin, OrderController.getAllOrders);
router.patch(
  '/admin/:id/status',
  authenticate,
  requireAdmin,
  validateRequest({ body: updateOrderStatusSchema }),
  OrderController.updateOrderStatus
);

export default router;
