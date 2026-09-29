import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { optionalAuthenticate, authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { cartItemSchema, updateCartItemSchema } from '../validators/order.validator';

const router = Router();

router.get('/', optionalAuthenticate, CartController.getCart);
router.post('/items', optionalAuthenticate, validateRequest({ body: cartItemSchema }), CartController.addToCart);
router.put('/items/:itemId', optionalAuthenticate, validateRequest({ body: updateCartItemSchema }), CartController.updateQuantity);
router.delete('/items/:itemId', optionalAuthenticate, CartController.removeItem);
router.delete('/clear', optionalAuthenticate, CartController.clearCart);
router.post('/merge', authenticate, CartController.mergeCart);

export default router;
