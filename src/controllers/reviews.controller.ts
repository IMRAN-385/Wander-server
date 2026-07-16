import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Review from '../models/Review';
import Destination from '../models/Destination';

// Recalculates and persists a destination's aggregate rating + review count.
// Called any time a review is created or deleted so the numbers never go stale.
async function syncDestinationRating(destinationId: string) {
  const stats = await Review.aggregate([
    { $match: { destinationId: new Types.ObjectId(destinationId) } },
    { $group: { _id: '$destinationId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const avgRating = stats[0]?.avgRating ?? 0;
  const count = stats[0]?.count ?? 0;

  await Destination.findByIdAndUpdate(destinationId, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: count,
  });
}

// POST /api/reviews (protected)
export const createReview = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { destinationId, rating, comment } = req.body;
    if (!destinationId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'destinationId, rating and comment are required' });
    }

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    const alreadyReviewed = await Review.findOne({ destinationId: destinationId, userId: req.user.userId } as Record<string, unknown>);
    if (alreadyReviewed) {
      return res.status(409).json({ success: false, message: 'You already reviewed this destination' });
    }

    const review = await Review.create({
      destinationId: destinationId,
      userId: req.user.userId,
      userName: req.user.name,
      rating,
      comment,
    } as Record<string, unknown>);

    await syncDestinationRating(destinationId);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error('createReview error:', error);
    res.status(500).json({ success: false, message: 'Failed to create review' });
  }
};

// DELETE /api/reviews/:id (protected — owner or admin only)
export const deleteReview = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const isOwner = review.userId.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const destinationId = review.destinationId.toString();
    await review.deleteOne();
    await syncDestinationRating(destinationId);

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('deleteReview error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
};