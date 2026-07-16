import { Request, Response } from 'express';
import Blog from '../models/Blog';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Rough estimate at the standard ~200 words/minute average reading speed
function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// GET /api/blogs
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const { search, category, page = '1', limit = '9' } = req.query;

    const query: Record<string, unknown> = {};
    if (search) {
      query.title = { $regex: search as string, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort('-createdAt').skip(skip).limit(limitNum),
      Blog.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        blogs,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('getBlogs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
};

// GET /api/blogs/:slug
export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const related = await Blog.find({
      _id: { $ne: blog._id },
      category: blog.category,
    }).limit(3);

    res.status(200).json({ success: true, data: { blog, related } });
  } catch (error) {
    console.error('getBlogBySlug error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blog post' });
  }
};

// POST /api/blogs (protected)
export const createBlog = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    let slug = slugify(title);
    const existing = await Blog.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const blog = await Blog.create({
      ...req.body,
      slug,
      readTime: estimateReadTime(content),
      authorId: req.user.userId,
      authorName: req.user.name,
    });

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    console.error('createBlog error:', error);
    res.status(400).json({ success: false, message: 'Failed to create blog post' });
  }
};

// DELETE /api/blogs/:id (protected — owner or admin only)
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const isOwner = blog.authorId?.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await blog.deleteOne();
    res.status(200).json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    console.error('deleteBlog error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete blog post' });
  }
};