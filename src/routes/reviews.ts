import mongoose from 'mongoose';
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import Review from '../models/Review';
import Destination from '../models/Destination';
import { validate } from '../middleware/validate';

const router = Router();

const createReviewSchema = z.object({
  destinationId: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const destinationId = typeof req.query.destinationId === 'string' ? req.query.destinationId : undefined;
    const filter: Record<string, unknown> = destinationId
      ? { destinationId: new mongoose.Types.ObjectId(destinationId) }
      : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/', validate(createReviewSchema), async (req: Request, res: Response) => {
  try {
    const review = await Review.create(req.body);
    const reviews = await Review.find({ destinationId: review.destinationId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Destination.findByIdAndUpdate(review.destinationId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    });
    res.status(201).json({ success: true, data: review });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;