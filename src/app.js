import express from 'express';
import cors from 'cors';
import multer from 'multer';
import extractRoutes from './routes/extractRoutes.js';

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'dental-labform-extractor',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', extractRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler Middleware
app.use((err, req, res, _next) => {
  console.error('[Error]', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 400,
        error: 'File Too Large',
        message: 'File size exceeds the 10MB limit.'
      });
    }
    return res.status(400).json({
      status: 400,
      error: 'Upload Error',
      message: err.message
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    status: statusCode,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

export default app;
