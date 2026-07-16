import { Request, Response } from 'express';
import User from '../models/User';

// GET /api/users/me (protected)
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

// PATCH /api/users/me (protected)
export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Only allow updating safe, self-editable fields.
    // Email/password/role changes should go through their own dedicated,
    // more carefully-validated endpoints — not this general profile update.
    const { name, avatar } = req.body;
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(400).json({ success: false, message: 'Failed to update profile' });
  }
};

// POST /api/users/wishlist/:destinationId (protected) — adds or removes depending on current state
export const toggleWishlist = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { destinationId } = req.params;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const index = user.wishlist.findIndex((id) => id.toString() === destinationId);
    if (index >= 0) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(destinationId as never);
    }

    await user.save();

    res.status(200).json({ success: true, data: { wishlist: user.wishlist } });
  } catch (error) {
    console.error('toggleWishlist error:', error);
    res.status(500).json({ success: false, message: 'Failed to update wishlist' });
  }
};

// GET /api/users/wishlist (protected) — returns full destination documents, not just ids
export const getWishlist = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user.wishlist });
  } catch (error) {
    console.error('getWishlist error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
  }
};