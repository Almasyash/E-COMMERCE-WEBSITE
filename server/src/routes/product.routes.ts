import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  productQuerySchema,
  createProductSchema,
  updateProductSchema,
} from '../validators/product.validator';

const router = Router();

// Public catalog routes
router.get('/', validateRequest({ query: productQuerySchema }), ProductController.getProducts);
router.get('/suggestions', ProductController.getSearchSuggestions);
router.get('/:slug', ProductController.getProductBySlug);
router.get('/:id/related', ProductController.getRelated);

// Admin product routes
router.post(
  '/',
  authenticate,
  requireAdmin,
  validateRequest({ body: createProductSchema }),
  ProductController.createProduct
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validateRequest({ body: updateProductSchema }),
  ProductController.updateProduct
);

router.delete('/:id', authenticate, requireAdmin, ProductController.deleteProduct);

export default router;
