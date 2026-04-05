import multer from 'multer';
import { badRequest } from '../lib/errors.js';

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(badRequest('Only image uploads are allowed'));
      return;
    }

    callback(null, true);
  },
});
