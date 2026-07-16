import { Router } from 'express';
import { createReview, deleteReview } from '../controllers/reviews.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createReview);
router.delete('/:id', authenticate, deleteReview);

export default router;