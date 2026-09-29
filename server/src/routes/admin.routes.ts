import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard-stats', AdminController.getDashboardStats);
router.get('/customers', AdminController.getCustomers);
router.patch('/customers/:id/toggle-status', AdminController.toggleCustomerStatus);

export default router;
