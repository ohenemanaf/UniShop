/**
 * File: upload.js
 * Description: Auto-generated documentation for upload.js
 * Date: 2026-07-21
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  authenticate
} = require('../middleware/auth');
const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true
  });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image file.'), false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max size
  }
});

// POST /api/v1/upload
router.post('/', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'No image file provided.'
    });
  }

  // Construct the public URL for the uploaded file
  // Since we'll serve the uploads directory statically from /uploads
  // For simplicity and matching current VITE_API_URL logic, we can return absolute URL or relative.
  // The frontend can prepend the backend host.
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({
    url: imageUrl
  });
});
module.exports = router;