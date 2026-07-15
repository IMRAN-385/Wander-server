import { Router, Request, Response } from 'express';
import User from '../models/User';
import { authenticate } from '../middleware/auth';

const router = Router();

// Toggle wishlist
router.post('/wishlist/:destinationId', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const destId = req.params.destinationId as unknown as any;
    const idx = user.wishlist.findIndex(id => id.toString() === destId);
    if (idx === -1) {
      user.wishlist.push(destId);
    } else {
      user.wishlist.splice(idx, 1);
    }
    await user.save();

    res.json({ success: true, data: { wishlist: user.wishlist } });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get profile
router.get('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId).populate('wishlist').lean();
    if (!user) {
      res.status(404).json({ success: false, error: 'Not found' });
      return;
    }
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;