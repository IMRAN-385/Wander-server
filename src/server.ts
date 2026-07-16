import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import destinationRoutes from './routes/destinations';
import reviewRoutes from './routes/reviews';
import blogRoutes from './routes/blogs';
import userRoutes from './routes/users';

const app = express();
const PORT = process.env.PORT || 5000;

// Allow local dev origins plus the deployed frontend(s). Add any additional
// production/preview domains to this list (or set FRONTEND_URL in env).
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://wander-client-gilt.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no origin header, e.g. curl/Postman/server-to-server)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        // Vercel preview deployments get unique subdomains per branch/PR
        /\.vercel\.app$/.test(new URL(origin).hostname)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Wanderlust API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

export default app;