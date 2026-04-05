import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import authMiddleware from '../middleware/auth';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const uploadPromises = files.map(file =>
      cloudinary.uploader.upload(file.path, { folder: 'skincare' })
    );

    const results = await Promise.all(uploadPromises);
    const urls = results.map(result => result.secure_url);

    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;