import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
// health
app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

// auth routes
app.use('/api/auth', authRoutes);
app.use('/api/problems' , authMiddleware, (await import('./routes/problems.js')).default);
app.use('/api/progress' , authMiddleware, (await import('./routes/progress.routes.js')).default);

// protected route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Access granted',
    user: req.user,
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});