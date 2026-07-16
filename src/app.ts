import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import blogRoutes from './routes/blogs';
import destinationRoutes from './routes/destinations';
import reviewRoutes from './routes/reviews';
import userRoutes from './routes/users';

const app = express();

// --- Core middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check ---
app.get('/', (_req, res) => {
  res.send('Server is running');
});

// --- API routes ---
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// --- 404 handler for unmatched routes ---
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// --- Global error handler ---
app.use(
  (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
);

export default app;