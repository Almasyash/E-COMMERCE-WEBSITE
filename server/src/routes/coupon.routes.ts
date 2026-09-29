import { Router } from 'express';
import { CouponController } from '../controllers/coupon.controller';
import { authenticate, requireAdmin, optionalAuthenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { validateCouponSchema, createCouponSchema, updateCouponSchema } from '../validators/coupon.validator';

const router = Router();

// Validate coupon during cart or checkout
router.post('/validate', optionalAuthenticate, validateRequest({ body: validateCouponSchema }), CouponController.validateCoupon);

// Admin coupon management
router.get('/', authenticate, requireAdmin, CouponController.getAllCoupons);
router.post('/', authenticate, requireAdmin, validateRequest({ body: createCouponSchema }), CouponController.createCoupon);
router.put('/:id', authenticate, requireAdmin, validateRequest({ body: updateCouponSchema }), CouponController.updateCoupon);
router.delete('/:id', authenticate, requireAdmin, CouponController.deleteCoupon);

export default router;
