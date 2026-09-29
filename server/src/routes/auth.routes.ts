import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { authRateLimiter } from '../middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  addressSchema,
} from '../validators/auth.validator';

const router = Router();

router.post(
  '/register',
  authRateLimiter,
  validateRequest({ body: registerSchema }),
  AuthController.register
);

router.post(
  '/login',
  authRateLimiter,
  validateRequest({ body: loginSchema }),
  AuthController.login
);

router.post(
  '/refresh',
  validateRequest({ body: refreshTokenSchema }),
  AuthController.refreshToken
);

router.get('/me', authenticate, AuthController.getMe);
router.put('/me', authenticate, validateRequest({ body: updateProfileSchema }), AuthController.updateMe);

// Address endpoints
router.post('/addresses', authenticate, validateRequest({ body: addressSchema }), AuthController.addAddress);
router.put('/addresses/:id', authenticate, validateRequest({ body: addressSchema }), AuthController.updateAddress);
router.delete('/addresses/:id', authenticate, AuthController.deleteAddress);

export default router;
