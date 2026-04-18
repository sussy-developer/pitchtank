import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware';
import { handlePitchDeckUpload } from '../controllers/upload.controller';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(), // stays in RAM, never hits disk
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB cap
  fileFilter: (_, file, cb) => {
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('PDF only'));
  },
});

router.post(
  '/pitch-deck',
  authMiddleware,
  upload.single('pitchDeck'),
  handlePitchDeckUpload
);

export default router;