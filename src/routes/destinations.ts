import mongoose from 'mongoose';
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import Destination from '../models/Destination';
import Review from '../models/Review';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const createSchema = z.object({
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  fullDescription: z.string().min(1),
  category: z.string().min(1),
  location: z.string().min(1),
  country: z.string().min(1),
  continent: z.string().optional(),
  price: z.number().optional(),
  bestSeason: z.string().optional(),
  activities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// GET all destinations with filters, sort, pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      search, category, continent, minPrice, maxPrice,
      minRating, location, sortBy = 'newest',
      page = '1', limit = '8', featured, trending,
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};

    if (featured === 'true') filter.featured = true;
    if (trending === 'true') filter.trending = true;

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { title: regex }, { shortDescription: regex },
        { location: regex }, { country: regex }, { category: regex },
      ];
    }
    if (category) filter.category = category;
    if (continent) filter.continent = continent;
    if (minPrice) filter.price = { ...(filter.price as object || {}), $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...(filter.price as object || {}), $lte: Number(maxPrice) };
    if (minRating) filter.rating = { $gte: Number(minRating) };

    const sortMap: Record<string, Record<string, number>> = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'rating-desc': { rating: -1 },
      'rating-asc': { rating: 1 },
      oldest: { createdAt: 1 },
      newest: { createdAt: -1 },
      popular: { reviewCount: -1 },
    };
    const sort: Record<string, number> = sortMap[sortBy] || sortMap.newest;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Destination.find(filter).sort(sort as any).skip(skip).limit(limitNum).lean(),
      Destination.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        items, total, page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        hasMore: pageNum * limitNum < total,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET single destination by slug or id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findOne({
      $or: [{ _id: id }, { slug: id }],
    }).lean();

    if (!destination) {
      res.status(404).json({ success: false, error: 'Destination not found' });
      return;
    }

    const destinationId = destination._id;

    const [reviews, related] = await Promise.all([
      Review.find({ destinationId: destination._id as any } as any).sort({ createdAt: -1 }).lean(),
      Destination.find({
        _id: { $ne: destination._id },
        category: destination.category,
      }).limit(4).lean(),
    ]);

    res.json({ success: true, data: { destination, reviews, related } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// CREATE
router.post('/', authenticate, validate(createSchema), async (req: Request, res: Response) => {
  try {
    const destination = await Destination.create({
      ...req.body,
      slug: slugify(req.body.title),
      authorId: req.user!.userId,
      authorName: req.user!.name,
    });
    res.status(201).json({ success: true, data: destination });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      res.status(404).json({ success: false, error: 'Not found' });
      return;
    }
    if (req.user!.role !== 'admin' && destination.authorId.toString() !== req.user!.userId) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }
    await destination.deleteOne();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;