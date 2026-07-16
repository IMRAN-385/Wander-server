import { Router } from 'express';
import { getProfile, updateProfile, toggleWishlist, getWishlist } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, getProfile);
router.patch('/me', authenticate, updateProfile);
router.get('/wishlist', authenticate, getWishlist);
router.post('/wishlist/:destinationId', authenticate, toggleWishlist);

export default router;