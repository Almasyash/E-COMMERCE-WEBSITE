import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', CategoryController.getCategories);
router.post('/', authenticate, requireAdmin, CategoryController.createCategory);
router.put('/:id', authenticate, requireAdmin, CategoryController.updateCategory);
router.delete('/:id', authenticate, requireAdmin, CategoryController.deleteCategory);

export default router;
