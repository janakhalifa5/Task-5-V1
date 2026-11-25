import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import authRoutes from './routes/auth.js';
import reviewRoutes from './routes/reviews.js';
import userRoutes from './routes/users.js';
import instructorRoutes from './routes/instructors.js';

const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:5175', credentials: false }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/instructors', instructorRoutes);

// Not found
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

app.use((req, res, next) => {
  if (req.body) {
    mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  }
  if (req.params) {
    mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  }
  if (req.query && typeof req.query === 'object') {
    const cleanQuery = { ...req.query };
    mongoSanitize.sanitize(cleanQuery, { replaceWith: '_' });
    req.sanitizedQuery = cleanQuery;
  }
  next();
});
export default app;
