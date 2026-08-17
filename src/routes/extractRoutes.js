import { Router } from 'express';
import multer from 'multer';
import { handleExtract } from '../controllers/extractController.js';
import { extractRateLimiter } from '../config/rateLimiter.js';

const router = Router();

// Configure multer for memory storage and file size limit (10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

/**
 * POST /api/extract
 * Protected by express-rate-limit middleware.
 */
router.post('/extract', extractRateLimiter, upload.single('file'), handleExtract);

export default router;
