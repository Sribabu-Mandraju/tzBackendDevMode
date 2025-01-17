import express from 'express';
import multer from 'multer';
import fs from 'fs'; // Ensure fs is imported for file operations
import { uploadFileToGoogleDrive } from '../controllers/uploadController.js';

const router = express.Router();

// Define where to store uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    // Ensure the directory exists
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original file name
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Define POST route for file upload
router.post('/upload', upload.single('file'), uploadFileToGoogleDrive);

export default router;
