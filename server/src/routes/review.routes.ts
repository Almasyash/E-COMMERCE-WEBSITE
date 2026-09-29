import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createReviewSchema } from '../validators/review.validator';

const router = Router();

// Public: get reviews for a product
router.get('/product/:productId', ReviewController.getProductReviews);

// Customer: submit review (verified purchase validated in service)
router.post('/', authenticate, validateRequest({ body: createReviewSchema }), ReviewController.createReview);

// Admin review moderation
router.get('/admin/all', authenticate, requireAdmin, ReviewController.getAllReviews);
router.patch('/admin/:id/approval', authenticate, requireAdmin, ReviewController.toggleApproval);
router.delete('/admin/:id', authenticate, requireAdmin, ReviewController.deleteReview);

export default router;
