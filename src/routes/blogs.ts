import { Router, Request, Response } from 'express';
import Blog from '../models/Blog';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { slug, page = '1', limit = '6' } = req.query as Record<string, string>;

    if (slug) {
      const blog = await Blog.findOne({ slug }).lean();
      if (!blog) {
        res.status(404).json({ success: false, error: 'Not found' });
        return;
      }
      res.json({ success: true, data: blog });
      return;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const [items, total] = await Promise.all([
      Blog.find().sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Blog.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        items, total, page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        hasMore: pageNum * limitNum < total,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;